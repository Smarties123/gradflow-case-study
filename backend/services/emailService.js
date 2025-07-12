// Handles Email Logic
import nodemailer from 'nodemailer';
import { getAllUsers } from '../controllers/userController.js';
import pool from '../config/db.js';
import { motivationalQuotes } from './motivationalQuotes.js';

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


//TODO: change the links for now
export const sendVerificationTokenEmail = async (email, token, frontendUrl) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'User Verification Code',
    html: `
      <p>Below is your user verification code</p>
      <p>You need to click on the link below to activate your gradflow account</p>
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

// Get a random motivationalQuote
const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];


export const sendApplicationStatusEmail = async (email, userId) => {
  try {
    const statuses = await getUserStatuses(userId);
    const applicationCounts = await getApplicationCountsByStatuses(userId);
    const applicationsWithDeadlines = await getApplicationsWithDeadlines(userId);

    // Define the date when you want to show the updates section
  const showUpdates = new Date().toDateString() === new Date("2025-07-09").toDateString(); // Example date


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
        padding: 15px;
        border-radius: 10px;
        background: linear-gradient(145deg, #ff9047, #f26203);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3);
        text-align: center;
        font-size: 14px;
        color: #fff;
        font-weight: bold;
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
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
    
    <!-- Header -->
    <table width="100%" style="margin-bottom: 20px;">
      <tr>
        <td align="left">
          <img src="https://i.imgur.com/ctEoTCl.png" alt="GradFlow Logo" style="height: 50px;">
        </td>
        <td align="right" style="text-align: right;">
          <h2 style="margin: 0; color: #333;">Weekly Career Digest</h2>
          <p style="margin: 0; color: #888;">${currentDate}</p>
        </td>
      </tr>
    </table>

    <!-- Greeting -->
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #FF6200;">Hey ${username},</h2>
      <p>Here's your weekly snapshot and a look at what's coming next.</p>
    </div>

    <!-- Section 1: Application Status Overview -->
    <div style="background: #fff; border-radius: 8px; padding: 10px 20px 20px 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); margin-bottom: 30px;">
      <h3 style="color: #7C41E3;">📊 Your Application Overview</h3>
      <!-- Status Overview -->
        <div style=" padding: 15px; margin: 20px 0; text-align: center;">
          ${statusBlocks}
        </div>
    </div>

   ${showUpdates ? `
        <!-- Section 2: Updates -->
      <div style="background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); margin-bottom: 30px;">
        <h3 style="color: #FF6200; font-size: 20px;">✨ Hot Off the Press: What’s New on GradFlow!</h3>
        <p style="color: #444; font-size: 15px; margin-top: 10px;">
          We’ve rolled out some major upgrades to help you apply smarter and stay organized with style. Here's what just landed:
        </p>
        <ul style="list-style: none; padding-left: 0; margin-top: 15px;">
          <li style="margin-bottom: 10px;"><span style="font-size: 16px; color:black;">🧩 <strong>Drag & Drop Columns</strong> –</span> Instantly rearrange your workflow to fit how you think. Customization? You got it.</li>
          <li style="margin-bottom: 10px;"><span style="font-size: 16px; color:black;">✏️ <strong>Rename Statuses</strong> –</span> Rename columns with ease to match your unique application stages.</li>
          <li style="margin-bottom: 10px;"><span style="font-size: 16px; color:black;">🏢 <strong>Company Picker in Drawer</strong> –</span> Assign or switch companies on your cards without leaving the card view.</li>
          <li style="margin-bottom: 10px;"><span style="font-size: 16px; color:black;">🎨 <strong>UI Refresh</strong> –</span> Cleaner layouts, smoother interactions, and a sleeker design across the board.</li>
          <li style="margin-bottom: 10px;"><span style="font-size: 16px; color:black;">📈 <strong>Dashboard Overhaul</strong> –</span> Crystal-clear insights into your progress with beautiful visuals and real-time stats.</li>
          <li style="margin-bottom: 10px;"><span style="font-size: 16px; color:black;">⚡ <strong>Speed Boost</strong> –</span> Everything is faster. Open your board and feel the difference.</li>
          <li style="margin-bottom: 10px;"><span style="font-size: 16px; color:black;">🗑️ <strong>Card Delete Animation</strong> –</span> Watch your cards vanish with a stylish animation (because deleting should be satisfying too).</li>
        </ul>
      </div>
  ` : ''}

    <!-- Section 3: Coming Soon -->
    <div style="background: #fff; border-radius: 8px; padding: 10px 20px 20px 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); margin-bottom: 30px;">
      <h3 style="color: #7C41E3;">🚀 Coming Soon to GradFlow</h3>
      <ul style="padding-left: 20px; color: #444;">
      <li><strong>💡 Chrome Extension:</strong> Instantly save jobs from LinkedIn, Indeed, and more — directly into your GradFlow board.</li>
        <li><strong>📥 Excel Import:</strong> Got an existing spreadsheet? Upload it and watch your application board build itself.</li>
        <li><strong>🔗 Shareable Job Info:</strong> Easily share job details with friends, mentors, or career advisors.</li>
      </ul>
    </div>


  <!-- Section 4: Motivation of the Week -->
  <div style="background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); margin-bottom: 30px; text-align: center;">
    <h3 style="color: #7C41E3;">💡 Motivation of the Week</h3>
    <blockquote style="font-size: 16px; color: #555; margin: 20px auto; max-width: 600px; font-style: italic;">
         "${randomQuote.quote}"<br/>
      <span style="display: block; margin-top: 10px; font-weight: bold; color: #333;">– ${randomQuote.author}l</span>
    </blockquote>
  </div>


    <!-- Footer -->
<div style="text-align: center; margin-top: 30px;">

  <p style="color: #555;">You're receiving this email because you signed up on <a href="https://gradflow.org" style="color: #7C41E3; text-decoration: none;">GradFlow</a>.</p>
  <a href="https://gradflow.org" style="display: inline-block; margin: 10px 5px; padding: 10px 20px; background-color:#7C41E3; color: #fff; text-decoration: none; border-radius: 5px;">Update Your Boards</a>
  <a href="https://gradflow.org/main?tab=notifications" style="display: inline-block; margin: 10px 5px; padding: 10px 20px; background-color:#ccc; color: #000; text-decoration: none; border-radius: 5px;">Unsubscribe</a>
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

