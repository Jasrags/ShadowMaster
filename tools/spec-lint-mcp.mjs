#!/usr/bin/env node

/**
 * Spec Lint MCP Server
 *
 * Purpose:
 * - Enforce immutability rules for specification documents
 * - Detect progress/status leakage inside specs
 *
 * This server is intentionally simple and deterministic.
 */


import fs from "fs";
import path from "path";
import readline from "readline";

const SPEC_DIRS = ["spec", "specs", "documentation", "docs/specs"];
const SPEC_EXTENSIONS = [".md", ".markdown"];

/**
 * Patterns that indicate progress leakage inside specs
 */
const FORBIDDEN_PATTERNS = [
  { regex: /\bstatus\s*:/i, reason: "Status field found in spec" },
  { regex: /\bin progress\b/i, reason: "Progress language detected" },
  { regex: /\bpartially implemented\b/i, reason: "Implementation progress detected" },
  { regex: /\bcompleted\b/i, reason: "Completion language detected" },
  { regex: /\bcurrently\b/i, reason: "Temporal language detected" },
  { regex: /\bnext (sprint|iteration|phase)\b/i, reason: "Planning language detected" },
  { regex: /\bwill be added\b/i, reason: "Future commitment detected" },
  { regex: /\btodo\b/i, reason: "TODO detected" },
  { regex: /\[\s?\]/, reason: "Checklist detected" },
  { regex: /\b\d{1,3}%\b/, reason: "Percentage progress detected" }
];

function findSpecFiles(rootDir) {
  const results = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;

    for (const entry of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (SPEC_EXTENSIONS.includes(path.extname(entry))) {
        results.push(fullPath);
      }
    }
  }

  for (const specDir of SPEC_DIRS) {
    walk(path.join(rootDir, specDir));
  }

  return results;
}

function lintFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const issues = [];

  lines.forEach((line, index) => {
    FORBIDDEN_PATTERNS.forEach(({ regex, reason }) => {
      if (regex.test(line)) {
        issues.push({
          file: filePath,
          line: index + 1,
          text: line.trim(),
          reason
        });
      }
    });
  });

  return issues;
}

/**
 * MCP stdio protocol (very lightweight)
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", (input) => {
  let request;
  try {
    request = JSON.parse(input);
  } catch {
    return;
  }

  if (request.method !== "lintSpecs") {
    process.stdout.write(JSON.stringify({
      error: "Unsupported method"
    }) + "\n");
    return;
  }

  const rootDir = request.params?.rootDir || process.cwd();
  const specFiles = findSpecFiles(rootDir);

  let findings = [];
  for (const file of specFiles) {
    findings = findings.concat(lintFile(file));
  }

  process.stdout.write(JSON.stringify({
    result: {
      checkedFiles: specFiles.length,
      violations: findings,
      violationCount: findings.length
    }
  }) + "\n");
});
