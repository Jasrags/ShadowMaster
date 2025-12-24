
export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

/**
 * Simple in-memory rate limiter
 */
export class RateLimiter {
  private static instances: Map<string, RateLimiter> = new Map();
  private store: Map<string, RateLimitInfo> = new Map();

  constructor(private options: RateLimitOptions) {}

  /**
   * Get or create a rate limiter instance for a specific scope
   */
  public static get(scope: string, options: RateLimitOptions): RateLimiter {
    if (!this.instances.has(scope)) {
      this.instances.set(scope, new RateLimiter(options));
    }
    return this.instances.get(scope)!;
  }

  /**
   * Check if a request should be rate limited
   */
  public isRateLimited(key: string): boolean {
    const now = Date.now();
    let info = this.store.get(key);

    if (!info || now > info.resetTime) {
      info = {
        count: 1,
        resetTime: now + this.options.windowMs,
      };
      this.store.set(key, info);
      return false;
    }

    info.count++;
    return info.count > this.options.max;
  }

  /**
   * Get remaining attempts for a key
   */
  public getRemaining(key: string): number {
    const info = this.store.get(key);
    if (!info || Date.now() > info.resetTime) {
      return this.options.max;
    }
    return Math.max(0, this.options.max - info.count);
  }

  /**
   * Reset rate limit for a key
   */
  public reset(key: string): void {
    this.store.delete(key);
  }
}
