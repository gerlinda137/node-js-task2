import { navigateUp, navigateTo, listDirectory } from "./navigation.js";
import { parseArgs } from "./utils/argParser.js";
import { countFile } from "./commands/count.js";
import { csvToJson } from "./commands/csvToJson.js";
import { jsonToCsv } from "./commands/jsonToCsv.js";
import { hashFile } from "./commands/hash.js";
import { hashCompare } from "./commands/hashCompare.js";
import { encryptFile } from "./commands/encrypt.js";
import { decryptFile } from "./commands/decrypt.js";

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
    console.log("File created successfully");
    return currentDir;
  }

  if (command === "json-to-csv") {
    const flags = parseArgs(args);
    if (!flags["--input"] || !flags["--output"]) {
      console.log("Invalid input");
      return null;
    }
    await jsonToCsv(flags["--input"], flags["--output"], currentDir);
    console.log("File created successfully");
    return currentDir;
  }

  if (command === "hash") {
    const flags = parseArgs(args);
    if (!flags["--input"]) {
      console.log("Invalid input");
      return null;
    }
    await hashFile(
      flags["--input"],
      flags["--algorithm"] || "sha256",
      flags["--save"] === true,
      currentDir,
    );
    return currentDir;
  }

  if (command === "hash-compare") {
    const flags = parseArgs(args);
    if (!flags["--input"] || !flags["--hash"]) {
      console.log("Invalid input");
      return null;
    }
    await hashCompare(
      flags["--input"],
      flags["--hash"],
      flags["--algorithm"] || "sha256",
      currentDir,
    );
    return currentDir;
  }

  if (command === "encrypt") {
    const flags = parseArgs(args);
    if (!flags["--input"] || !flags["--output"] || !flags["--password"]) {
      console.log("Invalid input");
      return null;
    }
    await encryptFile(
      flags["--input"],
      flags["--output"],
      flags["--password"],
      currentDir,
    );
    return currentDir;
  }

  if (command === "decrypt") {
    const flags = parseArgs(args);
    if (!flags["--input"] || !flags["--output"] || !flags["--password"]) {
      console.log("Invalid input");
      return null;
    }
    await decryptFile(
      flags["--input"],
      flags["--output"],
      flags["--password"],
      currentDir,
    );
    return currentDir;
  }

  console.log("Invalid input");
  return null;
}
