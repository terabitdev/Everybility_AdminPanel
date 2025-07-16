import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import TopBar from '../Components/TopBar';
import { useAuth } from '../hooks/useAuth';
import { updateUserData, getUserData, uploadProfileImage } from '../services/userService';
import { updateProfile, updateEmail, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';

const Settings = () => {
  const [activeNav, setActiveNav] = useState('Settings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [originalEmail, setOriginalEmail] = useState('');
  const [profileImage, setProfileImage] = useState('/assets/profile.png');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [pendingEmailUpdate, setPendingEmailUpdate] = useState(null);
  const { currentUser } = useAuth();

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          // Get user data from Firestore
          const userData = await getUserData(currentUser.uid);
          if (userData) {
            setFormData({
              name: userData.fullName || userData.displayName || '',
              email: userData.email || currentUser.email || ''
            });
            setOriginalEmail(currentUser.email || '');
            if (userData.profileImage) {
              setProfileImage(userData.profileImage);
            }
          } else {
            // Fallback to Firebase Auth user data
            setFormData({
              name: currentUser.displayName || '',
              email: currentUser.email || ''
            });
            setOriginalEmail(currentUser.email || '');
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          // Fallback to Firebase Auth user data
          setFormData({
            name: currentUser.displayName || '',
            email: currentUser.email || ''
          });
          setOriginalEmail(currentUser.email || '');
        }
      }
    };

    loadUserData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous messages
    setError('');
    setSuccess('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setProfileImageFile(file);
      setProfileImage(URL.createObjectURL(file));
      setError('');
      setSuccess('Image selected! It will be uploaded when you save changes.');
    }
  };

  const handleEmailUpdate = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(originalEmail, password);
      await reauthenticateWithCredential(currentUser, credential);

      // Send verification email to the new email address
      await sendEmailVerification(currentUser, {
        url: window.location.origin + '/settings',
        handleCodeInApp: false
      });

      setSuccess(`Verification email sent to ${pendingEmailUpdate}. Please check your email and click the verification link before the email will be updated.`);
      setPassword('');
      setShowPasswordModal(false);
      
      // Note: The email will be updated automatically when the user clicks the verification link
      // For now, we'll just update Firestore with the new email
      const updatedUserData = {
        fullName: formData.name,
        displayName: formData.name,
        email: pendingEmailUpdate,
        profileImage: profileImage,
        updatedAt: new Date()
      };

      await updateUserData(currentUser.uid, updatedUserData);
      
    } catch (error) {
      console.error('Error updating email:', error);
      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use by another account.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setError('Email verification is required. Please check your email and verify the new email address.');
      } else {
        setError('Error updating email. Please try again.');
      }
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError('No user logged in');
      return;
    }

    // Check if email has changed
    if (formData.email !== originalEmail) {
      setPendingEmailUpdate(formData.email);
      setShowPasswordModal(true);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: formData.name
      });

      let profileImageUrl = profileImage;
      // If a new image file is selected, upload it
      if (profileImageFile) {
        profileImageUrl = await uploadProfileImage(profileImageFile, currentUser.uid);
      }

      // Update user data in Firestore
      const updatedUserData = {
        fullName: formData.name,
        displayName: formData.name,
        email: formData.email,
        profileImage: profileImageUrl,
        updatedAt: new Date()
      };

      await updateUserData(currentUser.uid, updatedUserData);

      setSuccess('Settings saved successfully!');
      setProfileImageFile(null);
      console.log('Settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      if (error.code === 'auth/requires-recent-login') {
        setError('Please log out and log back in to update your profile.');
      } else {
        setError('Error saving settings. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex">
      {/* Sidebar */}
      <Sidebar 
        activeNav={activeNav} 
        setActiveNav={setActiveNav}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Header */}
        <TopBar />

        {/* Settings Content */}
        <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 ">
          <h1 className='text-3xl sm:text-4xl  font-nunitoSansBold font-bold mb-4 text-primaryBlack'>Settings</h1>
          
          {/* Settings Form */}
          <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-sm p-6 md:p-8 md:pb-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b830?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80';
                    }}
                  />
                </div>
                
                {/* Edit Icon Overlay */}
                <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">Click the camera icon to upload a new profile image</p>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Your Name Field */}
              <div>
                <label className="block text-[16px] text-[#232323] font-poppinsRegular mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-[#DFEAF2] font-poppinsRegular text-[#718EBF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[16px] text-[#232323] font-poppinsRegular mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-[#DFEAF2] font-poppinsRegular text-[#718EBF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.email !== originalEmail ? 
                    'Email change requires verification - you will receive a verification email' : 
                    'Note: Email changes require verification'
                  }
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-[#4880FF] disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Password Modal for Email Update */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Verify Your Password</h3>
            <p className="text-gray-600 mb-4">
              To update your email from <strong>{originalEmail}</strong> to <strong>{pendingEmailUpdate}</strong>, 
              please enter your current password. A verification email will be sent to the new address.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                  setPendingEmailUpdate(null);
                  setFormData(prev => ({ ...prev, email: originalEmail }));
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailUpdate}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Send Verification Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;