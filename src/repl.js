import { navigateUp, navigateTo } from "./navigation.js";

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

  console.log("Invalid input");
  return null;
}
