import React from 'react';

const TopBar = ({  userName, userRole, userInitials }) => {
  return (
    <header className="bg-white shadow-sm px-8 py-3 flex justify-end items-center">    
      {/* User Profile */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{userInitials}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{userName}</p>
          <p className="text-sm text-gray-500">{userRole}</p>
        </div>
      </div>
    </header>
  );
};

export default TopBar; 