/**
 * Password Reset Email Template
 *
 * Sent to users who request a password reset.
 * Uses the base Shadow Master email styling.
 */

import * as React from "react";
import { Text } from "@react-email/components";
import { BaseEmailLayout, EmailText, EmailButton, EmailInfoBox } from "./base";

/**
 * Props for the password reset email template
 */
export interface PasswordResetEmailTemplateProps {
  /** User's display name for personalization */
  username: string;
  /** Full password reset URL including token */
  resetUrl: string;
}

/**
 * Password reset email template
 *
 * Provides a clear call-to-action for users to reset their password.
 * Emphasizes 1-hour expiration and includes security warning.
 */
export function PasswordResetEmailTemplate({
  username,
  resetUrl,
}: PasswordResetEmailTemplateProps) {
  return (
    <BaseEmailLayout preview="Reset your Shadow Master password" heading="Reset Your Password">
      <EmailText>Hey {username},</EmailText>

      <EmailText>
        We received a request to reset your Shadow Master password. Click the button below to create
        a new password.
      </EmailText>

      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={resetUrl}>Reset Password</EmailButton>
      </div>

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
          This link expires in 1 hour
        </Text>
        <Text
          style={{
            color: "#a3a3a3",
            fontSize: "13px",
            lineHeight: "20px",
            margin: 0,
          }}
        >
          If you didn&apos;t request a password reset, you can safely ignore this email. Your
          password will remain unchanged.
        </Text>
      </EmailInfoBox>

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
        {resetUrl}
      </Text>
    </BaseEmailLayout>
  );
}
