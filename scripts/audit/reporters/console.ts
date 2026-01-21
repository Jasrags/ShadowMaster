/**
 * Console Reporter
 *
 * Formats audit results for terminal output with colors and formatting.
 */

import type { AccessibilityResult } from "../checkers/accessibility";
import type { DarkModeResult } from "../checkers/dark-mode";
import type { VisualConsistencyResult } from "../checkers/visual-consistency";
import type { ResponsiveResult } from "../checkers/responsive";
import type { InteractiveStatesResult } from "../checkers/interactive-states";

// =============================================================================
// TYPES
// =============================================================================

export interface AuditResults {
  components: string[];
  accessibility: AccessibilityResult[];
  darkMode: DarkModeResult[];
  visualConsistency: VisualConsistencyResult[];
  responsive: ResponsiveResult[];
  interactiveStates: InteractiveStatesResult[];
}

export interface AuditSummary {
  totalComponents: number;
  totalViolations: number;
  criticalViolations: number;
  highViolations: number;
  mediumViolations: number;
  lowViolations: number;
  byCategory: {
    accessibility: number;
    darkMode: number;
    visualConsistency: number;
    responsive: number;
    interactiveStates: number;
  };
}

// =============================================================================
// COLORS
// =============================================================================

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",

  // Foreground colors
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  // Background colors
  bgRed: "\x1b[41m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
};

// =============================================================================
// FORMATTING HELPERS
// =============================================================================

function severityColor(severity: "critical" | "high" | "medium" | "low"): string {
  switch (severity) {
    case "critical":
      return colors.bgRed + colors.white;
    case "high":
      return colors.red;
    case "medium":
      return colors.yellow;
    case "low":
      return colors.blue;
  }
}

function severityIcon(severity: "critical" | "high" | "medium" | "low"): string {
  switch (severity) {
    case "critical":
      return "🚨";
    case "high":
      return "❌";
    case "medium":
      return "⚠️ ";
    case "low":
      return "💡";
  }
}

function formatPath(filePath: string): string {
  // Shorten path for display
  const match = filePath.match(/components\/creation\/(.+)$/);
  return match ? `creation/${match[1]}` : filePath;
}

// =============================================================================
// SUMMARY CALCULATION
// =============================================================================

export function calculateSummary(results: AuditResults): AuditSummary {
  let totalViolations = 0;
  let criticalViolations = 0;
  let highViolations = 0;
  let mediumViolations = 0;
  let lowViolations = 0;

  const byCategory = {
    accessibility: 0,
    darkMode: 0,
    visualConsistency: 0,
    responsive: 0,
    interactiveStates: 0,
  };

  // Count accessibility violations
  for (const result of results.accessibility) {
    for (const v of result.violations) {
      totalViolations++;
      byCategory.accessibility++;
      if (v.severity === "critical") criticalViolations++;
      else if (v.severity === "high") highViolations++;
      else if (v.severity === "medium") mediumViolations++;
    }
  }

  // Count dark mode violations
  for (const result of results.darkMode) {
    for (const v of result.violations) {
      totalViolations++;
      byCategory.darkMode++;
      if (v.severity === "high") highViolations++;
      else if (v.severity === "medium") mediumViolations++;
    }
  }

  // Count visual consistency violations
  for (const result of results.visualConsistency) {
    for (const v of result.violations) {
      totalViolations++;
      byCategory.visualConsistency++;
      if (v.severity === "high") highViolations++;
      else if (v.severity === "medium") mediumViolations++;
      else if (v.severity === "low") lowViolations++;
    }
  }

  // Count responsive violations
  for (const result of results.responsive) {
    for (const v of result.violations) {
      totalViolations++;
      byCategory.responsive++;
      if (v.severity === "high") highViolations++;
      else if (v.severity === "medium") mediumViolations++;
      else if (v.severity === "low") lowViolations++;
    }
  }

  // Count interactive states violations
  for (const result of results.interactiveStates) {
    for (const v of result.violations) {
      totalViolations++;
      byCategory.interactiveStates++;
      if (v.severity === "high") highViolations++;
      else if (v.severity === "medium") mediumViolations++;
      else if (v.severity === "low") lowViolations++;
    }
  }

  return {
    totalComponents: results.components.length,
    totalViolations,
    criticalViolations,
    highViolations,
    mediumViolations,
    lowViolations,
    byCategory,
  };
}

// =============================================================================
// CONSOLE OUTPUT
// =============================================================================

export function reportToConsole(
  results: AuditResults,
  options: { verbose?: boolean; strict?: boolean } = {}
): void {
  const summary = calculateSummary(results);

  console.log("\n");
  console.log(`${colors.bold}${colors.cyan}🔍 Creation UX Audit Report${colors.reset}`);
  console.log("=".repeat(70));
  console.log();

  // Summary section
  console.log(`${colors.bold}📊 Summary${colors.reset}`);
  console.log(`   Components scanned: ${colors.cyan}${summary.totalComponents}${colors.reset}`);
  console.log(
    `   Total violations:   ${summary.totalViolations > 0 ? colors.yellow : colors.green}${summary.totalViolations}${colors.reset}`
  );
  console.log();

  if (summary.totalViolations > 0) {
    console.log(`${colors.bold}📈 By Severity${colors.reset}`);
    if (summary.criticalViolations > 0) {
      console.log(
        `   ${severityIcon("critical")} Critical: ${colors.red}${summary.criticalViolations}${colors.reset}`
      );
    }
    if (summary.highViolations > 0) {
      console.log(
        `   ${severityIcon("high")} High:     ${colors.red}${summary.highViolations}${colors.reset}`
      );
    }
    if (summary.mediumViolations > 0) {
      console.log(
        `   ${severityIcon("medium")} Medium:   ${colors.yellow}${summary.mediumViolations}${colors.reset}`
      );
    }
    if (summary.lowViolations > 0) {
      console.log(
        `   ${severityIcon("low")} Low:      ${colors.blue}${summary.lowViolations}${colors.reset}`
      );
    }
    console.log();

    console.log(`${colors.bold}📁 By Category${colors.reset}`);
    if (summary.byCategory.accessibility > 0) {
      console.log(
        `   Accessibility:      ${colors.yellow}${summary.byCategory.accessibility}${colors.reset}`
      );
    }
    if (summary.byCategory.darkMode > 0) {
      console.log(
        `   Dark Mode:          ${colors.yellow}${summary.byCategory.darkMode}${colors.reset}`
      );
    }
    if (summary.byCategory.visualConsistency > 0) {
      console.log(
        `   Visual Consistency: ${colors.yellow}${summary.byCategory.visualConsistency}${colors.reset}`
      );
    }
    if (summary.byCategory.responsive > 0) {
      console.log(
        `   Responsive:         ${colors.yellow}${summary.byCategory.responsive}${colors.reset}`
      );
    }
    if (summary.byCategory.interactiveStates > 0) {
      console.log(
        `   Interactive States: ${colors.yellow}${summary.byCategory.interactiveStates}${colors.reset}`
      );
    }
    console.log();
  }

  // Detailed violations (if verbose or not too many)
  if (options.verbose || summary.totalViolations <= 50) {
    // Group violations by file
    const byFile = new Map<
      string,
      Array<{
        category: string;
        severity: string;
        line: number;
        message: string;
        suggestion?: string;
      }>
    >();

    // Collect all violations
    for (const result of results.accessibility) {
      for (const v of result.violations) {
        if (!byFile.has(result.filePath)) byFile.set(result.filePath, []);
        byFile.get(result.filePath)!.push({
          category: "A11y",
          severity: v.severity,
          line: v.line,
          message: v.message,
          suggestion: v.suggestion,
        });
      }
    }

    for (const result of results.darkMode) {
      for (const v of result.violations) {
        if (!byFile.has(result.filePath)) byFile.set(result.filePath, []);
        byFile.get(result.filePath)!.push({
          category: "Dark",
          severity: v.severity,
          line: v.line,
          message: v.message,
        });
      }
    }

    for (const result of results.visualConsistency) {
      for (const v of result.violations) {
        if (!byFile.has(result.filePath)) byFile.set(result.filePath, []);
        byFile.get(result.filePath)!.push({
          category: "Visual",
          severity: v.severity,
          line: v.line,
          message: v.message,
        });
      }
    }

    for (const result of results.responsive) {
      for (const v of result.violations) {
        if (!byFile.has(result.filePath)) byFile.set(result.filePath, []);
        byFile.get(result.filePath)!.push({
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
        if (!byFile.has(result.filePath)) byFile.set(result.filePath, []);
        byFile.get(result.filePath)!.push({
          category: "Interactive",
          severity: v.severity,
          line: v.line,
          message: v.message,
        });
      }
    }

    if (byFile.size > 0) {
      console.log(`${colors.bold}📋 Violations by File${colors.reset}`);
      console.log("-".repeat(70));

      // Sort files by number of violations (descending)
      const sortedFiles = [...byFile.entries()].sort((a, b) => b[1].length - a[1].length);

      for (const [filePath, violations] of sortedFiles) {
        console.log();
        console.log(
          `${colors.bold}${formatPath(filePath)}${colors.reset} (${violations.length} issues)`
        );

        // Sort violations by severity
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        violations.sort(
          (a, b) =>
            (severityOrder[a.severity as keyof typeof severityOrder] || 3) -
            (severityOrder[b.severity as keyof typeof severityOrder] || 3)
        );

        for (const v of violations) {
          const sevColor = severityColor(v.severity as "critical" | "high" | "medium" | "low");
          console.log(
            `   ${sevColor}[${v.severity.toUpperCase()}]${colors.reset} L${v.line} [${v.category}] ${v.message}`
          );
          if (v.suggestion && options.verbose) {
            console.log(`      ${colors.dim}💡 ${v.suggestion}${colors.reset}`);
          }
        }
      }
      console.log();
    }
  } else {
    console.log(`${colors.dim}(Run with --verbose to see detailed violations)${colors.reset}`);
    console.log();
  }

  // Footer
  console.log("=".repeat(70));

  if (summary.totalViolations === 0) {
    console.log(`${colors.green}✅ All components pass the UX audit!${colors.reset}`);
  } else if (options.strict && (summary.criticalViolations > 0 || summary.highViolations > 0)) {
    console.log(
      `${colors.red}❌ Audit FAILED (--strict mode): ${summary.criticalViolations + summary.highViolations} critical/high violations${colors.reset}`
    );
  } else {
    console.log(
      `${colors.yellow}⚠️  Audit completed with ${summary.totalViolations} violations${colors.reset}`
    );
  }
  console.log();
}
