/**
 * Password Changed Email Template
 *
 * Sent to users when their password is successfully changed (self-service or reset).
 * Includes "if this wasn't you" warning and reset link.
 */

import * as React from "react";
import { Text } from "@react-email/components";
import { BaseEmailLayout, EmailText, EmailButton, EmailInfoBox } from "./base";

/**
 * Props for the password changed email template
 */
export interface PasswordChangedEmailTemplateProps {
  /** User's display name for personalization */
  username: string;
  /** Time when password was changed (ISO 8601 or formatted string) */
  changeTime: string;
  /** URL to initiate password reset if unauthorized */
  resetPasswordUrl: string;
}

/**
 * Password changed confirmation email template
 *
 * Confirms successful password change and provides security guidance.
 */
export function PasswordChangedEmailTemplate({
  username,
  changeTime,
  resetPasswordUrl,
}: PasswordChangedEmailTemplateProps) {
  return (
    <BaseEmailLayout
      preview="Your Shadow Master password has been changed"
      heading="Password Changed"
    >
      <EmailText>Hey {username},</EmailText>

      <EmailText>Your Shadow Master password was successfully changed on {changeTime}.</EmailText>

      <EmailText>
        If you made this change, no further action is required. Your account is secure.
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
          If you did not change your password, your account may have been compromised. Reset your
          password immediately using the button below.
        </Text>
      </EmailInfoBox>

      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={resetPasswordUrl}>Reset Password Now</EmailButton>
      </div>

      <EmailText style={{ fontSize: "13px", color: "#737373" }}>
        If the button above doesn&apos;t work, copy and paste this link into your browser:
      </EmailText>

      <Text
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "4px",
          color: "#60a5fa",
          fontSize: "12px",
          lineHeight: "16px",
          padding: "12px",
          wordBreak: "break-all",
        }}
      >
        {resetPasswordUrl}
      </Text>

      <EmailText style={{ fontSize: "13px", color: "#737373", marginTop: "24px" }}>
        This is an automated security notification. You do not need to reply to this email.
      </EmailText>
    </BaseEmailLayout>
  );
}
