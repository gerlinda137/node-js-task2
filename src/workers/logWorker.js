import { workerData, parentPort } from "node:worker_threads";

const { lines } = workerData;

const stats = {
  total: 0,
  levels: {},
  status: { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 },
  paths: {},
  responseTimeSum: 0,
};

for (const line of lines) {
  if (!line.trim()) continue;

  const parts = line.split(" ");
  if (parts.length < 7) continue;

  const level = parts[1];
  const statusCode = parseInt(parts[3]);
  const responseTime = parseFloat(parts[4]);
  const urlPath = parts[6];

  stats.total++;

  stats.levels[level] = (stats.levels[level] || 0) + 1;

  if (statusCode >= 200 && statusCode < 300) stats.status["2xx"]++;
  else if (statusCode >= 300 && statusCode < 400) stats.status["3xx"]++;
  else if (statusCode >= 400 && statusCode < 500) stats.status["4xx"]++;
  else if (statusCode >= 500) stats.status["5xx"]++;

  stats.paths[urlPath] = (stats.paths[urlPath] || 0) + 1;

  stats.responseTimeSum += responseTime;
}

parentPort.postMessage(stats);
