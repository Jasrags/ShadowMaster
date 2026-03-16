/**
 * Tests for ContentPreview component — infinite scroll behavior
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContentPreview from "../ContentPreview";
import type { EditionCode } from "@/lib/types";

// ---------- IntersectionObserver mock ----------

type IntersectionCallback = (entries: IntersectionObserverEntry[]) => void;

let intersectionCallback: IntersectionCallback;
const observedElements = new Set<Element>();

class MockIntersectionObserver {
  constructor(callback: IntersectionCallback) {
    intersectionCallback = callback;
  }
  observe(el: Element) {
    observedElements.add(el);
  }
  unobserve(el: Element) {
    observedElements.delete(el);
  }
  disconnect() {
    observedElements.clear();
  }
}

async function triggerIntersection(isIntersecting: boolean) {
  const entries = Array.from(observedElements).map(
    (target) =>
      ({
        isIntersecting,
        target,
        intersectionRatio: isIntersecting ? 1 : 0,
      }) as unknown as IntersectionObserverEntry
  );
  await act(async () => {
    intersectionCallback(entries);
  });
}

// ---------- Helpers ----------

function makeItems(count: number, startIndex = 0) {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${startIndex + i}`,
    name: `Item ${startIndex + i}`,
    category: "gear",
    subcategory: "Pistols",
    summary: `Summary for item ${startIndex + i}`,
    source: "Core Rulebook",
  }));
}

function mockFetchPages(totalItems: number, pageSize: number) {
  const allItems = makeItems(totalItems);
  return vi.fn().mockImplementation((url: string) => {
    const parsed = new URL(url, "http://localhost");
    const offset = parseInt(parsed.searchParams.get("offset") || "0");
    const limit = parseInt(parsed.searchParams.get("limit") || String(pageSize));
    const items = allItems.slice(offset, offset + limit);
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          items,
          pagination: {
            total: totalItems,
            limit,
            offset,
            hasMore: offset + items.length < totalItems,
          },
        }),
    });
  });
}

// ---------- Tests ----------

describe("ContentPreview", () => {
  const editionCode: EditionCode = "sr5";

  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    observedElements.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders initial batch of items on mount", async () => {
    global.fetch = mockFetchPages(50, 50);

    render(<ContentPreview editionCode={editionCode} />);

    await waitFor(() => {
      expect(screen.getByText("Item 0")).toBeInTheDocument();
    });

    expect(screen.getByText("Item 49")).toBeInTheDocument();
  });

  it("does not show pagination controls", async () => {
    global.fetch = mockFetchPages(50, 50);

    render(<ContentPreview editionCode={editionCode} />);

    await waitFor(() => {
      expect(screen.getByText("Item 0")).toBeInTheDocument();
    });

    expect(screen.queryByLabelText("Previous page")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
  });

  it("loads more items when sentinel becomes visible", async () => {
    global.fetch = mockFetchPages(80, 50);

    render(<ContentPreview editionCode={editionCode} />);

    await waitFor(() => {
      expect(screen.getByText("Item 0")).toBeInTheDocument();
    });

    // Trigger intersection — sentinel visible
    await triggerIntersection(true);

    await waitFor(() => {
      expect(screen.getByText("Item 50")).toBeInTheDocument();
    });

    // All 80 items should now be rendered
    expect(screen.getByText("Item 79")).toBeInTheDocument();
  });

  it("shows scroll sentinel when more items available", async () => {
    global.fetch = mockFetchPages(80, 50);

    render(<ContentPreview editionCode={editionCode} />);

    await waitFor(() => {
      expect(screen.getByText("Item 0")).toBeInTheDocument();
    });

    expect(screen.getByTestId("scroll-loader")).toBeInTheDocument();
  });

  it("does not fetch more when all items are loaded", async () => {
    global.fetch = mockFetchPages(30, 50);

    render(<ContentPreview editionCode={editionCode} />);

    await waitFor(() => {
      expect(screen.getByText("Item 0")).toBeInTheDocument();
    });

    // All 30 items fit in one page — sentinel should not be rendered
    expect(screen.queryByTestId("scroll-loader")).not.toBeInTheDocument();

    // Only one fetch should have been made
    expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1);
  });

  it("resets items when search changes", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    global.fetch = mockFetchPages(50, 50);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<ContentPreview editionCode={editionCode} />);

    await waitFor(() => {
      expect(screen.getByText("Item 0")).toBeInTheDocument();
    });

    // Swap mock to return different items for search
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          items: [{ id: "search-1", name: "Ares Predator", category: "gear" }],
          pagination: { total: 1, limit: 50, offset: 0, hasMore: false },
          search: "ares",
        }),
    });

    const input = screen.getByLabelText("Search content");
    await user.type(input, "ares");

    // Advance past debounce
    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(screen.getByText("Ares Predator")).toBeInTheDocument();
    });

    // Old items should be gone
    expect(screen.queryByText("Item 0")).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it("resets items when category changes", async () => {
    global.fetch = mockFetchPages(50, 50);

    render(<ContentPreview editionCode={editionCode} />);

    await waitFor(() => {
      expect(screen.getByText("Item 0")).toBeInTheDocument();
    });

    // Swap mock for category filter
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          items: [{ id: "magic-1", name: "Fireball", category: "magic" }],
          pagination: { total: 1, limit: 50, offset: 0, hasMore: false },
          category: "magic",
        }),
    });

    const magicButton = screen.getByRole("button", { name: "Magic" });
    await act(async () => {
      magicButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText("Fireball")).toBeInTheDocument();
    });

    expect(screen.queryByText("Item 0")).not.toBeInTheDocument();
  });

  it("shows total count in footer", async () => {
    global.fetch = mockFetchPages(150, 50);

    render(<ContentPreview editionCode={editionCode} />);

    await waitFor(() => {
      expect(screen.getByText("Item 0")).toBeInTheDocument();
    });

    expect(screen.getByText(/150/)).toBeInTheDocument();
  });
});
