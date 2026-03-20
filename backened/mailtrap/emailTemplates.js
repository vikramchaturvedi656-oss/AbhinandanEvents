// mailtrap/emailTemplates.js

/**
 * Base layout for all transactional emails
 * @param {string} title - Email subject/title
 * @param {string} body - HTML content of the email
 * @returns {string} Complete HTML email
 */
const baseLayout = (title, body) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "Arial", sans-serif;
        background-color: #f8fafc;
        color: #0f172a;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        padding: 24px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      }
      h2 {
        margin-top: 0;
        color: #111827;
      }
      p {
        line-height: 1.6;
        color: #374151;
      }
      .btn {
        display: inline-block;
        background-color: #f97316;
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        margin: 16px 0;
      }
      .footer {
        font-size: 12px;
        color: #9ca3af;
        text-align: center;
        margin-top: 20px;
      }
      @media (max-width: 480px) {
        .container {
          padding: 16px;
        }
        .btn {
          padding: 10px 16px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      ${body}
      <div class="footer">
        &copy; ${new Date().getFullYear()} Abhinandan Events. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;

/**
 * Email verification template
 * @param {string} verifyUrl - Verification link
 * @param {string} name - Recipient name
 */
const verificationTemplate = (verifyUrl, name = "there") => baseLayout(
  "Verify your email",
  `
    <h2>Hello ${name},</h2>
    <p>Thank you for signing up with <strong>Abhinandan Events</strong>. Please confirm your email to get started.</p>
    <a href="${verifyUrl}" class="btn">Verify Email</a>
    <p>If the button doesn't work, copy and paste the following link into your browser:</p>
    <p>${verifyUrl}</p>
  `
);

/**
 * Password reset template
 * @param {string} resetUrl - Reset link
 * @param {string} name - Recipient name
 */
const resetPasswordTemplate = (resetUrl, name = "there") => baseLayout(
  "Reset your password",
  `
    <h2>Hello ${name},</h2>
    <p>We received a request to reset your password. Click the button below to set a new one.</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <p>If you did not request this, you can safely ignore this email.</p>
    <p>${resetUrl}</p>
  `
);

/**
 * Password reset success template
 * @param {string} name - Recipient name
 */
const resetSuccessTemplate = (name = "there") => baseLayout(
  "Password updated",
  `
    <h2>Hello ${name},</h2>
    <p>Your password has been successfully updated. If you did not perform this action, please reset your password immediately.</p>
  `
);

export { verificationTemplate, resetPasswordTemplate, resetSuccessTemplate };