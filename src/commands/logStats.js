import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function logStats(inputPath, outputPath, currentDir) {
  const resolvedInput = path.resolve(currentDir, inputPath);
  const resolvedOutput = path.resolve(currentDir, outputPath);

  try {
    const raw = await fs.readFile(resolvedInput, "utf-8");
    const lines = raw.split("\n").filter((line) => line.trim());

    const numCPUs = os.cpus().length;
    const chunkSize = Math.ceil(lines.length / numCPUs);
    const chunks = [];
    for (let i = 0; i < lines.length; i += chunkSize) {
      chunks.push(lines.slice(i, i + chunkSize));
    }

    const workerPath = path.join(__dirname, "../workers/logWorker.js");
    const results = await Promise.all(
      chunks.map(
        (chunk) =>
          new Promise((resolve, reject) => {
            const worker = new Worker(workerPath, {
              workerData: { lines: chunk },
            });
            worker.on("message", resolve);
            worker.on("error", reject);
          }),
      ),
    );

    const merged = {
      total: 0,
      levels: {},
      status: { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 },
      paths: {},
      responseTimeSum: 0,
    };

    for (const r of results) {
      merged.total += r.total;
      merged.responseTimeSum += r.responseTimeSum;

      for (const [k, v] of Object.entries(r.levels)) {
        merged.levels[k] = (merged.levels[k] || 0) + v;
      }

      for (const k of Object.keys(merged.status)) {
        merged.status[k] += r.status[k];
      }

      for (const [k, v] of Object.entries(r.paths)) {
        merged.paths[k] = (merged.paths[k] || 0) + v;
      }
    }

    const topPaths = Object.entries(merged.paths)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([p, count]) => ({ path: p, count }));

    const output = {
      total: merged.total,
      levels: merged.levels,
      status: merged.status,
      topPaths,
      avgResponseTimeMs:
        merged.total > 0
          ? Math.round((merged.responseTimeSum / merged.total) * 100) / 100
          : 0,
    };

    await fs.writeFile(resolvedOutput, JSON.stringify(output, null, 2));
    console.log("Log stats written successfully");
  } catch (err) {
    console.error("Operation failed:", err.message);
  }
}
