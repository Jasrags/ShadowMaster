/**
 * Account Lockout Alert Email Template
 *
 * Sent to users when their account is locked due to too many failed login attempts.
 * Includes lockout duration and security advice.
 */

import * as React from "react";
import { Text } from "@react-email/components";
import { BaseEmailLayout, EmailText, EmailInfoBox } from "./base";

/**
 * Props for the lockout alert email template
 */
export interface LockoutAlertEmailTemplateProps {
  /** User's display name for personalization */
  username: string;
  /** Time when lockout occurred (ISO 8601 or formatted string) */
  lockoutTime: string;
  /** Time when account will be unlocked (ISO 8601 or formatted string) */
  unlockTime: string;
}

/**
 * Account lockout alert email template
 *
 * Notifies users when their account is locked and provides security guidance.
 */
export function LockoutAlertEmailTemplate({
  username,
  lockoutTime,
  unlockTime,
}: LockoutAlertEmailTemplateProps) {
  return (
    <BaseEmailLayout preview="Your Shadow Master account has been locked" heading="Account Locked">
      <EmailText>Hey {username},</EmailText>

      <EmailText>
        Your Shadow Master account has been temporarily locked due to multiple failed login
        attempts. This is a security measure to protect your account.
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
          Lockout Details
        </Text>
        <Text
          style={{
            color: "#f5f5f5",
            fontSize: "13px",
            lineHeight: "20px",
            margin: "0 0 4px 0",
          }}
        >
          Locked at: {lockoutTime}
        </Text>
        <Text
          style={{
            color: "#f5f5f5",
            fontSize: "13px",
            lineHeight: "20px",
            margin: 0,
          }}
        >
          Unlocks at: {unlockTime}
        </Text>
      </EmailInfoBox>

      <EmailText style={{ fontWeight: 600 }}>If this was you:</EmailText>
      <EmailText>
        Wait for the lockout period to expire, then try logging in again with your correct password.
        If you&apos;ve forgotten your password, use the &quot;Forgot Password&quot; link on the
        login page.
      </EmailText>

      <EmailText style={{ fontWeight: 600 }}>If this wasn&apos;t you:</EmailText>
      <EmailText>Someone may be trying to access your account. We recommend:</EmailText>
      <Text
        style={{
          color: "#a3a3a3",
          fontSize: "14px",
          lineHeight: "22px",
          margin: "0 0 16px 0",
          paddingLeft: "16px",
        }}
      >
        • Change your password immediately after the lockout expires
        <br />
        • Use a strong, unique password
        <br />• Check for any unauthorized changes to your account
      </Text>

      <EmailText style={{ fontSize: "13px", color: "#737373" }}>
        This is an automated security notification. You do not need to reply to this email.
      </EmailText>
    </BaseEmailLayout>
  );
}
