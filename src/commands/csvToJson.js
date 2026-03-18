import fs from "node:fs";
import path from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

export async function csvToJson(inputPath, outputPath, currentDir) {
  const resolvedInput = path.resolve(currentDir, inputPath);
  const resolvedOutput = path.resolve(currentDir, outputPath);

  let headers = null;
  let isFirst = true;

  const transform = new Transform({
    transform(chunk, encoding, callback) {
      const lines = chunk.toString().split("\n");

      for (const line of lines) {
        if (!line.trim()) continue;

        if (headers === null) {
          headers = line.split(",");
        } else {
          const values = line.split(",");
          const obj = {};
          headers.forEach((h, i) => {
            obj[h.trim()] = values[i]?.trim();
          });

          const prefix = isFirst ? "[\n  " : ",\n  ";
          this.push(prefix + JSON.stringify(obj));
          isFirst = false;
        }
      }
      callback();
    },

    flush(callback) {
      this.push(isFirst ? "[]" : "\n]");
      callback();
    },
  });

  try {
    await pipeline(
      fs.createReadStream(resolvedInput),
      transform,
      fs.createWriteStream(resolvedOutput),
    );
  } catch {
    console.log("Operation failed");
  }
}
