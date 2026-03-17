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

export async function listDirectory(currentDir) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  const folders = entries.filter((e) => e.isDirectory());
  const files = entries.filter((e) => e.isFile());

  folders.sort((a, b) => a.name.localeCompare(b.name));
  files.sort((a, b) => a.name.localeCompare(b.name));

  for (const folder of folders) {
    console.log(`${folder.name}\t[folder]`);
  }
  for (const file of files) {
    console.log(`${file.name}\t[file]`);
  }
}
