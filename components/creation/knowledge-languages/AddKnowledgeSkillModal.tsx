"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useSkills } from "@/lib/rules";
import type { AddKnowledgeSkillModalProps, KnowledgeCategory } from "./types";

export function AddKnowledgeSkillModal({
  isOpen,
  onClose,
  onAdd,
  pointsRemaining,
}: AddKnowledgeSkillModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory>("academic");
  const { exampleKnowledgeSkills, knowledgeCategories } = useSkills();

  const handleSelectFromDropdown = (skillName: string) => {
    const selected = exampleKnowledgeSkills?.find((s) => s.name === skillName);
    if (selected) {
      setName(selected.name);
      setCategory(selected.category as KnowledgeCategory);
    }
  };

  const handleAdd = () => {
    if (name.trim() && pointsRemaining > 0) {
      onAdd(name.trim(), category, 1);
      setName("");
      setCategory("academic");
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    setCategory("academic");
    onClose();
  };

  if (!isOpen) return null;

  // Use ruleset categories if available, otherwise fallback
  const categoryOptions =
    knowledgeCategories?.length > 0
      ? knowledgeCategories
      : [
          { id: "academic", name: "Academic" },
          { id: "interests", name: "Interests" },
          { id: "professional", name: "Professional" },
          { id: "street", name: "Street" },
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400">
            Add Knowledge Skill
          </h3>
          <button
            onClick={handleClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Quick select dropdown */}
            {exampleKnowledgeSkills && exampleKnowledgeSkills.length > 0 && (
              <div>
                <select
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-amber-600 dark:bg-zinc-800 dark:text-zinc-100"
                  defaultValue=""
                  disabled={pointsRemaining <= 0}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleSelectFromDropdown(e.target.value);
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="" disabled>
                    Quick add from examples...
                  </option>
                  <optgroup label="Academic">
                    {exampleKnowledgeSkills
                      .filter((s) => s.category === "academic")
                      .map((skill) => (
                        <option key={skill.name} value={skill.name}>
                          {skill.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Interests">
                    {exampleKnowledgeSkills
                      .filter((s) => s.category === "interests")
                      .map((skill) => (
                        <option key={skill.name} value={skill.name}>
                          {skill.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Professional">
                    {exampleKnowledgeSkills
                      .filter((s) => s.category === "professional")
                      .map((skill) => (
                        <option key={skill.name} value={skill.name}>
                          {skill.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Street">
                    {exampleKnowledgeSkills
                      .filter((s) => s.category === "street")
                      .map((skill) => (
                        <option key={skill.name} value={skill.name}>
                          {skill.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
            )}

            {/* Custom input with category and add button */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Or type custom skill name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}
                  className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAdd}
                  disabled={!name.trim() || pointsRemaining <= 0}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    name.trim() && pointsRemaining > 0
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                  }`}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Info text */}
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              <p>
                Knowledge skills cost 1 point per rating level.{" "}
                <span className="font-medium">{pointsRemaining} points remaining.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <button
            onClick={handleClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
