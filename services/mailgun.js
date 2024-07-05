const nodemailer = require('nodemailer');
const template = require('../config/template');
const keys = require('../config/keys');

const { smtpHost, smtpPort, smtpUser, smtpPass, sender } = keys.smtp;

class SMTPService {
  init() {
    try {
      console.log('SMTP credentials', smtpHost, smtpPort, smtpUser);
      return nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
    } catch (error) {
      console.warn('Missing SMTP credentials');
    }
  }
}

const smtpService = new SMTPService().init();

exports.sendEmail = async (email, type, host, data) => {
  try {
    const message = prepareTemplate(type, host, data);

    const config = {
      from: `${sender}`,
      to: email,
      subject: message.subject,
      text: message.text
    };

    return await smtpService.sendMail(config);
  } catch (error) {
    return error;
  }
};

const prepareTemplate = (type, host, data) => {
  let message;

  switch (type) {
    case 'reset':
      message = template.resetEmail(host, data);
      break;

    case 'reset-confirmation':
      message = template.confirmResetPasswordEmail();
      break;

    case 'signup':
      message = template.signupEmail(data);
      break;

    case 'merchant-signup':
      message = template.merchantSignup(host, data);
      break;

    case 'merchant-welcome':
      message = template.merchantWelcome(data);
      break;

    case 'newsletter-subscription':
      message = template.newsletterSubscriptionEmail();
      break;

    case 'contact':
      message = template.contactEmail();
      break;

    case 'merchant-application':
      message = template.merchantApplicationEmail();
      break;

    case 'merchant-deactivate-account':
      message = template.merchantDeactivateAccount();
      break;

    case 'order-confirmation':
      message = template.orderConfirmationEmail(data);
      break;

    default:
      message = '';
  }

  return message;
};
