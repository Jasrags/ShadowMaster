/**
 * Mock Email Transport
 *
 * Stores emails in memory for testing purposes.
 * Provides utilities to inspect sent emails and simulate failures.
 */

import type { EmailAddress, EmailMessage, EmailResult, EmailTransport } from "../types";

/**
 * Sent email record with additional metadata
 */
export interface SentEmail {
  message: EmailMessage;
  result: EmailResult;
  sentAt: Date;
}

/**
 * Mock Transport implementation
 */
export class MockTransport implements EmailTransport {
  readonly type = "mock" as const;
  private defaultFrom: EmailAddress;
  private sentEmails: SentEmail[] = [];
  private shouldFail = false;
  private failureMessage = "Simulated failure";
  private messageIdCounter = 0;

  constructor(defaultFrom: EmailAddress) {
    this.defaultFrom = defaultFrom;
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    const timestamp = new Date().toISOString();

    if (this.shouldFail) {
      const result: EmailResult = {
        success: false,
        error: this.failureMessage,
        transport: this.type,
        timestamp,
      };

      this.sentEmails.push({
        message: { ...message, from: message.from || this.defaultFrom },
        result,
        sentAt: new Date(),
      });

      return result;
    }

    this.messageIdCounter++;
    const messageId = `mock-${this.messageIdCounter}-${Date.now()}`;

    const result: EmailResult = {
      success: true,
      messageId,
      transport: this.type,
      timestamp,
    };

    this.sentEmails.push({
      message: { ...message, from: message.from || this.defaultFrom },
      result,
      sentAt: new Date(),
    });

    return result;
  }

  async verify(): Promise<boolean> {
    return !this.shouldFail;
  }

  // ===== Testing Utilities =====

  /**
   * Get all sent emails
   */
  getSentEmails(): SentEmail[] {
    return [...this.sentEmails];
  }

  /**
   * Get the most recently sent email
   */
  getLastEmail(): SentEmail | undefined {
    return this.sentEmails[this.sentEmails.length - 1];
  }

  /**
   * Get sent emails matching a filter
   */
  findEmails(predicate: (email: SentEmail) => boolean): SentEmail[] {
    return this.sentEmails.filter(predicate);
  }

  /**
   * Find emails sent to a specific address
   */
  findEmailsTo(email: string): SentEmail[] {
    return this.findEmails((sent) => {
      const to = Array.isArray(sent.message.to) ? sent.message.to : [sent.message.to];
      return to.some((addr) => addr.email === email);
    });
  }

  /**
   * Find emails with a specific subject
   */
  findEmailsBySubject(subject: string): SentEmail[] {
    return this.findEmails((sent) => sent.message.subject === subject);
  }

  /**
   * Get count of sent emails
   */
  getEmailCount(): number {
    return this.sentEmails.length;
  }

  /**
   * Clear all sent emails
   */
  clear(): void {
    this.sentEmails = [];
    this.messageIdCounter = 0;
  }

  /**
   * Simulate transport failure for testing error handling
   *
   * @param message - Optional custom error message
   */
  simulateFailure(message = "Simulated failure"): void {
    this.shouldFail = true;
    this.failureMessage = message;
  }

  /**
   * Stop simulating failures
   */
  clearFailure(): void {
    this.shouldFail = false;
    this.failureMessage = "Simulated failure";
  }

  /**
   * Check if the transport is configured to fail
   */
  isFailureMode(): boolean {
    return this.shouldFail;
  }
}

// Singleton mock transport for testing
let mockTransportInstance: MockTransport | null = null;

/**
 * Get the shared mock transport instance
 *
 * Use this in tests to access the mock transport created by EmailService.
 */
export function getMockTransport(): MockTransport | null {
  return mockTransportInstance;
}

/**
 * Set the shared mock transport instance
 *
 * Called internally by the transport factory.
 */
export function setMockTransport(transport: MockTransport): void {
  mockTransportInstance = transport;
}

/**
 * Clear the shared mock transport instance
 */
export function clearMockTransport(): void {
  if (mockTransportInstance) {
    mockTransportInstance.clear();
  }
  mockTransportInstance = null;
}
