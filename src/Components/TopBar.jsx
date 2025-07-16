import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserData } from '../services/userService';

const TopBar = () => {
  const { currentUser } = useAuth();
  const [userProfileImage, setUserProfileImage] = useState(null);

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    if (currentUser?.fullName) {
      return currentUser.fullName;
    }
    if (currentUser?.email) {
      // Extract name from email (before @ symbol)
      const emailName = currentUser.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'User';
  };

  // Load user profile image from Firestore
  useEffect(() => {
    const loadUserProfileImage = async () => {
      if (currentUser) {
        try {
          const userData = await getUserData(currentUser.uid);
          if (userData?.profileImage) {
            setUserProfileImage(userData.profileImage);
          }
        } catch (error) {
          console.error('Error loading user profile image:', error);
        }
      }
    };

    loadUserProfileImage();
  }, [currentUser]);

  const userName = getUserDisplayName();
  const userInitials = getUserInitials(currentUser?.displayName || currentUser?.fullName);

  return (
    <header className="bg-white shadow-sm px-8 py-3 flex justify-end items-center">    
      {/* User Profile */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-purple-500">
          {userProfileImage ? (
            <img 
              src={userProfileImage} 
              alt={`${userName} profile`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <span className="text-white font-semibold text-sm" style={{ display: userProfileImage ? 'none' : 'flex' }}>
            {userInitials}
          </span>
        </div>
        <div>
          <p className="font-nunitoSansBold font-bold text-[#404040]">{userName}</p>
          <p className="text-xs text-[#565656] font-nunitoSansSemiBold font-semibold">Admin</p>
        </div>
      </div>
    </header>
  );
};

export default TopBar;