import { navigateUp, navigateTo, listDirectory } from "./navigation.js";
import { parseArgs } from "./utils/argParser.js";
import { countFile } from "./commands/count.js";
import { csvToJson } from "./commands/csvToJson.js";

export async function handleCommand(input, currentDir) {
  const parts = input.trim().split(/\s+/);
  const command = parts[0];

  const args = parts.slice(1);

  if (command === "up") {
    return navigateUp(currentDir);
  }

  if (command === "cd") {
    if (parts.length < 2) {
      console.log("Invalid input");
      return null;
    }
    return await navigateTo(currentDir, parts.slice(1).join(" "));
  }

  if (command === "ls") {
    await listDirectory(currentDir);
    return currentDir;
  }

  if (command === "count") {
    const flags = parseArgs(args);
    if (!flags["--input"]) {
      console.log("Invalid input");
      return null;
    }
    await countFile(flags["--input"], currentDir);
    return currentDir;
  }

  if (command === "csv-to-json") {
    const flags = parseArgs(args);
    if (!flags["--input"] || !flags["--output"]) {
      console.log("Invalid input");
      return null;
    }
    await csvToJson(flags["--input"], flags["--output"], currentDir);
    return currentDir;
  }

  console.log("Invalid input");
  return null;
}
