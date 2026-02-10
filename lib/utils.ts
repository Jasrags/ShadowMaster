export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function downloadCharacterJson(character: { name?: string }) {
  const slug = (character.name || "character")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2));
  const a = document.createElement("a");
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `shadow-master-${slug}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}
