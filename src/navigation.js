import path from "node:path";
import fs from "node:fs/promises";

export function navigateUp(currentDir) {
  const parent = path.dirname(currentDir);
  if (parent === currentDir) return currentDir;

  return parent;
}

export async function navigateTo(currentDir, targetPath) {
  const resolved = path.resolve(currentDir, targetPath);
  try {
    const stat = await fs.stat(resolved);
    if (!stat.isDirectory()) {
      console.error("Operation failed");
      return currentDir;
    }
    return resolved;
  } catch {
    console.log("Operation failed");
    return currentDir;
  }
}
