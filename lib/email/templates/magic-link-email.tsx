/**
 * Magic Link Email Template
 *
 * Sent to users who request a passwordless sign-in link.
 * Uses the base Shadow Master email styling.
 */

import * as React from "react";
import { Text } from "@react-email/components";
import { BaseEmailLayout, EmailText, EmailButton, EmailInfoBox } from "./base";

/**
 * Props for the magic link email template
 */
export interface MagicLinkEmailTemplateProps {
  /** User's display name for personalization */
  username: string;
  /** Full magic link URL including token */
  magicLinkUrl: string;
}

/**
 * Magic link email template
 *
 * Provides a clear call-to-action for users to sign in without a password.
 * Emphasizes 15-minute expiration and includes security warning.
 */
export function MagicLinkEmailTemplate({ username, magicLinkUrl }: MagicLinkEmailTemplateProps) {
  return (
    <BaseEmailLayout preview="Sign in to Shadow Master" heading="Sign In to Shadow Master">
      <EmailText>Hey {username},</EmailText>

      <EmailText>
        Click the button below to sign in to your Shadow Master account. No password needed.
      </EmailText>

      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={magicLinkUrl}>Sign In</EmailButton>
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
          This link expires in 15 minutes
        </Text>
        <Text
          style={{
            color: "#a3a3a3",
            fontSize: "13px",
            lineHeight: "20px",
            margin: 0,
          }}
        >
          If you didn&apos;t request this sign-in link, you can safely ignore this email. Your
          account will remain secure.
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
        {magicLinkUrl}
      </Text>
    </BaseEmailLayout>
  );
}
