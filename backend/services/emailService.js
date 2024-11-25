// Handles Email Logic
import mjml from 'mjml';
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
  // Define the MJML template with placeholders for the dynamic values
  const mjmlTemplate = `
    <mjml>
      <mj-body background-color="#f4f4f4">
        
        <!-- Header Section -->
        <mj-section background-color="#ffffff" padding="20px" border-radius="10px" text-align="center">
          <mj-column>
            <mj-text font-size="20px" color="#333333" font-family="Helvetica" font-weight="bold">
              GradFlow Account: Password Reset Request
            </mj-text>
            <mj-divider border-color="#F45E43" border-width="2px"></mj-divider>
          </mj-column>
        </mj-section>
        
        <!-- Body Section -->
        <mj-section background-color="#ffffff" padding="20px" border-radius="10px">
          <mj-column>
            
            <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
              Your password reset token will expire in <strong>15 minutes</strong>.
            </mj-text>
            
            <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
              You can reset your password by clicking the following link:
            </mj-text>

            <!-- Reset Password Button -->
            <mj-button background-color="#F45E43" color="white" font-size="16px" font-family="Helvetica" href="${frontendUrl}/reset-password/${token}" padding="15px 0">
              Reset Password
            </mj-button>

            <mj-text font-size="14px" color="#666666" font-family="Helvetica" line-height="1.5">
              Or paste this link into your browser:
              <br>
              <a href="${frontendUrl}/reset-password/${token}" style="color: #F45E43;">${frontendUrl}/reset-password/${token}</a>
            </mj-text>
            
            <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
              Have a great day!
            </mj-text>
            
            <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
              Team Gradflow
            </mj-text>
            
          </mj-column>
        </mj-section>
        
        <!-- Footer Section -->
        <mj-section padding="20px 0 0">
          <mj-column>
            <mj-text font-size="12px" color="#999999" font-family="Helvetica" align="center">
              If you didn’t request a password reset, please ignore this email or <a href="https://support.yourwebsite.com" style="color: #F45E43;">contact support</a>.
            </mj-text>
          </mj-column>
        </mj-section>

      </mj-body>
    </mjml>
  `;

  
  const { html, errors } = mjml(mjmlTemplate);

  // Check for errors in the MJML compilation
  if (errors.length) {
    console.error('MJML rendering errors:', errors);
  }

  
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Password Reset Verification Code',
    html: html, 
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
      const { UserId, Email } = user;
      try {
        await sendApplicationStatusEmail(Email, UserId);
      }
       catch (emailError) {
        console.error(`Error sending email to ${Email}:`, emailError);
      }
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

    
    const pastDueHtml = pastDue.length > 0 
      ? pastDue.map(app => `<li>${app.JobName} at ${app.CompanyName} (Deadline: ${app.Deadline})</li>`).join('') 
      : '<li>No past due applications</li>';
    const dueIn1WeekHtml = dueIn1Week.length > 0 
      ? dueIn1Week.map(app => `<li>${app.JobName} at ${app.CompanyName} (Deadline: ${app.Deadline})</li>`).join('') 
      : '<li>No applications due in 1 week</li>';
    const dueIn2WeeksHtml = dueIn2Weeks.length > 0 
      ? dueIn2Weeks.map(app => `<li>${app.JobName} at ${app.CompanyName} (Deadline: ${app.Deadline})</li>`).join('') 
      : '<li>No applications due in 2 weeks</li>';

    
    const mjmlTemplate = `
      <mjml>
        <mj-body background-color="#f4f4f4">
          
          <!-- Header Section -->
          <mj-section background-color="#ffffff" padding="20px" border-radius="10px" text-align="center">
            <mj-column>
              <mj-text font-size="20px" color="#333333" font-family="Helvetica" font-weight="bold">
                Your Job Application Statuses
              </mj-text>
              <mj-divider border-color="#F45E43" border-width="2px"></mj-divider>
            </mj-column>
          </mj-section>
          
          <!-- Body Section -->
          <mj-section background-color="#ffffff" padding="20px" border-radius="10px">
            <mj-column>
              
              <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
                Hi there! Here is the status of your job applications:
              </mj-text>
              
              <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
                <h3>Past Due Applications:</h3>
                <ul>${pastDueHtml}</ul>
              </mj-text>
              
              <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
                <h3>Applications Due in 1 Week:</h3>
                <ul>${dueIn1WeekHtml}</ul>
              </mj-text>

              <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
                <h3>Applications Due in 2 Weeks:</h3>
                <ul>${dueIn2WeeksHtml}</ul>
              </mj-text>
              
            </mj-column>
          </mj-section>
          
          <!-- Footer Section -->
          <mj-section padding="20px 0 0">
            <mj-column>
              <mj-text font-size="12px" color="#999999" font-family="Helvetica" align="center">
                This is an automated email from GradFlow. If you have any questions, please <a href="https://support.gradflow.com" style="color:#F45E43;">contact support</a>.
              </mj-text>
            </mj-column>
          </mj-section>

        </mj-body>
      </mjml>
    `;

    
    const { html, errors } = mjml(mjmlTemplate);

   
    if (errors.length) {
      console.error('MJML rendering errors:', errors);
    }
    
    // Email options
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Your Job Application Statuses',
      html: html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Application status email sent successfully.');
  } catch (error) {
    console.error('Error sending application status email:', error);
    throw new Error('Email sending failed');
  }
};





export const sendSignupEmail = async (email, token, frontendUrl) => {

  const mjmlTemplate = `
    <mjml>
      <mj-body background-color="#f4f4f4">
        
        <!-- Header Section -->
        <mj-section background-color="#ffffff" padding="20px" border-radius="10px" text-align="center">
          <mj-column>
            <mj-text font-size="20px" color="#333333" font-family="Helvetica" font-weight="bold">
              Welcome to GradFlow!
            </mj-text>
            <mj-divider border-color="#F45E43" border-width="2px"></mj-divider>
          </mj-column>
        </mj-section>
        
        <!-- Body Section -->
        <mj-section background-color="#ffffff" padding="20px" border-radius="10px">
          <mj-column>
            
            <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
              Hi there! We’re excited to have you join GradFlow.
            </mj-text>
            
            <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
              Please confirm your email address to activate your account.
            </mj-text>

            <!-- Activate Account Button -->
            <mj-button background-color="#F45E43" color="white" font-size="16px" font-family="Helvetica" href="${frontendUrl}/verify-email?token=${token}" padding="15px 0">
              Activate Account
            </mj-button>
            
            <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5" padding-top="20px">
              We’re here to help if you have any questions. Just reach out to our support team anytime!
            </mj-text>
            
            <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
              Best Regards,
              <br>
              The GradFlow Team
            </mj-text>
            
          </mj-column>
        </mj-section>
        
        <!-- Footer Section -->
        <mj-section padding="20px 0 0">
          <mj-column>
            <mj-text font-size="12px" color="#999999" font-family="Helvetica" align="center">
              If you did not sign up for a GradFlow account, please ignore this email or <a href="https://support.gradflow.com" style="color:#F45E43;">contact support</a>.
            </mj-text>
          </mj-column>
        </mj-section>

      </mj-body>
    </mjml>
  `;

  // Compile MJML to HTML
  const { html, errors } = mjml(mjmlTemplate);

  // Check for errors in the MJML compilation
  if (errors.length) {
    console.error('MJML rendering errors:', errors);
  }
  
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Welcome to GradFlow! Confirm Your Email',
    html: html, 
  };


  try {
    await transporter.sendMail(mailOptions);
    console.log('Signup email sent to:', email);
  }catch (error) {
    console.error('Error sending signup email:', error);
  }
}



export const sendWelcomeEmail = async (email) => {
  const mjmlTemplate = `
    <mjml>
      <mj-body background-color="#f4f4f4">
        
        <!-- Header Section -->
        <mj-section background-color="#ffffff" padding="20px" border-radius="10px" text-align="center">
          <mj-column>
            <mj-text font-size="20px" color="#333333" font-family="Helvetica" font-weight="bold">
              Welcome to GradFlow!
            </mj-text>
            <mj-divider border-color="#F45E43" border-width="2px"></mj-divider>
          </mj-column>
        </mj-section>
        
        <!-- Body Section -->
        <mj-section background-color="#ffffff" padding="20px" border-radius="10px">
          <mj-column>
            
            <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
              Hi there! We’re thrilled to have you on board. GradFlow is designed to help you stay on top of your job applications and make the journey smoother.
            </mj-text>
            
            <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
              We hope you find it useful and easy to navigate. Feel free to explore the features we have in store for you!
            </mj-text>

            <!-- Get Started Button -->
            <mj-button background-color="#F45E43" color="white" font-size="16px" font-family="Helvetica" href="https://gradflow.com/dashboard" padding="15px 0">
              Get Started
            </mj-button>
            
            <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5" padding-top="20px">
              Need any help? Reach out to our support team anytime!
            </mj-text>
            
            <mj-text font-size="16px" color="#333333" font-family="Helvetica" line-height="1.5">
              Best Regards,
              <br>
              The GradFlow Team
            </mj-text>
            
          </mj-column>
        </mj-section>
        
        <!-- Footer Section -->
        <mj-section padding="20px 0 0">
          <mj-column>
            <mj-text font-size="12px" color="#999999" font-family="Helvetica" align="center">
              If you did not sign up for a GradFlow account, please ignore this email or <a href="https://support.gradflow.com" style="color:#F45E43;">contact support</a>.
            </mj-text>
          </mj-column>
        </mj-section>

      </mj-body>
    </mjml>
  `;

  // Compile MJML to HTML
  const { html, errors } = mjml(mjmlTemplate);

  // Check for errors in the MJML compilation
  if (errors.length) {
    console.error('MJML rendering errors:', errors);
  }
  
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Welcome to GradFlow!',
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Email sending failed');
  }
};
