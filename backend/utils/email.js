const nodemailer = require('nodemailer');

/**
 * Send an email notification (Verification or Password Reset)
 * If SMTP credentials are not configured, it logs the action & URL directly
 * to console for seamless local development and viva presentations.
 */
const sendEmail = async (options) => {
  const isSmtpConfigured =
    process.env.EMAIL_USER &&
    process.env.EMAIL_USER !== 'your_email@gmail.com' &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_PASS !== 'your_app_password';

  if (!isSmtpConfigured) {
    console.log('====================================================');
    console.log(`[QuickBite Email Notification - Dev/Viva Mode]`);
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message Preview:\n${options.text}`);
    if (options.link) {
      console.log(`Action Link: ${options.link}`);
    }
    console.log('====================================================');
    return { success: true, mode: 'console' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"QuickBite Canteen" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html || `<p>${options.text}</p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
};

module.exports = sendEmail;
