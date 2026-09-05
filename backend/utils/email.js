const { BrevoClient } = require('@getbrevo/brevo');

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
  timeoutInSeconds: 15,
});

const sendEmail = async (options) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail(
      {
        sender: {
          name: 'QuickBite Canteen',
          email: process.env.EMAIL_FROM,
        },

        to: [
          {
            email: options.to,
          },
        ],

        subject: options.subject,

        htmlContent:
          options.html ||
          `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <p>${options.text || ''}</p>
            </div>
          `,

        textContent: options.text || '',
      },
      {
        timeoutInSeconds: 15,
        maxRetries: 1,
      }
    );

    console.log('QuickBite email sent successfully:', result.messageId);

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error(
      'Brevo email error:',
      error?.response?.body ||
        error?.message ||
        error
    );

    return {
      success: false,
      error:
        error?.response?.body ||
        error?.message ||
        'Email sending failed',
    };
  }
};

module.exports = sendEmail;