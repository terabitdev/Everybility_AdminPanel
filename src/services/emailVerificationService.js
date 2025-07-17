import { sendVerificationEmail } from './emailService';

// Send verification email to new email address
export const sendEmailVerificationToNewEmail = async (newEmail, userId) => {
  try {
    // Create a unique verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // For development, store in localStorage to avoid Firestore permissions issues
    const verificationData = {
      userId: userId,
      newEmail: newEmail,
      token: verificationToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      verified: false
    };
    
    localStorage.setItem(`emailVerification_${verificationToken}`, JSON.stringify(verificationData));

    // Send verification email using the email service
    await sendVerificationEmail(newEmail, verificationToken);
    
    return { success: true, token: verificationToken };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Verify the email verification token
export const verifyEmailToken = async (token) => {
  try {
    // Get verification data from localStorage
    const storedData = localStorage.getItem(`emailVerification_${token}`);
    
    if (!storedData) {
      throw new Error('Invalid verification token');
    }

    const verificationData = JSON.parse(storedData);
    
    // Check if token is expired
    if (new Date() > new Date(verificationData.expiresAt)) {
      throw new Error('Verification token has expired');
    }

    // Check if already verified
    if (verificationData.verified) {
      throw new Error('Email already verified');
    }

    return verificationData;
  } catch (error) {
    console.error('Error verifying email token:', error);
    throw error;
  }
};

// Mark email as verified
export const markEmailAsVerified = async (token) => {
  try {
    // Get verification data from localStorage
    const storedData = localStorage.getItem(`emailVerification_${token}`);
    
    if (!storedData) {
      throw new Error('Invalid verification token');
    }

    const verificationData = JSON.parse(storedData);
    
    // Update verification status
    verificationData.verified = true;
    verificationData.verifiedAt = new Date().toISOString();
    
    localStorage.setItem(`emailVerification_${token}`, JSON.stringify(verificationData));
    
    return { success: true };
  } catch (error) {
    console.error('Error marking email as verified:', error);
    throw error;
  }
}; 