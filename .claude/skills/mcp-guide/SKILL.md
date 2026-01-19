---
name: mcp-guide
description: Guide for selecting and using MCP servers (Git, GitHub, Context7, Knip, Memory, Sequential Thinking). Use when you need help choosing the right tool for version control, GitHub operations, documentation lookup, dead code detection, or knowledge persistence.
allowed-tools: Read, Grep, Glob
---

# MCP Server Usage Guide

This project has MCP servers configured in the workspace `.mcp.json` file. These tools form the **AI Project Management Additions** to assist with automated linting, state tracking, and development.

## Available Servers

| Server                 | Purpose                      | When to Use                                                           |
| ---------------------- | ---------------------------- | --------------------------------------------------------------------- |
| **context7**           | Library documentation lookup | Query up-to-date docs for libraries/frameworks (React, Next.js, etc.) |
| **github**             | GitHub API operations        | PRs, issues, repos, commits, code search via GitHub API               |
| **knip**               | Dead code detection          | Find unused exports, dependencies, and files in the codebase          |
| **spec-lint**          | Enforce spec immutability    | Automatically run to ensure no progress leaks into specs              |
| **next-devtools**      | Next.js inspection           | Debugging React components and Next.js state                          |
| **memory**             | Persistent knowledge graph   | Store/recall architectural decisions, patterns, known issues          |
| **git**                | Git operations               | Commits, diffs, branches, history viewing                             |
| **filesystem**         | File operations              | Read/write project files                                              |
| **sequentialthinking** | Structured reasoning         | Complex debugging, architecture decisions                             |
| **time**               | Timezone utilities           | Timestamps (rarely needed)                                            |

---

## Git & GitHub Tool Selection Guide

Three tools available for version control and GitHub operations. Choose based on the task:

| Task                   | Use This            | Why                       |
| ---------------------- | ------------------- | ------------------------- |
| View status, diff, log | **Git MCP**         | Clean structured output   |
| Create commits         | **Git MCP**         | Proper message formatting |
| List/switch branches   | **Git MCP**         | Simple operations         |
| Push to remote         | **Bash `git push`** | MCP doesn't support push  |
| Create PRs             | **GitHub MCP**      | Rich API integration      |
| Create/update issues   | **GitHub MCP**      | Full issue management     |
| Add issue comments     | **GitHub MCP**      | Direct API access         |
| Search code on GitHub  | **GitHub MCP**      | Cross-repo search         |
| List/manage milestones | **Bash `gh api`**   | No MCP milestone support  |
| Complex git operations | **Bash `git`**      | Rebase, cherry-pick, etc. |

### Decision Flowchart

```
Is it a GitHub.com operation (issues, PRs, remote files)?
├─ Yes → Use GitHub MCP
│        └─ Unless it's milestones → Use `gh api`
└─ No → Is it a local git operation?
        ├─ Yes → Use Git MCP
        │        └─ Unless it's push/pull/fetch → Use `git` in Bash
        └─ No → Use Bash
```

### Git MCP Server

Use for local repository operations:

```
mcp__git__git_status      # Working tree status
mcp__git__git_diff        # View changes (staged/unstaged)
mcp__git__git_log         # Commit history
mcp__git__git_commit      # Create commits
mcp__git__git_branch      # List branches
mcp__git__git_checkout    # Switch branches
mcp__git__git_add         # Stage files
```

**Limitations:** Cannot push, pull, fetch, or perform remote operations.

### GitHub MCP Server

Use for GitHub API operations (requires `GITHUB_PERSONAL_ACCESS_TOKEN`):

```
mcp__github__create_issue           # Create new issues
mcp__github__update_issue           # Update issue state/labels/milestone
mcp__github__add_issue_comment      # Add comments to issues
mcp__github__list_issues            # List/filter issues
mcp__github__create_pull_request    # Create PRs
mcp__github__get_pull_request       # Get PR details
mcp__github__search_code            # Search code across repos
mcp__github__get_file_contents      # Read files from remote
```

**Limitations:** No milestone CRUD (use `gh api` for milestones).

### Bash git/gh CLI

Use when MCP tools don't support the operation:

```bash
# Remote operations (not in Git MCP)
git push origin branch-name
git pull origin main
git fetch --all

# Milestone management (not in GitHub MCP)
gh api repos/OWNER/REPO/milestones -X POST -f title="v1.0"
gh api repos/OWNER/REPO/milestones --jq '.[] | ...'

# Complex git operations
git rebase -i HEAD~3
git cherry-pick abc123
git stash push -m "message"
```

---

## Context7 Usage

Use Context7 to fetch up-to-date documentation for libraries and frameworks:

```
# Get documentation for a library
resolve-library-id: "react"
get-library-docs: { libraryId: "/react/react", topic: "hooks" }
```

Best for:

- Checking current API signatures
- Understanding library-specific patterns
- Verifying framework best practices

---

## Knip Usage

Use Knip to detect dead code and unused dependencies:

```
# Run knip analysis
run_knip: { cwd: "/path/to/project" }

# Get knip documentation
get_knip_docs: { topic: "configuration" }
```

Best for:

- Finding unused exports before refactoring
- Identifying dead code after feature removal
- Cleaning up unused dependencies

---

## Memory Server Usage

The memory server maintains project knowledge across sessions. Use it to:

**Query existing knowledge:**

```
mcp__memory__search_nodes("ruleset")     # Find ruleset architecture info
mcp__memory__search_nodes("technical")   # Find known technical debt
mcp__memory__open_nodes(["KeyFiles"])    # Get key file locations
```

**Store new knowledge:**

```
mcp__memory__create_entities([...])      # Add new architectural concepts
mcp__memory__add_observations([...])     # Add details to existing entities
mcp__memory__create_relations([...])     # Link concepts together
```

**When to update memory:**

- After making significant architectural decisions
- When discovering important patterns or gotchas
- After resolving tricky bugs (document the solution)
- When adding new major features

---

## Sequential Thinking Usage

Use `mcp__sequentialthinking__sequentialthinking` for:

- Debugging complex ruleset merge issues
- Planning multi-step refactors
- Working through character creation edge cases
- Designing new edition support
- Any problem requiring step-by-step reasoning with revision
