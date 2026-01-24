/**
 * Email Changed Alert Email Template
 *
 * Sent to the OLD email address when a user changes their email.
 * This alerts the user in case they didn't make the change.
 */

import * as React from "react";
import { Text } from "@react-email/components";
import { BaseEmailLayout, EmailText, EmailInfoBox } from "./base";

/**
 * Props for the email changed alert template
 */
export interface EmailChangedEmailTemplateProps {
  /** User's display name for personalization */
  username: string;
  /** Time when email was changed (ISO 8601 or formatted string) */
  changeTime: string;
  /** The new email address (masked for privacy) */
  newEmail: string;
  /** The old email address (recipient) */
  oldEmail: string;
}

/**
 * Mask an email address for privacy
 *
 * @example
 * maskEmail("john.doe@example.com") // "j***e@example.com"
 * maskEmail("ab@x.com") // "a*b@x.com"
 * maskEmail("a@x.com") // "a***@x.com"
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!domain) return email;

  if (localPart.length <= 1) {
    return `${localPart}***@${domain}`;
  } else if (localPart.length === 2) {
    return `${localPart[0]}*${localPart[1]}@${domain}`;
  } else {
    const first = localPart[0];
    const last = localPart[localPart.length - 1];
    return `${first}***${last}@${domain}`;
  }
}

/**
 * Email changed alert email template
 *
 * Notifies the OLD email address when account email is changed.
 */
export function EmailChangedEmailTemplate({
  username,
  changeTime,
  newEmail,
  oldEmail,
}: EmailChangedEmailTemplateProps) {
  return (
    <BaseEmailLayout
      preview="Your Shadow Master email address has been changed"
      heading="Email Address Changed"
    >
      <EmailText>Hey {username},</EmailText>

      <EmailText>
        The email address associated with your Shadow Master account was changed on {changeTime}.
      </EmailText>

      <EmailInfoBox>
        <Text
          style={{
            color: "#fbbf24",
            fontSize: "13px",
            lineHeight: "20px",
            margin: "0 0 8px 0",
            fontWeight: 600,
          }}
        >
          Change Details
        </Text>
        <Text
          style={{
            color: "#f5f5f5",
            fontSize: "13px",
            lineHeight: "20px",
            margin: "0 0 4px 0",
          }}
        >
          Previous email: {oldEmail}
        </Text>
        <Text
          style={{
            color: "#f5f5f5",
            fontSize: "13px",
            lineHeight: "20px",
            margin: 0,
          }}
        >
          New email: {newEmail}
        </Text>
      </EmailInfoBox>

      <EmailText>
        If you made this change, no further action is required. Future notifications will be sent to
        your new email address.
      </EmailText>

      <EmailInfoBox>
        <Text
          style={{
            color: "#ef4444",
            fontSize: "13px",
            lineHeight: "20px",
            margin: "0 0 8px 0",
            fontWeight: 600,
          }}
        >
          Didn&apos;t make this change?
        </Text>
        <Text
          style={{
            color: "#a3a3a3",
            fontSize: "13px",
            lineHeight: "20px",
            margin: 0,
          }}
        >
          If you did not change your email address, your account may have been compromised. Please
          contact support immediately to secure your account and recover access.
        </Text>
      </EmailInfoBox>

      <EmailText style={{ fontSize: "13px", color: "#737373" }}>
        This is an automated security notification. You do not need to reply to this email.
      </EmailText>
    </BaseEmailLayout>
  );
}
