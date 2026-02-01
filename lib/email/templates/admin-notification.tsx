/**
 * Admin Notification Email Template
 *
 * Sent to administrators for key events during early-stage testing:
 * - New user registration
 * - Account lockout
 * - Password reset requested
 */

import * as React from "react";
import { Text } from "@react-email/components";
import { BaseEmailLayout, EmailText, EmailInfoBox } from "./base";

/**
 * Notification types supported by this template
 */
export type AdminNotificationType = "new_user" | "lockout" | "password_reset";

/**
 * Props for the admin notification email template
 */
export interface AdminNotificationProps {
  /** Type of notification */
  type: AdminNotificationType;
  /** User's email address */
  userEmail: string;
  /** User's display name */
  username: string;
  /** When the event occurred (formatted string) */
  eventTime: string;
  /** Number of failed attempts (for lockout notifications) */
  failedAttempts?: number;
  /** IP address (for password reset notifications) */
  ipAddress?: string;
}

/**
 * Get subject line based on notification type
 */
export function getAdminNotificationSubject(type: AdminNotificationType): string {
  switch (type) {
    case "new_user":
      return "Shadow Master: New User Registration";
    case "lockout":
      return "Shadow Master: Account Lockout Alert";
    case "password_reset":
      return "Shadow Master: Password Reset Requested";
  }
}

/**
 * Admin notification email template
 *
 * Notifies administrators of security-relevant events.
 */
export function AdminNotificationEmailTemplate({
  type,
  userEmail,
  username,
  eventTime,
  failedAttempts,
  ipAddress,
}: AdminNotificationProps) {
  return (
    <BaseEmailLayout preview={getAdminNotificationSubject(type)} heading={getHeading(type)}>
      <EmailText>Admin notification for Shadow Master:</EmailText>

      {type === "new_user" && (
        <>
          <EmailText>A new user has registered on Shadow Master.</EmailText>
          <EmailInfoBox>
            <Text
              style={{
                color: "#22c55e",
                fontSize: "13px",
                lineHeight: "20px",
                margin: "0 0 8px 0",
                fontWeight: 600,
              }}
            >
              New User Details
            </Text>
            <Text
              style={{
                color: "#f5f5f5",
                fontSize: "13px",
                lineHeight: "20px",
                margin: "0 0 4px 0",
              }}
            >
              Username: {username}
            </Text>
            <Text
              style={{
                color: "#f5f5f5",
                fontSize: "13px",
                lineHeight: "20px",
                margin: "0 0 4px 0",
              }}
            >
              Email: {userEmail}
            </Text>
            <Text
              style={{
                color: "#f5f5f5",
                fontSize: "13px",
                lineHeight: "20px",
                margin: 0,
              }}
            >
              Registered: {eventTime}
            </Text>
          </EmailInfoBox>
        </>
      )}

      {type === "lockout" && (
        <>
          <EmailText>An account has been locked due to multiple failed login attempts.</EmailText>
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
              Username: {username}
            </Text>
            <Text
              style={{
                color: "#f5f5f5",
                fontSize: "13px",
                lineHeight: "20px",
                margin: "0 0 4px 0",
              }}
            >
              Email: {userEmail}
            </Text>
            <Text
              style={{
                color: "#f5f5f5",
                fontSize: "13px",
                lineHeight: "20px",
                margin: "0 0 4px 0",
              }}
            >
              Failed Attempts: {failedAttempts ?? "N/A"}
            </Text>
            <Text
              style={{
                color: "#f5f5f5",
                fontSize: "13px",
                lineHeight: "20px",
                margin: 0,
              }}
            >
              Locked at: {eventTime}
            </Text>
          </EmailInfoBox>
          <EmailText style={{ fontSize: "13px", color: "#fbbf24" }}>
            This may indicate a brute-force attack attempt. Consider monitoring this account.
          </EmailText>
        </>
      )}

      {type === "password_reset" && (
        <>
          <EmailText>A password reset has been requested for an account.</EmailText>
          <EmailInfoBox>
            <Text
              style={{
                color: "#60a5fa",
                fontSize: "13px",
                lineHeight: "20px",
                margin: "0 0 8px 0",
                fontWeight: 600,
              }}
            >
              Password Reset Details
            </Text>
            <Text
              style={{
                color: "#f5f5f5",
                fontSize: "13px",
                lineHeight: "20px",
                margin: "0 0 4px 0",
              }}
            >
              Username: {username}
            </Text>
            <Text
              style={{
                color: "#f5f5f5",
                fontSize: "13px",
                lineHeight: "20px",
                margin: "0 0 4px 0",
              }}
            >
              Email: {userEmail}
            </Text>
            <Text
              style={{
                color: "#f5f5f5",
                fontSize: "13px",
                lineHeight: "20px",
                margin: "0 0 4px 0",
              }}
            >
              Requested at: {eventTime}
            </Text>
            {ipAddress && (
              <Text
                style={{
                  color: "#f5f5f5",
                  fontSize: "13px",
                  lineHeight: "20px",
                  margin: 0,
                }}
              >
                IP Address: {ipAddress}
              </Text>
            )}
          </EmailInfoBox>
        </>
      )}

      <EmailText style={{ fontSize: "13px", color: "#737373" }}>
        This is an automated admin notification. You are receiving this because you are configured
        as an admin recipient.
      </EmailText>
    </BaseEmailLayout>
  );
}

/**
 * Get heading based on notification type
 */
function getHeading(type: AdminNotificationType): string {
  switch (type) {
    case "new_user":
      return "New User Registration";
    case "lockout":
      return "Account Lockout";
    case "password_reset":
      return "Password Reset Requested";
  }
}
