// Handles Email Logic
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// password reset
export const sendResetPasswordEmail = async (email, token, frontendUrl) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Password Reset Verification Code',
    html: `
      <p>Your password reset token will expire in 15 minutes.</p>
      <p>You can reset your password by clicking the following link:</p>
      <a href="${frontendUrl}/reset-password/${token}">${frontendUrl}/reset-password/${token}</a>
    `,
  };
  await transporter.sendMail(mailOptions);
};
