import { navigateUp, navigateTo, listDirectory } from "./navigation.js";

export async function handleCommand(input, currentDir) {
  const parts = input.trim().split(/\s+/);
  const command = parts[0];

  if (command === "up") {
    return navigateUp(currentDir);
  }

  if (command === "cd") {
    if (parts.length < 2) {
      console.log("Invalid input");
      return null;
    }
    return await navigateTo(currentDir, parts[1]);
  }

  if (command === "ls") {
    await listDirectory(currentDir);
    return currentDir;
  }

  console.log("Invalid input");
  return null;
}
