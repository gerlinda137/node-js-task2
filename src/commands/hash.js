import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

const SUPPORTED = ["sha256", "md5", "sha512"];

export async function hashFile(
  inputPath,
  algorithm = "sha256",
  save,
  currentDir,
) {
  const resolved = path.resolve(currentDir, inputPath);

  if (!SUPPORTED.includes(algorithm)) {
    console.log("Operation failed");
    return;
  }

  const hash = crypto.createHash(algorithm);

  const hashWriter = new Writable({
    write(chunk, encoding, callback) {
      hash.update(chunk);
      callback();
    },
  });

  try {
    await pipeline(fs.createReadStream(resolved), hashWriter);

    const result = hash.digest("hex");
    console.log(`${algorithm}: ${result}`);

    if (save) {
      const savePath = resolved + "." + algorithm;
      await fsPromises.writeFile(savePath, result);
    }
  } catch {
    console.log("Operation failed");
  }
}
