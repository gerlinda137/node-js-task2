import { navigateUp } from "./navigation.js";

export async function handleCommand(input, currentDir) {
  const parts = input.trim().split(/\s+/);
  const command = parts[0];

  if (command === "up") {
    return navigateUp(currentDir);
  }
  console.log("Invalid input");
  return null;
}
