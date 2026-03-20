import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { pipeline } from "node:stream/promises";

export async function decryptFile(inputPath, outputPath, password, currentDir) {
  const resolvedInput = path.resolve(currentDir, inputPath);
  const resolvedOutput = path.resolve(currentDir, outputPath);

  try {
    const fd = await fsPromises.open(resolvedInput, "r");
    const { size } = await fd.stat();

    const headerBuf = Buffer.alloc(28);
    await fd.read(headerBuf, 0, 28, 0);

    const salt = headerBuf.subarray(0, 16);
    const iv = headerBuf.subarray(16, 28);

    const authTagBuf = Buffer.alloc(16);
    await fd.read(authTagBuf, 0, 16, size - 16);

    await fd.close();

    const key = await new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 32, (err, key) => {
        if (err) reject(err);
        else resolve(key);
      });
    });

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTagBuf);

    await pipeline(
      fs.createReadStream(resolvedInput, { start: 28, end: size - 17 }),
      decipher,
      fs.createWriteStream(resolvedOutput),
    );

    console.log("File decrypted successfully");
  } catch {
    console.log("Operation failed");
  }
}
