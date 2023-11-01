const nodemailer = require('nodemailer')

const sendEmail = async (options) => {

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "76d6b1c2505e75",
      pass: "********4655"
    }
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  await transport.sendMail(mailOptions)
}

module.exports = sendEmail;