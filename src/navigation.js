import path from "node:path";

export function navigateUp(currentDir) {
  const parent = path.dirname(currentDir);
  if (parent === currentDir) return currentDir;

  return parent;
}
