"use client";

import type { RuleReferenceTable as RuleReferenceTableType } from "@/lib/types";

interface RuleReferenceTableProps {
  table: RuleReferenceTableType;
}

export function RuleReferenceTable({ table }: RuleReferenceTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
            {table.headers.map((header, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-3 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="whitespace-nowrap px-3 py-1.5 text-zinc-600 dark:text-zinc-400"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
