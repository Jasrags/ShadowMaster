"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

// =============================================================================
// TYPES
// =============================================================================

interface SidebarContextValue {
  /** Whether the mobile sidebar drawer is open */
  isOpen: boolean;
  /** Whether the desktop sidebar is collapsed */
  isCollapsed: boolean;
  /** Open the mobile sidebar */
  open: () => void;
  /** Close the mobile sidebar */
  close: () => void;
  /** Toggle the mobile sidebar */
  toggle: () => void;
  /** Toggle the desktop collapsed state */
  toggleCollapse: () => void;
  /** Set collapsed state directly */
  setCollapsed: (collapsed: boolean) => void;
}

interface SidebarProviderProps {
  children: ReactNode;
  /** localStorage key for persisting collapsed state */
  storageKey?: string;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY = "shadow-master-sidebar-collapsed-global";

// =============================================================================
// CONTEXT
// =============================================================================

const SidebarContext = createContext<SidebarContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export function SidebarProvider({
  children,
  storageKey = STORAGE_KEY,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  // Mobile drawer state (never persisted)
  const [isOpen, setIsOpen] = useState(false);

  // Desktop collapsed state (persisted to localStorage)
  // Start with null to indicate "not yet loaded from storage"
  const [isCollapsed, setIsCollapsedState] = useState<boolean | null>(null);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        setIsCollapsedState(JSON.parse(saved));
      } else {
        setIsCollapsedState(defaultCollapsed);
      }
    } catch {
      setIsCollapsedState(defaultCollapsed);
    }
  }, [storageKey, defaultCollapsed]);

  // Persist collapsed state to localStorage
  const setCollapsed = useCallback(
    (collapsed: boolean) => {
      setIsCollapsedState(collapsed);
      try {
        localStorage.setItem(storageKey, JSON.stringify(collapsed));
      } catch {
        // localStorage may be unavailable
      }
    },
    [storageKey]
  );

  // Mobile drawer controls
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Desktop collapse toggle
  const toggleCollapse = useCallback(() => {
    setCollapsed(!isCollapsed);
  }, [isCollapsed, setCollapsed]);

  // Close mobile sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Close mobile sidebar on route change (resize to desktop)
  useEffect(() => {
    const handleResize = () => {
      // lg breakpoint is 1024px
      if (window.innerWidth >= 1024 && isOpen) {
        close();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, close]);

  // Use false as default while loading to prevent hydration mismatch
  const collapsedValue = isCollapsed ?? defaultCollapsed;

  const value: SidebarContextValue = {
    isOpen,
    isCollapsed: collapsedValue,
    open,
    close,
    toggle,
    toggleCollapse,
    setCollapsed,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// =============================================================================
// OPTIONAL: Hook that doesn't throw (for conditional usage)
// =============================================================================

export function useSidebarOptional(): SidebarContextValue | null {
  return useContext(SidebarContext);
}
