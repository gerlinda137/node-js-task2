import path from "node:path";
import fsPromises from "node:fs/promises";
import { computeHash } from "./hash.js";

const SUPPORTED = ["sha256", "md5", "sha512"];

export async function hashCompare(
  inputPath,
  hashFilePath,
  algorithm = "sha256",
  currentDir,
) {
  const resolvedInput = path.resolve(currentDir, inputPath);
  const resolvedHash = path.resolve(currentDir, hashFilePath);

  if (!SUPPORTED.includes(algorithm)) {
    console.log("Operation failed");
    return;
  }

  try {
    const computed = await computeHash(resolvedInput, algorithm);
    const expected = await fsPromises.readFile(resolvedHash, "utf-8");

    if (computed.toLowerCase() === expected.trim().toLowerCase()) {
      console.log("OK");
    } else {
      console.log("MISMATCH");
    }
  } catch {
    console.log("Operation failed");
  }
}
