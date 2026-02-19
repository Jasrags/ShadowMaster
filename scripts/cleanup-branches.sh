#!/usr/bin/env bash
set -euo pipefail

# Branches to never delete
PROTECTED=("main" "master" "develop" "staging")

is_protected() {
  local branch="$1"
  for p in "${PROTECTED[@]}"; do
    [[ "$branch" == "$p" ]] && return 0
  done
  return 1
}

# Detect squash-merged branches by checking if the branch's diff
# is already contained in main (tree matches after cherry-pick)
is_squash_merged() {
  local branch="$1"
  local merge_base ancestor_tree
  merge_base=$(git merge-base main "$branch" 2>/dev/null) || return 1
  # Create a temporary squash-merge tree and check if it matches main
  ancestor_tree=$(git rev-parse "$merge_base:") || return 1
  local branch_tree
  branch_tree=$(git diff --quiet main..."$branch" 2>/dev/null && echo "clean") || true
  if [[ "$branch_tree" == "clean" ]]; then
    return 0
  fi
  # Alternative: check if cherry-pick of all commits would be empty
  # by testing if the patch is already applied
  git cherry main "$branch" 2>/dev/null | grep -qv '^+' 2>/dev/null
}

# Check if branch has a closed/merged PR on GitHub
has_merged_pr() {
  local branch="$1"
  if command -v gh &>/dev/null; then
    local state
    state=$(gh pr list --head "$branch" --state merged --json number --jq 'length' 2>/dev/null) || return 1
    [[ "$state" -gt 0 ]] && return 0
  fi
  return 1
}

current_branch=$(git branch --show-current)

echo "=== Local Branch Cleanup ==="
echo "Current branch: $current_branch"
echo ""

# Fetch latest remote state for accurate comparison
echo "Fetching latest from origin..."
git fetch origin main --quiet 2>/dev/null || true
echo ""

# Collect all non-protected local branches
all_local=()
while read -r b; do
  b=$(echo "$b" | sed 's/^[* ]*//')
  is_protected "$b" && continue
  [[ "$b" == "$current_branch" ]] && continue
  [[ -z "$b" ]] && continue
  all_local+=("$b")
done < <(git branch)

if [[ ${#all_local[@]} -eq 0 ]]; then
  echo "No branches to clean up."
  exit 0
fi

# Categorize branches
merged=()
unmerged=()

echo "Checking ${#all_local[@]} branches..."
for b in "${all_local[@]}"; do
  # Check git-native merge detection first (fast)
  if git branch --merged main | sed 's/^[* ]*//' | grep -qx "$b" 2>/dev/null; then
    merged+=("$b")
  # Check if diff against main is empty (squash-merged)
  elif is_squash_merged "$b"; then
    merged+=("$b")
  # Check GitHub for merged PRs
  elif has_merged_pr "$b"; then
    merged+=("$b")
  else
    unmerged+=("$b")
  fi
done
echo ""

# Show merged branches
if [[ ${#merged[@]} -gt 0 ]]; then
  echo "--- Merged into main (safe to delete) ---"
  for b in "${merged[@]}"; do
    last_commit=$(git log -1 --format="%ar - %s" "$b" 2>/dev/null || echo "unknown")
    printf "  %-45s %s\n" "$b" "$last_commit"
  done
  echo ""
fi

# Show unmerged branches
if [[ ${#unmerged[@]} -gt 0 ]]; then
  echo "--- NOT merged into main ---"
  for b in "${unmerged[@]}"; do
    last_commit=$(git log -1 --format="%ar - %s" "$b" 2>/dev/null || echo "unknown")
    printf "  %-45s %s\n" "$b" "$last_commit"
  done
  echo ""
fi

# Prompt for action
echo "Options:"
echo "  1) Delete all merged branches"
echo "  2) Delete merged branches interactively (one by one)"
echo "  3) Delete ALL branches interactively (including unmerged)"
echo "  4) Exit"
echo ""
read -rp "Choose [1-4]: " choice

delete_branch() {
  local branch="$1" force="${2:-false}"
  if [[ "$force" == "true" ]]; then
    git branch -D "$branch" 2>&1
  else
    git branch -D "$branch" 2>&1
  fi
}

is_merged_branch() {
  local branch="$1"
  for m in "${merged[@]}"; do
    [[ "$m" == "$branch" ]] && return 0
  done
  return 1
}

case "$choice" in
  1)
    if [[ ${#merged[@]} -eq 0 ]]; then
      echo "No merged branches to delete."
      exit 0
    fi
    for b in "${merged[@]}"; do
      delete_branch "$b"
    done
    echo "Done. Deleted ${#merged[@]} branches."
    ;;
  2)
    if [[ ${#merged[@]} -eq 0 ]]; then
      echo "No merged branches to delete."
      exit 0
    fi
    count=0
    for b in "${merged[@]}"; do
      read -rp "Delete '$b'? [y/N] " yn
      if [[ "$yn" =~ ^[Yy]$ ]]; then
        delete_branch "$b"
        ((count++))
      fi
    done
    echo "Done. Deleted $count branches."
    ;;
  3)
    count=0
    for b in "${merged[@]+"${merged[@]}"}" "${unmerged[@]+"${unmerged[@]}"}"; do
      [[ -z "$b" ]] && continue
      if is_merged_branch "$b"; then
        label="(merged)"
      else
        label="(UNMERGED)"
      fi
      read -rp "Delete '$b' $label? [y/N] " yn
      if [[ "$yn" =~ ^[Yy]$ ]]; then
        delete_branch "$b" true
        ((count++))
      fi
    done
    echo "Done. Deleted $count branches."
    ;;
  *)
    echo "Exiting."
    ;;
esac
