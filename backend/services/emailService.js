// Handles Email Logic
import nodemailer from 'nodemailer';
import { getApplicationsStatus } from '../controllers/applicationController.js';
import { getAllUsers } from '../controllers/userController.js';

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});


export const sendResetPasswordEmail = async (email, token, frontendUrl) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Password Reset Verification Code',
    html: `
      <p>Your password reset token will expire in 15 minutes.</p>
      <p>You can reset your password by clicking the following link:</p>
      <a href="${frontendUrl}/reset-password/${token}">${frontendUrl}/reset-password/${token}</a>
      <p> Have a great day! </p>
    `,
  };
  await transporter.sendMail(mailOptions);
};


export const sendEmailsToAllUsers = async () => {
  try {
    const users = await getAllUsers(); 

    for (const user of users) {

      const { UserId, Email } = user;
      try {

        await sendApplicationStatusEmail(Email, UserId);
        console.log(`Email sent to ${Email}`);
      }
       catch (emailError) {
        console.error(`Error sending email to ${Email}:`, emailError);
      }
    }
  } 
  catch (error) {
    console.error('Error sending emails to users:', error);
  }
};


export const sendApplicationStatusEmail = async (email, userId) => {
  try {
    // Fetch the application statuses
    const { pastDue, dueIn1Week, dueIn2Weeks } = await getApplicationsStatus(userId);

    // Build the email content
    const pastDueHtml = pastDue.length > 0 ? pastDue.map(app => `<li>${app.JobName} at ${app.CompanyName} (Deadline: ${app.Deadline})</li>`).join('') : '<li>No past due applications</li>';
    const dueIn1WeekHtml = dueIn1Week.length > 0 ? dueIn1Week.map(app => `<li>${app.JobName} at ${app.CompanyName} (Deadline: ${app.Deadline})</li>`).join('') : '<li>No applications due in 1 week</li>';
    const dueIn2WeeksHtml = dueIn2Weeks.length > 0 ? dueIn2Weeks.map(app => `<li>${app.JobName} at ${app.CompanyName} (Deadline: ${app.Deadline})</li>`).join('') : '<li>No applications due in 2 weeks</li>';

    // Email content with application statuses
    const emailHtml = `
    <p>Hi</p>
      <p>Here is the status of your job applications:</p>
      <h3>Past Due Applications:</h3>
      <ul>${pastDueHtml}</ul>
      <h3>Applications Due in 1 Week:</h3>
      <ul>${dueIn1WeekHtml}</ul>
      <h3>Applications Due in 2 Weeks:</h3>
      <ul>${dueIn2WeeksHtml}</ul>
    `;

    // Email options
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Your Job Application Statuses',
      html: emailHtml,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Application status email sent successfully.');
  } catch (error) {
    console.error('Error sending application status email:', error);
    throw new Error('Email sending failed');
  }
};
