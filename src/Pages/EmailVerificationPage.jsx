import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmailToken, markEmailAsVerified } from '../services/emailVerificationService';
import { updateUserData } from '../services/userService';
import { updateEmail } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          setStatus('error');
          setMessage('Invalid verification link. Missing token.');
          setLoading(false);
          return;
        }

        // Verify the token
        const verificationData = await verifyEmailToken(token);
        
        if (!currentUser) {
          setStatus('error');
          setMessage('Please log in to complete email verification.');
          setLoading(false);
          return;
        }

        // Update the user's email in Firebase Auth
        await updateEmail(currentUser, verificationData.newEmail);

        // Update user data in Firestore
        const updatedUserData = {
          email: verificationData.newEmail,
          updatedAt: new Date()
        };

        await updateUserData(currentUser.uid, updatedUserData);

        // Mark the verification as completed
        await markEmailAsVerified(token);

        setStatus('success');
        setMessage('Email updated successfully! Your email has been verified and updated.');
        setLoading(false);

        // Redirect to settings after 3 seconds
        setTimeout(() => {
          navigate('/settings');
        }, 3000);

      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        
        if (error.message.includes('expired')) {
          setMessage('Verification link has expired. Please request a new verification email.');
        } else if (error.message.includes('already verified')) {
          setMessage('Email already verified. Redirecting to settings...');
          setTimeout(() => navigate('/settings'), 2000);
        } else if (error.message.includes('Invalid')) {
          setMessage('Invalid verification link. Please check your email and try again.');
        } else {
          setMessage('Error verifying email. Please try again or contact support.');
        }
        
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, currentUser, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/assets/MainBg.png")' }}
    >
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <div className="text-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto mb-4"></div>
              <h1 className="font-nunitoSansBold font-bold text-xl sm:text-2xl text-primaryBlack mb-2">
                Verifying Email...
              </h1>
              <p className="text-primaryBlack text-base font-nunitoSansRegular">
                Please wait while we verify your email address.
              </p>
            </>
          ) : status === 'success' ? (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-nunitoSansBold font-bold text-xl sm:text-2xl text-primaryBlack mb-2">
                Email Verified!
              </h1>
              <p className="text-primaryBlack text-base font-nunitoSansRegular mb-4">
                {message}
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to settings...
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="font-nunitoSansBold font-bold text-xl sm:text-2xl text-primaryBlack mb-2">
                Verification Failed
              </h1>
              <p className="text-primaryBlack text-base font-nunitoSansRegular mb-4">
                {message}
              </p>
              <button
                onClick={() => navigate('/settings')}
                className="bg-primaryBlue text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Go to Settings
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage; 