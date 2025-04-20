// Handles Email Logic
import nodemailer from 'nodemailer';
import { getAllUsers } from '../controllers/userController.js';
import pool from '../config/db.js';

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
      const { UserId, Email, ApplicationEmail } = user;

      if (ApplicationEmail) {
        try {
          await sendApplicationStatusEmail(Email, UserId);
          console.log(`Email sent to ${Email}`);
        } catch (emailError) {
          console.error(`Error sending email to ${Email}:`, emailError);
        }
      } else {
        console.log(`Skipping ${Email} as ApplicationEmail is not true.`);
      }
      }
    } 
  
  catch (error) {
    console.error('Error sending emails to users:', error);
  }
};

export const sendApplicationStatusEmail = async (email, userId) => {
  try {
    const statuses = await getUserStatuses(userId);
    const applicationCounts = await getApplicationCountsByStatuses(userId);
    const applicationsWithDeadlines = await getApplicationsWithDeadlines(userId);

    const userResult = await pool.query(
      `SELECT "Username" FROM "Users" WHERE "UserId" = $1`,
      [userId]
    );
    const username = userResult.rows[0]?.Username || "there";

    const countsMap = {};
    applicationCounts.forEach((row) => {
      countsMap[row.StatusId] = parseInt(row.count);
    });

    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const statusBlocks = statuses
      .map((status) => {
        const count = countsMap[status.StatusId] || 0;
        return `
          <div style="
            display: inline-block;
            width: 48%;
            margin: 1%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #fff;
            text-align: center;
            font-size: 14px;
            color: #000;
            box-sizing: border-box;
          ">
            <strong style="display: block; margin-bottom: 6px;">${status.StatusName}</strong>
            <span style="font-size: 18px; font-weight: bold;">${count}</span>
          </div>
        `;
      })
      .join("");

    const applicationCards = applicationsWithDeadlines
      .map((app) => {
        return `
          <a href="https://gradflow.org" style="text-decoration: none; color: inherit;">
            <div style="position: relative; margin-bottom: 16px; padding: 10px; border: 1px solid ${app.color}; border-radius: 8px;">
              ${
                app.CompanyLogo
                  ? `<img src="${app.CompanyLogo}" alt="${app.CompanyName} Logo" style="position: absolute; top: 10px; right: 10px; height: 40px;">`
                  : ""
              }
              <strong>${app.JobName}</strong><br/>
              <span>${app.CompanyName}</span><br/>
              <span style="color: gray;">Deadline: ${formatDate(app.Deadline)}</span>
            </div>
          </a>
        `;
      })
      .join("");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #000;">
        <!-- Header -->
        <table width="100%" style="padding: 20px; background-color: #f5f5f5;">
          <tr>
            <td align="left">
              <img src="https://i.imgur.com/ctEoTCl.png" alt="GradFlow Logo" style="height: 50px;">
            </td>
            <td align="right" style="text-align: right;">
              <h3 style="margin: 0; color: #000;">Weekly Summary</h3>
              <p style="margin: 0; color: #000;">${currentDate}</p>
            </td>
          </tr>
        </table>

        <!-- Greeting -->
        <div style="text-align: center; padding: 20px; background-color: #f5f5f5;">
          <h2 style="color: #FF6200;">Hi ${username},</h2>
          <p style="margin: 0; color: #000;">Here's a snapshot of your job search activities for the week.</p>
        </div>

        <!-- Status Overview -->
        <div style="border: 1px solid #7C41E3; border-radius: 12px; padding: 15px; margin: 20px 0; background-color: #f9f9f9; text-align: center;">
          ${statusBlocks}
        </div>

        <!-- Upcoming Deadlines -->
        <h3 style="color: #000;">Upcoming Deadlines:</h3>
        <div>${applicationCards}</div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; background-color: #f5f5f5;">
          <p style="margin: 0; color: #000;">Keep track of your applications on GradFlow.</p>
          <a href="https://gradflow.org" style="display: inline-block; padding: 10px 20px; background-color:#7C41E3; color: #fff; text-decoration: none; border-radius: 4px;">Update Your Boards</a>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Your Job Application Statuses - Weekly Update",
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    console.log("Application status email sent successfully.");
  } catch (error) {
    console.error("Error sending application status email:", error);
    throw new Error("Email sending failed");
  }
};



// Function to fetch statuses for a user
async function getUserStatuses(userId) {
  try {
    const result = await pool.query(`
      SELECT s."StatusId", sn."StatusName", s."StatusOrder"
      FROM "Status" s
      JOIN "StatusName" sn ON s."StatusNameId" = sn."StatusNameId"
      WHERE s."UserId" = $1
      ORDER BY s."StatusOrder" ASC;
    `, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching statuses:', error);
    throw error;
  }
}

// Function to get counts of applications in each status
async function getApplicationCountsByStatuses(userId) {
  try {
    const result = await pool.query(`
      SELECT a."StatusId", COUNT(*) as count
      FROM "Application" a
      WHERE a."UserId" = $1
      GROUP BY a."StatusId";
    `, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching application counts by statuses:', error);
    throw error;
  }
}

// Function to fetch applications with deadlines and colors
async function getApplicationsWithDeadlines(userId) {
  const result = await pool.query(
    `
    SELECT a."JobName", a."CompanyName", a."Deadline", a."Color" as color, a."CompanyLogo"
    FROM "Application" a
    WHERE a."UserId" = $1 AND a."Deadline" >= NOW()
    ORDER BY a."Deadline" ASC;
  `,
    [userId]
  );
  return result.rows;
}

// Function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

