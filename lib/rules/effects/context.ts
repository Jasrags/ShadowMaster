/**
 * Resolution Context Builder
 *
 * Fluent API for constructing EffectResolutionContext objects.
 * Reduces coupling between UI components and effect resolution internals.
 *
 * @see /docs/plans/unified-effects-system.md Section 4
 * @see Issue #109
 */

import type {
  EffectActionContext,
  EnvironmentContext,
  EffectResolutionContext,
  SpecificAction,
  CharacterStateFlags,
} from "@/lib/types/effects";

export class EffectContextBuilder {
  private action: EffectActionContext | undefined;
  private environment: EnvironmentContext | undefined;
  private charState: CharacterStateFlags | undefined;

  // ---------------------------------------------------------------------------
  // Static factory methods
  // ---------------------------------------------------------------------------

  static forSkillTest(skill: string): EffectContextBuilder {
    return new EffectContextBuilder().setAction({
      type: "skill-test",
      skill,
    });
  }

  static forPerception(
    type: "audio" | "visual",
    specificAction?: SpecificAction
  ): EffectContextBuilder {
    return new EffectContextBuilder().setAction({
      type: "skill-test",
      skill: "perception",
      perceptionType: type,
      specificAction,
    });
  }

  static forRangedAttack(weaponId: string): EffectContextBuilder {
    return new EffectContextBuilder().setAction({
      type: "attack",
      attackType: "ranged",
      weaponId,
    });
  }

  static forMeleeAttack(weaponId: string): EffectContextBuilder {
    return new EffectContextBuilder().setAction({
      type: "attack",
      attackType: "melee",
      weaponId,
    });
  }

  static forDefense(specificAction?: SpecificAction): EffectContextBuilder {
    return new EffectContextBuilder().setAction({
      type: "defense",
      specificAction,
    });
  }

  static forInitiative(): EffectContextBuilder {
    return new EffectContextBuilder().setAction({
      type: "initiative",
    });
  }

  // ---------------------------------------------------------------------------
  // Chainable modifier methods
  // ---------------------------------------------------------------------------

  withEnvironment(env: Partial<EnvironmentContext>): this {
    this.environment = { ...this.environment, ...env };
    return this;
  }

  withAttribute(attribute: string): this {
    if (this.action) {
      this.action = { ...this.action, attribute };
    }
    return this;
  }

  withSpecificAction(specificAction: SpecificAction): this {
    if (this.action) {
      this.action = { ...this.action, specificAction };
    }
    return this;
  }

  withSkillCategory(category: string): this {
    if (this.action) {
      this.action = { ...this.action, skillCategory: category };
    }
    return this;
  }

  withCharacterState(flags: CharacterStateFlags): this {
    this.charState = { ...this.charState, ...flags };
    return this;
  }

  // ---------------------------------------------------------------------------
  // Terminal method
  // ---------------------------------------------------------------------------

  build(): EffectResolutionContext {
    if (!this.action) {
      throw new Error(
        "EffectContextBuilder: action context is required — use a static factory method"
      );
    }

    if (this.action.type === "attack" && !this.action.attackType) {
      throw new Error("EffectContextBuilder: attack context requires attackType");
    }

    return {
      action: { ...this.action },
      ...(this.environment ? { environment: { ...this.environment } } : {}),
      ...(this.charState ? { characterState: { ...this.charState } } : {}),
    };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private setAction(action: EffectActionContext): this {
    this.action = action;
    return this;
  }
}
