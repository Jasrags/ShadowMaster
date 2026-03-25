/**
 * Tests for notoriety trigger mechanics (Run Faster pp. 196-211)
 *
 * Notoriety triggers record unprofessional runner behavior during runs.
 * Triggers can be applied (incrementing notoriety) and reversed (decrementing).
 */

import { describe, it, expect } from "vitest";
import {
  applyNotorietyTrigger,
  reverseNotorietyTrigger,
  getActiveTriggerRecords,
  calculateTriggerNotoriety,
} from "../notoriety";
import type { ReputationState } from "../notoriety";
import type { NotorietyTriggerData } from "../module-payloads";
import type { NotorietyTriggerRecord } from "@/lib/types/character";

// =============================================================================
// MOCK FACTORIES
// =============================================================================

function createReputation(overrides: Partial<ReputationState> = {}): ReputationState {
  return {
    streetCred: 2,
    notoriety: 0,
    publicAwareness: 1,
    ...overrides,
  };
}

function createTrigger(overrides: Partial<NotorietyTriggerData> = {}): NotorietyTriggerData {
  return {
    id: "hacking-johnsons-commlink",
    name: "Hacking Johnson's Commlink",
    description: "Attempting to hack the Johnson's commlink during a meet",
    notorietyChange: 1,
    phase: "the-meet",
    source: "run-faster",
    page: 200,
    ...overrides,
  };
}

const ACTOR_ID = "user-gm-1";

// =============================================================================
// applyNotorietyTrigger
// =============================================================================

describe("applyNotorietyTrigger", () => {
  it("applies a trigger and increments notoriety", () => {
    const reputation = createReputation({ notoriety: 2 });
    const trigger = createTrigger({ notorietyChange: 1 });

    const result = applyNotorietyTrigger(reputation, trigger, ACTOR_ID);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.reputation.notoriety).toBe(3);
    expect(result.reputation.streetCred).toBe(2); // unchanged
    expect(result.reputation.publicAwareness).toBe(1); // unchanged
    expect(result.record.triggerId).toBe("hacking-johnsons-commlink");
    expect(result.record.triggerName).toBe("Hacking Johnson's Commlink");
    expect(result.record.notorietyChange).toBe(1);
    expect(result.record.appliedBy).toBe(ACTOR_ID);
    expect(result.record.reversedAt).toBeUndefined();
  });

  it("applies a high-value trigger", () => {
    const reputation = createReputation({ notoriety: 1 });
    const trigger = createTrigger({
      id: "killing-a-paying-johnson",
      name: "Killing a Paying Johnson",
      notorietyChange: 3,
    });

    const result = applyNotorietyTrigger(reputation, trigger, ACTOR_ID);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.reputation.notoriety).toBe(4);
    expect(result.record.notorietyChange).toBe(3);
  });

  it("includes session note when provided", () => {
    const reputation = createReputation();
    const trigger = createTrigger();

    const result = applyNotorietyTrigger(
      reputation,
      trigger,
      ACTOR_ID,
      "Session 5: meet at the Penumbra"
    );

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.record.sessionNote).toBe("Session 5: meet at the Penumbra");
  });

  it("appends to existing log", () => {
    const existingRecord: NotorietyTriggerRecord = {
      id: "existing-1",
      triggerId: "appearing-heavily-armed",
      triggerName: "Appearing Heavily Armed",
      notorietyChange: 1,
      appliedAt: "2024-01-01T00:00:00Z",
      appliedBy: ACTOR_ID,
    };

    const reputation = createReputation({
      notoriety: 1,
      notorietyLog: [existingRecord],
    });
    const trigger = createTrigger();

    const result = applyNotorietyTrigger(reputation, trigger, ACTOR_ID);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.reputation.notorietyLog).toHaveLength(2);
    expect(result.reputation.notorietyLog![0].id).toBe("existing-1");
    expect(result.reputation.notorietyLog![1].triggerId).toBe("hacking-johnsons-commlink");
  });

  it("does not mutate the input reputation", () => {
    const reputation = createReputation({ notoriety: 1 });
    const trigger = createTrigger();

    applyNotorietyTrigger(reputation, trigger, ACTOR_ID);

    expect(reputation.notoriety).toBe(1);
    expect(reputation.notorietyLog).toBeUndefined();
  });

  it("rejects trigger with zero notoriety change", () => {
    const reputation = createReputation();
    const trigger = createTrigger({ notorietyChange: 0 });

    const result = applyNotorietyTrigger(reputation, trigger, ACTOR_ID);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("positive");
  });

  it("rejects trigger with negative notoriety change", () => {
    const reputation = createReputation();
    const trigger = createTrigger({ notorietyChange: -1 });

    const result = applyNotorietyTrigger(reputation, trigger, ACTOR_ID);

    expect(result.success).toBe(false);
  });

  it("initializes log when reputation has no existing log", () => {
    const reputation = createReputation();
    const trigger = createTrigger();

    const result = applyNotorietyTrigger(reputation, trigger, ACTOR_ID);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.reputation.notorietyLog).toHaveLength(1);
  });
});

// =============================================================================
// reverseNotorietyTrigger
// =============================================================================

describe("reverseNotorietyTrigger", () => {
  function createReputationWithRecord(): {
    reputation: ReputationState;
    recordId: string;
  } {
    const recordId = "record-to-reverse";
    const record: NotorietyTriggerRecord = {
      id: recordId,
      triggerId: "hacking-johnsons-commlink",
      triggerName: "Hacking Johnson's Commlink",
      notorietyChange: 1,
      appliedAt: "2024-06-15T10:00:00Z",
      appliedBy: "user-gm-1",
    };
    return {
      reputation: createReputation({
        notoriety: 3,
        notorietyLog: [record],
      }),
      recordId,
    };
  }

  it("reverses a trigger and decrements notoriety", () => {
    const { reputation, recordId } = createReputationWithRecord();

    const result = reverseNotorietyTrigger(reputation, recordId, ACTOR_ID);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.reputation.notoriety).toBe(2);
    expect(result.record.reversedAt).toBeDefined();
    expect(result.record.reversedBy).toBe(ACTOR_ID);
  });

  it("does not allow notoriety to go below zero", () => {
    const record: NotorietyTriggerRecord = {
      id: "big-record",
      triggerId: "killing-a-paying-johnson",
      triggerName: "Killing a Paying Johnson",
      notorietyChange: 3,
      appliedAt: "2024-06-15T10:00:00Z",
      appliedBy: ACTOR_ID,
    };

    const reputation = createReputation({
      notoriety: 1,
      notorietyLog: [record],
    });

    const result = reverseNotorietyTrigger(reputation, "big-record", ACTOR_ID);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.reputation.notoriety).toBe(0);
  });

  it("returns error for non-existent record", () => {
    const { reputation } = createReputationWithRecord();

    const result = reverseNotorietyTrigger(reputation, "nonexistent-id", ACTOR_ID);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("not found");
  });

  it("returns error for already-reversed record", () => {
    const reversedRecord: NotorietyTriggerRecord = {
      id: "already-reversed",
      triggerId: "hacking-johnsons-commlink",
      triggerName: "Hacking Johnson's Commlink",
      notorietyChange: 1,
      appliedAt: "2024-06-15T10:00:00Z",
      appliedBy: ACTOR_ID,
      reversedAt: "2024-06-15T11:00:00Z",
      reversedBy: ACTOR_ID,
    };

    const reputation = createReputation({
      notoriety: 2,
      notorietyLog: [reversedRecord],
    });

    const result = reverseNotorietyTrigger(reputation, "already-reversed", ACTOR_ID);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("already been reversed");
  });

  it("does not mutate the input reputation or log", () => {
    const { reputation, recordId } = createReputationWithRecord();
    const originalNotoriety = reputation.notoriety;
    const originalLogLength = reputation.notorietyLog!.length;

    reverseNotorietyTrigger(reputation, recordId, ACTOR_ID);

    expect(reputation.notoriety).toBe(originalNotoriety);
    expect(reputation.notorietyLog).toHaveLength(originalLogLength);
    expect(reputation.notorietyLog![0].reversedAt).toBeUndefined();
  });

  it("returns error when reputation has no log", () => {
    const reputation = createReputation({ notoriety: 2 });

    const result = reverseNotorietyTrigger(reputation, "some-id", ACTOR_ID);

    expect(result.success).toBe(false);
  });
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

describe("getActiveTriggerRecords", () => {
  it("returns only non-reversed records", () => {
    const records: NotorietyTriggerRecord[] = [
      {
        id: "active-1",
        triggerId: "t1",
        triggerName: "Trigger 1",
        notorietyChange: 1,
        appliedAt: "2024-01-01T00:00:00Z",
        appliedBy: ACTOR_ID,
      },
      {
        id: "reversed-1",
        triggerId: "t2",
        triggerName: "Trigger 2",
        notorietyChange: 1,
        appliedAt: "2024-01-02T00:00:00Z",
        appliedBy: ACTOR_ID,
        reversedAt: "2024-01-03T00:00:00Z",
        reversedBy: ACTOR_ID,
      },
      {
        id: "active-2",
        triggerId: "t3",
        triggerName: "Trigger 3",
        notorietyChange: 3,
        appliedAt: "2024-01-04T00:00:00Z",
        appliedBy: ACTOR_ID,
      },
    ];

    const active = getActiveTriggerRecords(records);

    expect(active).toHaveLength(2);
    expect(active[0].id).toBe("active-1");
    expect(active[1].id).toBe("active-2");
  });

  it("returns empty array for empty log", () => {
    expect(getActiveTriggerRecords([])).toHaveLength(0);
  });
});

describe("calculateTriggerNotoriety", () => {
  it("sums active trigger notoriety changes", () => {
    const records: NotorietyTriggerRecord[] = [
      {
        id: "r1",
        triggerId: "t1",
        triggerName: "T1",
        notorietyChange: 1,
        appliedAt: "2024-01-01T00:00:00Z",
        appliedBy: ACTOR_ID,
      },
      {
        id: "r2",
        triggerId: "t2",
        triggerName: "T2",
        notorietyChange: 3,
        appliedAt: "2024-01-02T00:00:00Z",
        appliedBy: ACTOR_ID,
      },
      {
        id: "r3",
        triggerId: "t3",
        triggerName: "T3",
        notorietyChange: 1,
        appliedAt: "2024-01-03T00:00:00Z",
        appliedBy: ACTOR_ID,
        reversedAt: "2024-01-04T00:00:00Z",
        reversedBy: ACTOR_ID,
      },
    ];

    expect(calculateTriggerNotoriety(records)).toBe(4); // 1 + 3, skipping reversed
  });

  it("returns 0 for empty log", () => {
    expect(calculateTriggerNotoriety([])).toBe(0);
  });
});
