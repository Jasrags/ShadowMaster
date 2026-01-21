/**
 * Markdown Reporter
 *
 * Generates a markdown report suitable for updating GitHub issues.
 */

import * as fs from "fs";
import { calculateSummary, type AuditResults } from "./console";

// =============================================================================
// HELPERS
// =============================================================================

function formatPath(filePath: string): string {
  const match = filePath.match(/components\/creation\/(.+)$/);
  return match ? match[1] : filePath;
}

function severityEmoji(severity: "critical" | "high" | "medium" | "low"): string {
  switch (severity) {
    case "critical":
      return "🚨";
    case "high":
      return "❌";
    case "medium":
      return "⚠️";
    case "low":
      return "💡";
  }
}

// =============================================================================
// MARKDOWN GENERATION
// =============================================================================

export function generateMarkdownReport(results: AuditResults): string {
  const summary = calculateSummary(results);
  const lines: string[] = [];

  // Header
  lines.push("# Creation UX Audit Report");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString().split("T")[0]}`);
  lines.push("");

  // Summary
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("|--------|-------|");
  lines.push(`| Components Scanned | ${summary.totalComponents} |`);
  lines.push(`| Total Violations | ${summary.totalViolations} |`);
  lines.push(`| Critical | ${summary.criticalViolations} |`);
  lines.push(`| High | ${summary.highViolations} |`);
  lines.push(`| Medium | ${summary.mediumViolations} |`);
  lines.push(`| Low | ${summary.lowViolations} |`);
  lines.push("");

  // By Category
  lines.push("### By Category");
  lines.push("");
  lines.push("| Category | Violations |");
  lines.push("|----------|------------|");
  lines.push(`| Accessibility | ${summary.byCategory.accessibility} |`);
  lines.push(`| Dark Mode | ${summary.byCategory.darkMode} |`);
  lines.push(`| Visual Consistency | ${summary.byCategory.visualConsistency} |`);
  lines.push(`| Responsive Design | ${summary.byCategory.responsive} |`);
  lines.push(`| Interactive States | ${summary.byCategory.interactiveStates} |`);
  lines.push("");

  // Component Inventory
  lines.push("## Component Inventory");
  lines.push("");
  lines.push(`Total components: **${results.components.length}**`);
  lines.push("");

  // Group by subfolder
  const byFolder = new Map<string, string[]>();
  for (const comp of results.components) {
    const match = comp.match(/components\/creation\/([^/]+)\//);
    const folder = match ? match[1] : "root";
    if (!byFolder.has(folder)) byFolder.set(folder, []);
    byFolder.get(folder)!.push(formatPath(comp));
  }

  lines.push("<details>");
  lines.push("<summary>Click to expand component list</summary>");
  lines.push("");

  for (const [folder, components] of [...byFolder.entries()].sort()) {
    lines.push(`### ${folder === "root" ? "Root Components" : folder}`);
    lines.push("");
    for (const comp of components.sort()) {
      lines.push(`- \`${comp}\``);
    }
    lines.push("");
  }

  lines.push("</details>");
  lines.push("");

  // Violations by Priority
  if (summary.totalViolations > 0) {
    lines.push("## Violations by Priority");
    lines.push("");

    // Collect all violations
    const allViolations: Array<{
      file: string;
      category: string;
      severity: "critical" | "high" | "medium" | "low";
      line: number;
      message: string;
      suggestion?: string;
    }> = [];

    for (const result of results.accessibility) {
      for (const v of result.violations) {
        allViolations.push({
          file: result.filePath,
          category: "Accessibility",
          severity: v.severity,
          line: v.line,
          message: v.message,
          suggestion: v.suggestion,
        });
      }
    }

    for (const result of results.darkMode) {
      for (const v of result.violations) {
        allViolations.push({
          file: result.filePath,
          category: "Dark Mode",
          severity: v.severity,
          line: v.line,
          message: v.message,
        });
      }
    }

    for (const result of results.visualConsistency) {
      for (const v of result.violations) {
        allViolations.push({
          file: result.filePath,
          category: "Visual",
          severity: v.severity,
          line: v.line,
          message: v.message,
        });
      }
    }

    for (const result of results.responsive) {
      for (const v of result.violations) {
        allViolations.push({
          file: result.filePath,
          category: "Responsive",
          severity: v.severity,
          line: v.line,
          message: v.message,
          suggestion: v.suggestion,
        });
      }
    }

    for (const result of results.interactiveStates) {
      for (const v of result.violations) {
        allViolations.push({
          file: result.filePath,
          category: "Interactive",
          severity: v.severity,
          line: v.line,
          message: v.message,
        });
      }
    }

    // Group by priority
    const byPriority = {
      critical: allViolations.filter((v) => v.severity === "critical"),
      high: allViolations.filter((v) => v.severity === "high"),
      medium: allViolations.filter((v) => v.severity === "medium"),
      low: allViolations.filter((v) => v.severity === "low"),
    };

    // Critical/High violations (show all)
    if (byPriority.critical.length > 0 || byPriority.high.length > 0) {
      lines.push("### 🚨 P0/P1 - Critical & High Priority");
      lines.push("");
      lines.push("These should be fixed immediately:");
      lines.push("");

      for (const v of [...byPriority.critical, ...byPriority.high]) {
        lines.push(
          `- [ ] ${severityEmoji(v.severity)} **${formatPath(v.file)}:${v.line}** - ${v.message}`
        );
        if (v.suggestion) {
          lines.push(`  - 💡 ${v.suggestion}`);
        }
      }
      lines.push("");
    }

    // Medium violations
    if (byPriority.medium.length > 0) {
      lines.push("### ⚠️ P2 - Medium Priority");
      lines.push("");
      lines.push("<details>");
      lines.push("<summary>Click to expand (${byPriority.medium.length} issues)</summary>");
      lines.push("");

      // Group by file
      const byFile = new Map<string, typeof byPriority.medium>();
      for (const v of byPriority.medium) {
        if (!byFile.has(v.file)) byFile.set(v.file, []);
        byFile.get(v.file)!.push(v);
      }

      for (const [file, violations] of [...byFile.entries()].sort()) {
        lines.push(`#### ${formatPath(file)}`);
        for (const v of violations) {
          lines.push(`- [ ] L${v.line}: ${v.message}`);
        }
        lines.push("");
      }

      lines.push("</details>");
      lines.push("");
    }

    // Low violations
    if (byPriority.low.length > 0) {
      lines.push("### 💡 P3 - Low Priority");
      lines.push("");
      lines.push("<details>");
      lines.push(`<summary>Click to expand (${byPriority.low.length} issues)</summary>`);
      lines.push("");

      const byFile = new Map<string, typeof byPriority.low>();
      for (const v of byPriority.low) {
        if (!byFile.has(v.file)) byFile.set(v.file, []);
        byFile.get(v.file)!.push(v);
      }

      for (const [file, violations] of [...byFile.entries()].sort()) {
        lines.push(`#### ${formatPath(file)}`);
        for (const v of violations) {
          lines.push(`- [ ] L${v.line}: ${v.message}`);
        }
        lines.push("");
      }

      lines.push("</details>");
      lines.push("");
    }

    // Violations by Category
    lines.push("## Violations by Category");
    lines.push("");

    if (summary.byCategory.accessibility > 0) {
      lines.push("### Accessibility");
      lines.push("");
      lines.push("| File | Line | Issue | Suggestion |");
      lines.push("|------|------|-------|------------|");
      for (const result of results.accessibility) {
        for (const v of result.violations) {
          lines.push(
            `| \`${formatPath(result.filePath)}\` | ${v.line} | ${v.message} | ${v.suggestion || "-"} |`
          );
        }
      }
      lines.push("");
    }

    if (summary.byCategory.darkMode > 0) {
      lines.push("### Dark Mode");
      lines.push("");
      lines.push("| File | Line | Light Class | Expected Dark Class |");
      lines.push("|------|------|-------------|---------------------|");
      for (const result of results.darkMode) {
        for (const v of result.violations) {
          lines.push(
            `| \`${formatPath(result.filePath)}\` | ${v.line} | \`${v.lightClass}\` | \`${v.expectedDarkClass}\` |`
          );
        }
      }
      lines.push("");
    }

    if (summary.byCategory.interactiveStates > 0) {
      lines.push("### Interactive States");
      lines.push("");
      lines.push("| File | Line | Missing States |");
      lines.push("|------|------|----------------|");
      for (const result of results.interactiveStates) {
        for (const v of result.violations) {
          lines.push(
            `| \`${formatPath(result.filePath)}\` | ${v.line} | \`${v.missingStates.join(", ")}\` |`
          );
        }
      }
      lines.push("");
    }
  }

  // Checklist by Component
  lines.push("## Component Checklist");
  lines.push("");
  lines.push("Use this checklist to track fixes. Check off components as they pass all audits.");
  lines.push("");

  // Create checklist with violation counts
  const violationsByComponent = new Map<string, number>();
  for (const result of [
    ...results.accessibility,
    ...results.darkMode,
    ...results.visualConsistency,
    ...results.responsive,
    ...results.interactiveStates,
  ]) {
    const count = violationsByComponent.get(result.filePath) || 0;
    violationsByComponent.set(
      result.filePath,
      count + ("violations" in result ? result.violations.length : 0)
    );
  }

  // Sort by violations (most first)
  const sortedComponents = results.components.sort((a, b) => {
    const countA = violationsByComponent.get(a) || 0;
    const countB = violationsByComponent.get(b) || 0;
    return countB - countA;
  });

  for (const comp of sortedComponents) {
    const count = violationsByComponent.get(comp) || 0;
    const status = count === 0 ? "x" : " ";
    const badge = count > 0 ? ` (${count} issues)` : " ✅";
    lines.push(`- [${status}] \`${formatPath(comp)}\`${badge}`);
  }

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("*Report generated by `pnpm audit:creation:report`*");

  return lines.join("\n");
}

export function writeMarkdownReport(results: AuditResults, outputPath: string): void {
  const report = generateMarkdownReport(results);
  fs.writeFileSync(outputPath, report, "utf-8");
  console.log(`📝 Markdown report written to: ${outputPath}`);
}
