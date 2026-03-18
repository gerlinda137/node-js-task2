import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

export async function jsonToCsv(inputPath, outputPath, currentDir) {
  const resolvedInput = path.resolve(currentDir, inputPath);
  const resolvedOutput = path.resolve(currentDir, outputPath);

  try {
    const raw = await fsPromises.readFile(resolvedInput, "utf-8");
    const data = JSON.parse(raw);

    if (!Array.isArray(data) || data.length === 0) {
      console.log("Operation failed");
      return;
    }

    const headers = Object.keys(data[0]);
    const lines = [headers.join(",")];

    for (const obj of data) {
      const values = headers.map((h) => obj[h] ?? "");
      lines.push(values.join(","));
    }

    const csvContent = lines.join("\n");

    await pipeline(
      Readable.from(csvContent),
      fs.createWriteStream(resolvedOutput),
    );
  } catch {
    console.log("Operation failed");
  }
}
