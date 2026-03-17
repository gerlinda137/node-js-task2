export function parseArgs(args) {
  const result = {};
  let i = 0;

  while (i < args.length) {
    const current = args[i];

    if (current.startsWith("--")) {
      const next = args[i + 1];

      if (next === undefined || next.startsWith("--")) {
        result[current] = true;
        i += 1;
      } else {
        result[current] = next;
        i += 2;
      }
    } else {
      i += 1;
    }
  }

  return result;
}
