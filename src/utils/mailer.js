'use strict';

// Minimal mailer abstraction. In dev, we log URLs to console.
// You can wire a real provider via SMTP or API and replace this.

async function sendMail(to, subject, text) {
  if (process.env.MAIL_DISABLE_LOG !== '1') {
    console.log(`[MAIL] To: ${to} | Subject: ${subject} | Body: ${text}`);
  }
  return true;
}

module.exports = { sendMail };


