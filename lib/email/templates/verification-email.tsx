/**
 * Email Verification Template
 *
 * Sent to new users to verify their email address.
 * Uses the base Shadow Master email styling.
 */

import * as React from "react";
import { Text } from "@react-email/components";
import { BaseEmailLayout, EmailText, EmailButton, EmailInfoBox } from "./base";

/**
 * Props for the verification email template
 */
export interface VerificationEmailTemplateProps {
  /** User's display name for personalization */
  username: string;
  /** Full verification URL including token */
  verifyUrl: string;
}

/**
 * Email verification template
 *
 * Provides a clear call-to-action for users to verify their email address.
 * Includes security information about link expiration.
 */
export function VerificationEmailTemplate({ username, verifyUrl }: VerificationEmailTemplateProps) {
  return (
    <BaseEmailLayout preview="Verify your Shadow Master account" heading="Verify Your Email">
      <EmailText>Hey {username},</EmailText>

      <EmailText>
        Welcome to Shadow Master! To get started managing your Shadowrun characters, please verify
        your email address by clicking the button below.
      </EmailText>

      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={verifyUrl}>Verify Email Address</EmailButton>
      </div>

      <EmailInfoBox>
        <Text
          style={{
            color: "#a3a3a3",
            fontSize: "13px",
            lineHeight: "20px",
            margin: 0,
          }}
        >
          This link will expire in 24 hours. If you didn&apos;t create a Shadow Master account, you
          can safely ignore this email.
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
        {verifyUrl}
      </Text>
    </BaseEmailLayout>
  );
}
