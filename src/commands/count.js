import fs from "node:fs";
import path from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

export async function countFile(inputPath, currentDir) {
  const resolved = path.resolve(currentDir, inputPath);

  let lines = 0;
  let words = 0;
  let characters = 0;

  const counter = new Transform({
    transform(chunk, encoding, callback) {
      const text = chunk.toString();

      lines += (text.match(/\n/g) || []).length;
      words += (text.match(/\S+/g) || []).length;
      characters += text.length;
      callback();
    },
  });

  try {
    await pipeline(fs.createReadStream(resolved), counter);

    console.log(`Lines: ${lines}`);
    console.log(`Words: ${words}`);
    console.log(`Characters: ${characters}`);
  } catch {
    console.log("Operation failed");
  }
}
