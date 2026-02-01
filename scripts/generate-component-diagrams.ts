#!/usr/bin/env tsx
/**
 * generate-component-diagrams.ts
 *
 * Generates mermaid diagrams from the component directory structure.
 * Scans components, identifies types by naming convention, and outputs
 * mermaid graph syntax.
 *
 * Usage:
 *   pnpm generate-diagrams                    # Generate all areas
 *   pnpm generate-diagrams --area=creation    # Specific area
 *   pnpm generate-diagrams --area=combat      # Specific area
 *   pnpm generate-diagrams --output=stdout    # Print to stdout (default)
 *   pnpm generate-diagrams --output=files     # Update doc files
 *   pnpm generate-diagrams --verbose          # Show detailed info
 */

import * as fs from "fs";
import * as path from "path";

const COMPONENTS_DIR = path.join(process.cwd(), "components");
const DOCS_DIR = path.join(process.cwd(), "docs/architecture/components");

// Parse CLI arguments
const args = process.argv.slice(2);
const verbose = args.includes("--verbose");
const outputMode = args.find((a) => a.startsWith("--output="))?.split("=")[1] || "stdout";
const targetArea = args.find((a) => a.startsWith("--area="))?.split("=")[1];

// Color scheme matching existing docs
const COLORS = {
  container: "#3b82f6", // Blue - Card/Panel
  modal: "#8b5cf6", // Purple - Modal
  row: "#22c55e", // Green - Row/ListItem
  shared: "#6b7280", // Gray - Utilities
  hook: "#f59e0b", // Orange - Hooks/Context
};

interface ComponentInfo {
  name: string;
  fileName: string;
  type: "container" | "modal" | "row" | "shared" | "hook";
  imports: string[];
}

interface AreaInfo {
  name: string;
  path: string;
  components: ComponentInfo[];
  subfolders: Map<string, ComponentInfo[]>;
}

/**
 * Determine component type from filename
 */
function getComponentType(fileName: string): ComponentInfo["type"] {
  const name = fileName.replace(/\.tsx?$/, "");

  if (name.startsWith("use") || name.endsWith("Context")) {
    return "hook";
  }
  if (name.endsWith("Modal")) {
    return "modal";
  }
  if (name.endsWith("Card") || name.endsWith("Panel") || name.endsWith("Tracker")) {
    return "container";
  }
  if (name.endsWith("Row") || name.endsWith("ListItem") || name.endsWith("Item")) {
    return "row";
  }
  return "shared";
}

/**
 * Extract component name from filename
 */
function getComponentName(fileName: string): string {
  return fileName.replace(/\.tsx?$/, "");
}

/**
 * Parse imports from a TypeScript file
 */
function parseImports(filePath: string): string[] {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf-8");
  const imports: string[] = [];

  // Match relative imports: import { X } from "./X" or from "../folder/X"
  const importRegex = /from\s+["']\.\.?\/([^"']+)["']/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    // Extract component name from path
    const parts = importPath.split("/");
    const lastPart = parts[parts.length - 1];
    // Remove file extension if present
    const componentName = lastPart.replace(/\.tsx?$/, "");
    // Skip index imports
    if (componentName !== "index") {
      imports.push(componentName);
    }
  }

  return imports;
}

/**
 * Scan a directory for components
 */
function scanDirectory(dirPath: string): ComponentInfo[] {
  if (!fs.existsSync(dirPath)) return [];

  const components: ComponentInfo[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      // Skip test files and index files
      if (entry.name.includes(".test.") || entry.name === "index.ts") continue;

      const filePath = path.join(dirPath, entry.name);
      const imports = parseImports(filePath);

      components.push({
        name: getComponentName(entry.name),
        fileName: entry.name,
        type: getComponentType(entry.name),
        imports,
      });
    }
  }

  return components;
}

/**
 * Scan an area (top-level component directory)
 */
function scanArea(areaPath: string): AreaInfo {
  const areaName = path.basename(areaPath);
  const area: AreaInfo = {
    name: areaName,
    path: areaPath,
    components: scanDirectory(areaPath),
    subfolders: new Map(),
  };

  // Scan subfolders
  const entries = fs.readdirSync(areaPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith("__")) {
      const subfolderPath = path.join(areaPath, entry.name);
      const subComponents = scanDirectory(subfolderPath);
      if (subComponents.length > 0) {
        area.subfolders.set(entry.name, subComponents);
      }
    }
  }

  return area;
}

/**
 * Generate mermaid diagram for an area
 */
function generateMermaidDiagram(area: AreaInfo): string {
  const lines: string[] = [];
  lines.push("```mermaid");
  lines.push("graph TD");

  // Track all components for styling
  const allComponents: ComponentInfo[] = [...area.components];

  // Generate subgraphs for subfolders
  for (const [folderName, components] of area.subfolders) {
    const subgraphName = folderName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    lines.push(`    subgraph "${subgraphName}"`);

    for (const comp of components) {
      lines.push(`        ${comp.name}[${comp.name}]`);
      allComponents.push(comp);
    }

    // Add relationships within subfolder
    const relationships = inferRelationships(components);
    for (const rel of relationships) {
      lines.push(`        ${rel}`);
    }

    lines.push("    end");
    lines.push("");
  }

  // Root-level components (if any without subfolders)
  if (area.components.length > 0) {
    lines.push(`    subgraph "Root"`);
    for (const comp of area.components) {
      lines.push(`        ${comp.name}[${comp.name}]`);
    }
    lines.push("    end");
    lines.push("");
  }

  // Add styling
  lines.push("    %% Styling");
  for (const comp of allComponents) {
    const color = COLORS[comp.type];
    lines.push(`    style ${comp.name} fill:${color},color:#fff`);
  }

  lines.push("```");

  return lines.join("\n");
}

/**
 * Infer relationships between components based on naming and imports
 */
function inferRelationships(components: ComponentInfo[]): string[] {
  const relationships: string[] = [];
  const componentNames = new Set(components.map((c) => c.name));

  // Find containers (Cards/Panels)
  const containers = components.filter((c) => c.type === "container");
  const modals = components.filter((c) => c.type === "modal");
  const rows = components.filter((c) => c.type === "row");

  // Container → Row relationships
  for (const container of containers) {
    for (const row of rows) {
      // Check if container imports row, or infer by naming
      if (
        container.imports.includes(row.name) ||
        row.name.startsWith(container.name.replace(/Card|Panel/, ""))
      ) {
        relationships.push(`${container.name} --> ${row.name}`);
      }
    }
  }

  // Container → Modal relationships
  for (const container of containers) {
    for (const modal of modals) {
      if (
        container.imports.includes(modal.name) ||
        modal.name.startsWith(container.name.replace(/Card|Panel/, ""))
      ) {
        relationships.push(`${container.name} --> ${modal.name}`);
      }
    }
  }

  // Row → Modal relationships
  for (const row of rows) {
    for (const modal of modals) {
      if (
        row.imports.includes(modal.name) ||
        modal.name.includes(row.name.replace(/Row|ListItem/, ""))
      ) {
        relationships.push(`${row.name} --> ${modal.name}`);
      }
    }
  }

  return [...new Set(relationships)]; // Remove duplicates
}

/**
 * Generate summary table for an area
 */
function generateSummaryTable(area: AreaInfo): string {
  const lines: string[] = [];
  lines.push("## Component Summary");
  lines.push("");
  lines.push("| Folder | Files | Containers | Modals | Rows | Hooks |");
  lines.push("|--------|-------|------------|--------|------|-------|");

  // Root level
  const rootCounts = countByType(area.components);
  if (area.components.length > 0) {
    lines.push(
      `| (root) | ${area.components.length} | ${rootCounts.container} | ${rootCounts.modal} | ${rootCounts.row} | ${rootCounts.hook} |`
    );
  }

  // Subfolders
  for (const [folderName, components] of area.subfolders) {
    const counts = countByType(components);
    lines.push(
      `| \`/${folderName}/\` | ${components.length} | ${counts.container} | ${counts.modal} | ${counts.row} | ${counts.hook} |`
    );
  }

  // Total
  const allComponents = [...area.components, ...[...area.subfolders.values()].flat()];
  const totalCounts = countByType(allComponents);
  lines.push(
    `| **Total** | **${allComponents.length}** | **${totalCounts.container}** | **${totalCounts.modal}** | **${totalCounts.row}** | **${totalCounts.hook}** |`
  );

  return lines.join("\n");
}

function countByType(components: ComponentInfo[]): Record<string, number> {
  const counts: Record<string, number> = {
    container: 0,
    modal: 0,
    row: 0,
    hook: 0,
    shared: 0,
  };
  for (const comp of components) {
    counts[comp.type]++;
  }
  return counts;
}

/**
 * Generate full documentation for an area
 */
function generateAreaDoc(area: AreaInfo): string {
  const lines: string[] = [];
  const title = area.name.charAt(0).toUpperCase() + area.name.slice(1);

  lines.push(`# ${title} Components`);
  lines.push("");
  lines.push(`Components in \`/components/${area.name}/\``);
  lines.push("");
  lines.push("## Component Hierarchy");
  lines.push("");
  lines.push(generateMermaidDiagram(area));
  lines.push("");
  lines.push(generateSummaryTable(area));
  lines.push("");
  lines.push("## Color Key");
  lines.push("");
  lines.push("| Color | Type | Examples |");
  lines.push("|-------|------|----------|");
  lines.push("| Blue | Container | Card, Panel, Tracker |");
  lines.push("| Purple | Modal | Selection, Edit dialogs |");
  lines.push("| Green | Row | ListItem, Row |");
  lines.push("| Orange | Hook | useX, Context |");
  lines.push("| Gray | Shared | Utilities |");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`*Generated by \`pnpm generate-diagrams --area=${area.name}\`*`);

  return lines.join("\n");
}

/**
 * Get all component areas
 */
function getAllAreas(): string[] {
  const entries = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && !e.name.startsWith("__")).map((e) => e.name);
}

/**
 * Main function
 */
function main() {
  console.log("Generating component diagrams...\n");

  // Get areas to process
  const areas = targetArea ? [targetArea] : getAllAreas();

  // Also process root-level components
  const rootComponents = scanDirectory(COMPONENTS_DIR);

  for (const areaName of areas) {
    const areaPath = path.join(COMPONENTS_DIR, areaName);

    if (!fs.existsSync(areaPath)) {
      console.log(`Area not found: ${areaName}`);
      continue;
    }

    const area = scanArea(areaPath);
    const doc = generateAreaDoc(area);

    if (outputMode === "files") {
      // Ensure docs directory exists
      if (!fs.existsSync(DOCS_DIR)) {
        fs.mkdirSync(DOCS_DIR, { recursive: true });
      }

      const outputPath = path.join(DOCS_DIR, `${areaName}.md`);
      fs.writeFileSync(outputPath, doc);
      console.log(`  Written: ${outputPath}`);
    } else {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`Area: ${areaName}`);
      console.log("=".repeat(60));
      console.log(doc);
    }

    if (verbose) {
      console.log(`\n  Components: ${area.components.length} root-level`);
      console.log(`  Subfolders: ${area.subfolders.size}`);
      for (const [name, comps] of area.subfolders) {
        console.log(`    ${name}/: ${comps.length} components`);
      }
    }
  }

  // Generate root-level overview
  if (!targetArea && rootComponents.length > 0) {
    console.log(`\nRoot-level components: ${rootComponents.length}`);
    for (const comp of rootComponents) {
      if (verbose) {
        console.log(`  ${comp.name} (${comp.type})`);
      }
    }
  }

  // Generate index/overview
  if (outputMode === "files" && !targetArea) {
    const indexDoc = generateIndexDoc(areas, rootComponents);
    const indexPath = path.join(DOCS_DIR, "README.md");
    fs.writeFileSync(indexPath, indexDoc);
    console.log(`  Written: ${indexPath}`);
  }

  console.log("\nDone!");
}

/**
 * Generate index documentation
 */
function generateIndexDoc(areas: string[], rootComponents: ComponentInfo[]): string {
  const lines: string[] = [];

  lines.push("# Components Architecture");
  lines.push("");
  lines.push("Auto-generated component hierarchy diagrams for Shadow Master.");
  lines.push("");
  lines.push("> **Regenerate:** Run `pnpm generate-diagrams --output=files`");
  lines.push("");
  lines.push("## Component Areas");
  lines.push("");
  lines.push("| Area | Description | Doc |");
  lines.push("|------|-------------|-----|");

  const descriptions: Record<string, string> = {
    "action-resolution": "Dice pool building and action history",
    auth: "Authentication UI (email verification)",
    character: "Character sheet display components",
    combat: "Combat tracking and initiative",
    creation: "Character creation cards and modals",
    cyberlimbs: "Cyberlimb augmentation management",
    sync: "Ruleset synchronization status",
    ui: "Shared UI primitives (Modal, Tooltip)",
  };

  for (const area of areas) {
    const desc = descriptions[area] || "Component area";
    lines.push(`| \`/${area}/\` | ${desc} | [${area}.md](./${area}.md) |`);
  }

  lines.push("");
  lines.push("## Root-Level Components");
  lines.push("");
  lines.push("| Component | Type | Purpose |");
  lines.push("|-----------|------|---------|");

  for (const comp of rootComponents) {
    lines.push(`| \`${comp.fileName}\` | ${comp.type} | - |`);
  }

  lines.push("");
  lines.push("## Color Key");
  lines.push("");
  lines.push("All diagrams use consistent color coding:");
  lines.push("");
  lines.push("| Color | Hex | Purpose |");
  lines.push("|-------|-----|---------|");
  lines.push("| Blue | `#3b82f6` | Card/Panel containers |");
  lines.push("| Purple | `#8b5cf6` | Modal dialogs |");
  lines.push("| Green | `#22c55e` | Row/ListItem components |");
  lines.push("| Orange | `#f59e0b` | Hooks and Context |");
  lines.push("| Gray | `#6b7280` | Shared utilities |");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("*Generated by `pnpm generate-diagrams --output=files`*");

  return lines.join("\n");
}

main();
