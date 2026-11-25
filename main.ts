// The Best Meal You Ever Had — make.fun entry
// Writes one sentence (at most 200 characters) about the best meal ever
// had to /output/entry.txt. The judge compares entries two at a time and
// keeps the one that makes the meal feel most real.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/** The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters. */
const GATE_MAX_CHARS = 200;

/**
 * The entry line: one sentence about the best meal ever had.
 *
 * Grandmother's rendang, eaten on the kitchen floor at midnight — a
 * concrete dish, a specific place and moment, a texture (coconut milk
 * still bubbling), and an ending image that stays with the reader:
 * nobody speaking because the food was doing all the talking.
 */
const ENTRY_LINE =
  "My grandmother's rendang, eaten cross-legged on the kitchen floor at midnight, the coconut milk still bubbling, and nobody speaking because the food was doing all the talking.";

/** Build the entry text, enforcing the gate before anything is written. */
function buildEntryLine(): string {
  const line = ENTRY_LINE;
  if (line.length === 0 || line.length > GATE_MAX_CHARS) {
    throw new Error(
      `entry must be 1 to ${GATE_MAX_CHARS} characters, got ${line.length}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  return line;
}

/**
 * Resolve where the entry goes.
 *
 * The grader runs this program in a sandbox whose filesystem is read-only
 * except for the output directory, so the output path must come from the
 * environment, never a hard-coded location:
 *   1. $MAKEFUN_OUTPUT_DIR — the directory the grader provides.
 *   2. $OUTPUT_PATH — a full path to the entry file, if given directly.
 *   3. /output — the conventional location, only when MAKEFUN_BOT_DIR is
 *      set (a signal we are running inside the grader's sandbox).
 *   4. A local output/ directory next to this file, for local runs.
 */
function resolveOutputPath(): string {
  const makefunDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (makefunDir) {
    return join(makefunDir, "entry.txt");
  }
  const outputPath = process.env.OUTPUT_PATH;
  if (outputPath) {
    return outputPath;
  }
  if (process.env.MAKEFUN_BOT_DIR) {
    return "/output/entry.txt";
  }
  return resolve(dirname(new URL(import.meta.url).pathname), "output", "entry.txt");
}

function main(): void {
  const line = buildEntryLine();
  const outPath = resolveOutputPath();
  mkdirSync(dirname(outPath), { recursive: true });
  // Byte-identical entry text: no trailing newline, no extra whitespace.
  writeFileSync(outPath, line, "utf8");
  console.log(`wrote ${line.length} characters to ${outPath}`);
}

main();
