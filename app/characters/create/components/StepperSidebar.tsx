"use client";

import type { CreationStep } from "@/lib/types";

interface StepperSidebarProps {
  steps: CreationStep[];
  currentStepIndex: number;
  completedSteps: string[];
  onStepClick: (index: number) => void;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function StepperSidebar({
  steps,
  currentStepIndex,
  completedSteps,
  onStepClick,
  isCollapsed,
  onToggleCollapse,
}: StepperSidebarProps & {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <div
      className={`flex-shrink-0 border-r border-zinc-200 bg-zinc-50 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 ${isCollapsed ? "w-16" : "w-64"
        }`}
    >
      <div className={`flex items-center p-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Creation Steps
          </h3>
        )}
        <button
          onClick={onToggleCollapse}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
          )}
        </button>
      </div>
      <nav className={`space-y-1 pb-4 ${isCollapsed ? "px-2" : "px-2"}`}>
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = index === currentStepIndex;
          const isClickable = index <= currentStepIndex || isCompleted;

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              title={isCollapsed ? step.title : undefined}
              className={`group flex w-full items-center rounded-lg px-2 py-2 text-left transition-colors ${isCollapsed ? "justify-center" : "gap-3 px-3"
                } ${isCurrent
                  ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100"
                  : isCompleted
                    ? "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    : "cursor-not-allowed text-zinc-400 dark:text-zinc-600"
                }`}
            >
              {/* Step indicator */}
              <div
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium ${isCompleted
                  ? "bg-emerald-500 text-white"
                  : isCurrent
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                  }`}
              >
                {isCompleted ? (
                  <CheckIcon className="h-3.5 w-3.5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step title */}
              {!isCollapsed && (
                <span className="truncate text-sm font-medium">{step.title}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

