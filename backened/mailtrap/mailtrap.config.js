// mailtrap/mailtrap.config.js
import { MailtrapClient } from "mailtrap";

// Ensure the Mailtrap token is provided
if (!process.env.MAILTRAP_TOKEN) {
  console.warn(
    "⚠️ MAILTRAP_TOKEN is not set. Emails will not be sent. " +
    "Please set MAILTRAP_TOKEN in your .env file."
  );
}

// Initialize the Mailtrap client
const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

// Default sender info; can be overridden via .env
const sender = {
  email: process.env.MAILTRAP_SENDER_EMAIL || "hello@abhinandanevents.com",
  name: process.env.MAILTRAP_SENDER_NAME || "Abhinandan Events",
};

export { client, sender };