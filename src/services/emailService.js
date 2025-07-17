// Email service for sending verification emails
// This can be integrated with SendGrid, Mailgun, Firebase Functions, etc.

export const sendVerificationEmail = async (toEmail, verificationToken) => {
  try {
    // For development/testing, we'll log the email details
    // In production, you would integrate with an email service
    const verificationLink = `${window.location.origin}/verify-email?token=${verificationToken}`;
    
    console.log('=== EMAIL VERIFICATION ===');
    console.log('To:', toEmail);
    console.log('Subject: Verify Your Email Address');
    console.log('Verification Link:', verificationLink);
    console.log('========================');
    
    // Example integration with external email service:
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     to: toEmail,
    //     subject: 'Verify Your Email Address',
    //     html: `
    //       <h2>Email Verification</h2>
    //       <p>Please click the link below to verify your email address:</p>
    //       <a href="${verificationLink}">Verify Email</a>
    //       <p>This link will expire in 24 hours.</p>
    //     `
    //   })
    // });
    
    // For now, return success
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email template for verification
export const getVerificationEmailTemplate = (verificationLink) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Email Verification</h2>
      <p>Please click the button below to verify your email address:</p>
      <a href="${verificationLink}" 
         style="display: inline-block; background-color: #4880FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Verify Email Address
      </a>
      <p style="color: #666; font-size: 14px;">
        This link will expire in 24 hours. If you didn't request this verification, please ignore this email.
      </p>
    </div>
  `;
}; 