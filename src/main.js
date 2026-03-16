import readline from "node:readline";
import os from "node:os";
import { handleCommand } from "./repl.js";

let currentDir = os.homedir();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

console.log("Welcome to Data Processing CLI!");
console.log(`You are currently in ${currentDir}`);

rl.prompt();

rl.on("line", async (input) => {
  const trimmed = input.trim();

  if (trimmed === ".exit") {
    exitGracefully();
    return;
  }

  if (!trimmed) {
    rl.prompt();
    return;
  }

  const result = await handleCommand(trimmed, currentDir);
  if (result !== null) {
    currentDir = result;
    console.log(`You are currently in ${currentDir}`);
  }
  rl.prompt();
});

rl.on("SIGINT", () => {
  exitGracefully();
});

function exitGracefully() {
  console.log("Thank you for using Data Processing CLI!");
  process.exit(0);
}
