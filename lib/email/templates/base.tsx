/**
 * Base Email Template
 *
 * React Email component providing consistent Shadow Master branding.
 * Dark theme matching the application aesthetic.
 */

import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

/**
 * Props for the base email layout
 */
export interface BaseEmailLayoutProps {
  /** Preview text shown in email client list */
  preview?: string;
  /** Email heading */
  heading?: string;
  /** Main content */
  children: React.ReactNode;
}

/**
 * Shadow Master brand colors (dark theme)
 */
const colors = {
  background: "#0a0a0a",
  container: "#141414",
  border: "#262626",
  text: "#f5f5f5",
  textMuted: "#a3a3a3",
  accent: "#ef4444", // Shadowrun red
  link: "#60a5fa",
};

/**
 * Base email layout with Shadow Master branding
 */
export function BaseEmailLayout({ preview, heading, children }: BaseEmailLayoutProps) {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading as="h1" style={styles.logo}>
              Shadow Master
            </Heading>
            <Text style={styles.tagline}>Shadowrun Character Management</Text>
          </Section>

          <Hr style={styles.divider} />

          {/* Main Content */}
          <Section style={styles.content}>
            {heading && (
              <Heading as="h2" style={styles.heading}>
                {heading}
              </Heading>
            )}
            {children}
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              This email was sent by{" "}
              <Link href="https://shadowmaster.local" style={styles.link}>
                Shadow Master
              </Link>
            </Text>
            <Text style={styles.footerText}>
              &copy; {new Date().getFullYear()} Shadow Master. All rights reserved.
            </Text>
            <Text style={styles.legal}>
              Shadowrun is a registered trademark of The Topps Company, Inc. and is used without
              permission. This application is not affiliated with or endorsed by The Topps Company,
              Inc. or Catalyst Game Labs.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Styled text paragraph for email content
 */
export function EmailText({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <Text style={{ ...styles.text, ...style }}>{children}</Text>;
}

/**
 * Call-to-action button for emails
 */
export function EmailButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={styles.button}>
      {children}
    </Link>
  );
}

/**
 * Info box for highlighting important content
 */
export function EmailInfoBox({ children }: { children: React.ReactNode }) {
  return <Section style={styles.infoBox}>{children}</Section>;
}

/**
 * Styles for the email template
 */
const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: colors.background,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    margin: 0,
    padding: "40px 0",
  },
  container: {
    backgroundColor: colors.container,
    border: `1px solid ${colors.border}`,
    borderRadius: "8px",
    margin: "0 auto",
    maxWidth: "600px",
    padding: "0",
  },
  header: {
    padding: "32px 32px 16px",
    textAlign: "center" as const,
  },
  logo: {
    color: colors.accent,
    fontSize: "28px",
    fontWeight: "bold",
    letterSpacing: "-0.5px",
    margin: "0 0 4px",
  },
  tagline: {
    color: colors.textMuted,
    fontSize: "14px",
    margin: "0",
  },
  divider: {
    borderColor: colors.border,
    borderTopWidth: "1px",
    margin: "0",
  },
  content: {
    padding: "32px",
  },
  heading: {
    color: colors.text,
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 24px",
  },
  text: {
    color: colors.text,
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 16px",
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: "6px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "600",
    padding: "12px 24px",
    textDecoration: "none",
  },
  infoBox: {
    backgroundColor: "rgba(96, 165, 250, 0.1)",
    border: `1px solid rgba(96, 165, 250, 0.2)`,
    borderRadius: "6px",
    margin: "16px 0",
    padding: "16px",
  },
  footer: {
    padding: "24px 32px",
    textAlign: "center" as const,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: "12px",
    margin: "0 0 8px",
  },
  legal: {
    color: colors.textMuted,
    fontSize: "10px",
    lineHeight: "14px",
    margin: "16px 0 0",
    opacity: 0.7,
  },
  link: {
    color: colors.link,
    textDecoration: "underline",
  },
};
