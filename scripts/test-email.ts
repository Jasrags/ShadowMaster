/**
 * Test Email Script
 *
 * Sends a test email using the configured email transport.
 *
 * Usage:
 *   pnpm dlx tsx scripts/test-email.ts
 *   pnpm dlx tsx scripts/test-email.ts recipient@example.com
 */

import { sendEmail, loadEmailConfig } from "../lib/email";

async function main() {
  const recipient = process.argv[2] || "test@example.com";

  console.log("📧 Email Test Script\n");

  // Show current configuration
  const config = loadEmailConfig();
  console.log("Configuration:");
  console.log(`  Transport: ${config.transport}`);
  console.log(`  From: ${config.from.name} <${config.from.email}>`);
  if (config.transport === "smtp" && config.smtp) {
    console.log(`  SMTP Host: ${config.smtp.host}:${config.smtp.port}`);
  }
  if (config.transport === "file" && config.file) {
    console.log(`  Output Dir: ${config.file.outputDir}`);
  }
  console.log("");

  console.log(`Sending test email to: ${recipient}\n`);

  const result = await sendEmail({
    to: { email: recipient, name: "Test Recipient" },
    subject: "Test Email from Shadow Master",
    text: `Hello Runner,

This is a test email from Shadow Master's email infrastructure.

If you're seeing this, the email system is working correctly.

Stay safe in the shadows,
Shadow Master`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #141414; border: 1px solid #262626; border-radius: 8px; padding: 32px; }
    h1 { color: #ef4444; margin-top: 0; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #262626; color: #a3a3a3; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Shadow Master</h1>
    <p>Hello Runner,</p>
    <p>This is a test email from Shadow Master's email infrastructure.</p>
    <p>If you're seeing this, the email system is working correctly.</p>
    <p>Stay safe in the shadows,<br>Shadow Master</p>
    <div class="footer">
      <p>Sent via ${config.transport} transport</p>
    </div>
  </div>
</body>
</html>`,
  });

  console.log("Result:");
  console.log(`  Success: ${result.success}`);
  console.log(`  Transport: ${result.transport}`);
  if (result.messageId) {
    console.log(`  Message ID: ${result.messageId}`);
  }
  if (result.error) {
    console.log(`  Error: ${result.error}`);
  }
  console.log(`  Timestamp: ${result.timestamp}`);

  if (result.success) {
    console.log("\n✅ Email sent successfully!");
    if (config.transport === "smtp") {
      console.log("   Check Mailpit at http://localhost:8025");
    } else if (config.transport === "file") {
      console.log(`   Check ${config.file?.outputDir || "data/emails"} for the saved email`);
    }
  } else {
    console.log("\n❌ Email failed to send");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
