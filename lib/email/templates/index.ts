/**
 * Email Template Utilities
 *
 * Functions for rendering React Email templates to HTML and plain text.
 */

import { render } from "@react-email/components";
import type { ReactElement } from "react";

// Re-export template components
export { BaseEmailLayout, EmailText, EmailButton, EmailInfoBox } from "./base";
export type { BaseEmailLayoutProps } from "./base";

// Export verification email template
export { VerificationEmailTemplate } from "./verification-email";
export type { VerificationEmailTemplateProps } from "./verification-email";

// Export password reset email template
export { PasswordResetEmailTemplate } from "./password-reset-email";
export type { PasswordResetEmailTemplateProps } from "./password-reset-email";

/**
 * Rendered template output
 */
export interface RenderedTemplate {
  /** HTML version of the email */
  html: string;
  /** Plain text version of the email */
  text: string;
}

/**
 * Render a React Email template to HTML and plain text
 *
 * @param template - React Email component to render
 * @returns Object with html and text versions
 *
 * @example
 * ```typescript
 * import { BaseEmailLayout, EmailText, renderTemplate } from '@/lib/email/templates';
 *
 * const { html, text } = await renderTemplate(
 *   <BaseEmailLayout heading="Welcome!">
 *     <EmailText>Thanks for signing up!</EmailText>
 *   </BaseEmailLayout>
 * );
 * ```
 */
export async function renderTemplate(template: ReactElement): Promise<RenderedTemplate> {
  const [html, text] = await Promise.all([render(template), render(template, { plainText: true })]);

  return { html, text };
}

/**
 * Render template synchronously (for simple cases)
 *
 * @param template - React Email component to render
 * @returns Object with html and text versions
 */
export function renderTemplateSync(template: ReactElement): RenderedTemplate {
  // React Email's render is actually synchronous despite returning a Promise
  // For simple templates, we can call it directly
  let html = "";
  let text = "";

  const htmlPromise = render(template);
  const textPromise = render(template, { plainText: true });

  // Handle both sync and async cases
  if (htmlPromise instanceof Promise) {
    throw new Error("Use renderTemplate for async rendering");
  }

  html = htmlPromise as unknown as string;
  text = textPromise as unknown as string;

  return { html, text };
}
