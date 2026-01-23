"use client";

/**
 * Accessible Tooltip Component
 *
 * Provides tooltip functionality using react-aria-components.
 * Supports both hover and keyboard focus activation.
 *
 * Features:
 * - Keyboard accessible (shows on focus)
 * - Automatic positioning
 * - Proper ARIA attributes
 * - Customizable delay and placement
 * - Dark mode support
 *
 * @see https://react-spectrum.adobe.com/react-aria/Tooltip.html
 */

import { ReactNode } from "react";
import {
  Tooltip as AriaTooltip,
  TooltipTrigger,
  TooltipProps as AriaTooltipProps,
  OverlayArrow,
  Button as AriaButton,
} from "react-aria-components";

// =============================================================================
// TYPES
// =============================================================================

export type TooltipPlacement =
  | "top"
  | "top start"
  | "top end"
  | "bottom"
  | "bottom start"
  | "bottom end"
  | "left"
  | "left top"
  | "left bottom"
  | "right"
  | "right top"
  | "right bottom";

export interface TooltipProps {
  /** The content to show in the tooltip */
  content: ReactNode;
  /** The trigger element - should be focusable */
  children: ReactNode;
  /** Tooltip placement relative to trigger */
  placement?: TooltipPlacement;
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Delay before hiding tooltip (ms) */
  closeDelay?: number;
  /** Whether the tooltip is disabled */
  isDisabled?: boolean;
  /** Whether to show arrow pointing to trigger */
  showArrow?: boolean;
  /** Additional className for tooltip content */
  className?: string;
}

// =============================================================================
// TOOLTIP CONTENT COMPONENT
// =============================================================================

interface TooltipContentProps extends AriaTooltipProps {
  children: ReactNode;
  showArrow?: boolean;
  className?: string;
}

function TooltipContent({
  children,
  showArrow = true,
  className = "",
  ...props
}: TooltipContentProps) {
  return (
    <AriaTooltip
      {...props}
      className={`
        z-[9999] rounded-md bg-zinc-900 px-2 py-1.5 text-xs text-white shadow-lg
        dark:bg-zinc-100 dark:text-zinc-900
        ${className}
      `}
    >
      {showArrow && (
        <OverlayArrow>
          <svg width={8} height={8} viewBox="0 0 8 8" className="fill-zinc-900 dark:fill-zinc-100">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
      )}
      {children}
    </AriaTooltip>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Accessible tooltip that shows on hover and keyboard focus.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Tooltip content="Edit item">
 *   <button>
 *     <Edit className="h-4 w-4" />
 *   </button>
 * </Tooltip>
 *
 * // With placement
 * <Tooltip content="More information" placement="right">
 *   <Info className="h-4 w-4" />
 * </Tooltip>
 *
 * // With custom delay
 * <Tooltip content="Quick tip" delay={0}>
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 700,
  closeDelay = 0,
  isDisabled = false,
  showArrow = true,
  className,
}: TooltipProps) {
  return (
    <TooltipTrigger delay={delay} closeDelay={closeDelay} isDisabled={isDisabled}>
      {children}
      <TooltipContent placement={placement} showArrow={showArrow} className={className}>
        {content}
      </TooltipContent>
    </TooltipTrigger>
  );
}

export { TooltipTrigger, TooltipContent };

// =============================================================================
// INFO TOOLTIP - SIMPLIFIED COMPONENT FOR INFO ICONS
// =============================================================================

interface InfoTooltipProps {
  /** The tooltip content */
  content: ReactNode;
  /** Tooltip placement */
  placement?: TooltipPlacement;
  /** Delay before showing (ms) */
  delay?: number;
  /** Aria label for the button */
  label?: string;
  /** Additional className for the icon */
  iconClassName?: string;
}

/**
 * Simple info tooltip with built-in button and icon.
 * Use this for info icons that show explanatory text on hover.
 *
 * @example
 * ```tsx
 * <InfoTooltip content="Explains what this field does" label="Field info" />
 * ```
 */
export function InfoTooltip({
  content,
  placement = "bottom",
  delay = 300,
  label = "More info",
  iconClassName = "h-3 w-3 cursor-help text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
}: InfoTooltipProps) {
  return (
    <TooltipTrigger delay={delay}>
      <AriaButton
        aria-label={label}
        className="rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClassName}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </AriaButton>
      <TooltipContent placement={placement}>{content}</TooltipContent>
    </TooltipTrigger>
  );
}
