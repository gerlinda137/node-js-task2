import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { pipeline } from "node:stream/promises";

export async function encryptFile(inputPath, outputPath, password, currentDir) {
  const resolvedInput = path.resolve(currentDir, inputPath);
  const resolvedOutput = path.resolve(currentDir, outputPath);

  try {
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(12);

    const key = await new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 32, (err, key) => {
        if (err) reject(err);
        else resolve(key);
      });
    });

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    const writeStream = fs.createWriteStream(resolvedOutput);

    await new Promise((resolve, reject) => {
      writeStream.write(Buffer.concat([salt, iv]), (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await pipeline(fs.createReadStream(resolvedInput), cipher, writeStream, {
      end: false,
    });

    const authTag = cipher.getAuthTag();
    await new Promise((resolve, reject) => {
      writeStream.end(authTag, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log("File encrypted successfully");
  } catch {
    console.log("Operation failed");
  }
}
