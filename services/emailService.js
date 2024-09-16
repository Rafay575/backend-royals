const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = (email, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Login Credentials',
    text: `Welcome! Here are your login credentials: \n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.`,
  };

  return transporter.sendMail(mailOptions);
};
