// mailtrap/emails.js
import { client, sender } from "./mailtrap.config.js";
import {
  verificationTemplate,
  resetPasswordTemplate,
  resetSuccessTemplate,
} from "./emailTemplates.js";

/**
 * Sends an email via Mailtrap
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 */
const sendEmail = async (to, subject, html) => {
  if (!process.env.MAILTRAP_TOKEN) {
    console.warn("MAILTRAP_TOKEN not set; skipping email send.");
    return;
  }

  try {
    await client.send({
      from: sender,
      to: [{ email: to }],
      subject,
      html,
      category: "transactional",
    });
    console.log(`✅ Email sent to ${to} | Subject: "${subject}"`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}: ${error.message}`);
  }
};

/**
 * Send email verification link to new users
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} token - Verification token
 */
export const sendVerificationEmail = async (email, name, token) => {
  const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const verifyUrl = `${clientUrl}/verify/${token}`;
  const html = verificationTemplate(verifyUrl, name);
  await sendEmail(email, "Verify your Abhinandan Events account", html);
};

/**
 * Send password reset instructions
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} token - Password reset token
 */
export const sendPasswordResetEmail = async (email, name, token) => {
  const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const resetUrl = `${clientUrl}/reset-password/${token}`;
  const html = resetPasswordTemplate(resetUrl, name);
  await sendEmail(email, "Reset your Abhinandan Events password", html);
};

/**
 * Notify user that password reset was successful
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 */
export const sendPasswordResetSuccessEmail = async (email, name) => {
  const html = resetSuccessTemplate(name);
  await sendEmail(email, "Your Abhinandan Events password was updated", html);
};