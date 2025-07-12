import React from 'react';

const TopBar = ({ userName, userRole, userInitials, profileImageUrl }) => {
  return (
    <header className="bg-white shadow-sm px-8 py-3 flex justify-end items-center">    
      {/* User Profile */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-purple-500">
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt={`${userName} profile`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-semibold text-sm">{userInitials}</span>
          )}
        </div>
        <div>
          <p className="font-nunitoSansBold font-bold  text-[#404040]">{userName}</p>
          <p className="text-xs text-[#565656] font-nunitoSansSemiBold font-semibold">{userRole}</p>
        </div>
      </div>
    </header>
  );
};

export default TopBar;