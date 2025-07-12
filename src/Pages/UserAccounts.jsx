import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../Components/Sidebar';
import TopBar from '../Components/TopBar';
import { ChevronLeft , ChevronRight } from 'lucide-react';
const UserAccounts = () => {
  const [activeNav, setActiveNav] = useState('User Accounts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sort options array
  const sortOptions = [
    { value: 'Newest', label: 'Newest' },
    { value: 'Oldest', label: 'Oldest' },
    { value: 'Name', label: 'Name' },
    { value: 'Email', label: 'Email' }
  ];

  // Sample user data
  const userData = [
    { id: 1, name: 'Jane Cooper', email: 'jane@microsoft.com', status: 'Active' },
    { id: 2, name: 'Floyd Miles', email: 'floyd@yahoo.com', status: 'Inactive' },
    { id: 3, name: 'Ronald Richards', email: 'ronald@adobe.com', status: 'Inactive' },
    { id: 4, name: 'Marvin McKinney', email: 'marvin@tesla.com', status: 'Active' },
    { id: 5, name: 'Jerome Bell', email: 'jerome@google.com', status: 'Active' },
    { id: 6, name: 'Kathryn Murphy', email: 'kathryn@microsoft.com', status: 'Active' },
    { id: 7, name: 'Jacob Jones', email: 'jacob@yahoo.com', status: 'Active' },
    { id: 8, name: 'Kristin Watson', email: 'kristin@facebook.com', status: 'Inactive' }
  ];

  const totalEntries = 1256;
  const entriesPerPage = 8;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const filteredUsers = userData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsersCount = userData.filter(user => user.status === 'Active').length;

  const handleSortChange = (value) => {
    setSortBy(value);
    setIsDropdownOpen(false);
  };

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        <TopBar 
          userName="Moni Roy"
          userRole="Admin"
          userInitials="MR"
          profileImageUrl="/assets/profile.png"
        />

        {/* User Accounts Content */}
        <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
          <h1 className='text-3xl sm:text-4xl  font-nunitoSansBold font-bold mb-4 text-primaryBlack'>User Accounts</h1>
          
          {/* User Management Section */}
          <div className="bg-white rounded-[2rem] shadow-sm p-4 md:p-6 ">
            {/* Header with All Users and Controls */}
            <div className="flex flex-col sm:flex-row  sm:justify-between sm:items-center mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col mb-4 sm:ml-4">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">All Users</h2>
                  <span className="text-sm font-normal text-[#16C098] font-poppinsRegular">
                    Active Members: {activeUsersCount}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 sm:py-2  bg-[#F9FBFF] placeholder:text-[#B5B7C0] placeholder:font-poppinsRegular  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <svg className="w-5 h-5 text-[#7E7E7E] absolute left-3 top-3.5 sm:top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Custom Sort Dropdown */}
                <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-[#F9FBFF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm flex items-center justify-between"
                  >
                    <span className='text-[#7E7E7E] font-poppinsRegular'>
                      Sort by: <span className='text-[#3D3C42] font-poppinsSemiBold'>{sortBy}</span>
                    </span>
                    <svg 
                      className={`w-4 h-4 ml-2 text-[#3D3C42] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                            sortBy === option.value 
                              ? 'bg-blue-50 text-blue-600 font-poppinsSemiBold' 
                              : 'text-[#7E7E7E] font-poppinsSemiBold'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto font-poppinsMedium ">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EEEEEE]">
                    <th className="text-left py-3 px-4 font-medium text-[#B5B7C0]">User Name</th>
                    <th className="text-left py-3 px-4 font-medium text-[#B5B7C0]">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-[#B5B7C0]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#EEEEEE] hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-[#292D32]">{user.name}</td>
                      <td className="py-4 px-4 text-sm text-[#292D32]">{user.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                          user.status === 'Active' 
                            ? 'bg-[#16C09861] text-[#008767] border border-[#00B087]' 
                            : 'bg-[#FFC5C5] text-[#DF0404] border border-[#DF0404]'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-base">{user.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 break-all">{user.email}</p>
                    </div>
                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col lg:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 space-y-4 lg:space-y-0">
              <div className="text-xs sm:text-sm text-[#B5B7C0] font-poppinsMedium text-center lg:text-left">
                Showing data 1 to {entriesPerPage} of {totalEntries} entries
              </div>
              
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-2 py-1 sm:py-2 text-xs sm:text-sm  bg-[#F5F5F5] border border-[#EEEEEE] rounded-lg touch-manipulation"
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>
                
                {/* Show fewer page numbers on mobile */}
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded touch-manipulation ${
                      currentPage === page
                        ? 'bg-[#4880FF] text-white'
                        : 'bg-[#F5F5F5] border text-[#404B52] border-[#EEEEEE] rounded-lg'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <span className="px-1 sm:px-2 text-gray-400 text-xs sm:text-sm">...</span>
                
                <button
                  onClick={() => setCurrentPage(17)}
                  className="px-2 sm:px-2 py-1 sm:py-2 text-xs sm:text-sm text-[#404B52]  bg-[#F5F5F5] border border-[#EEEEEE] rounded-lg touch-manipulation"
                >
                  17
                </button>
                
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-2 py-1 sm:py-2 text-xs sm:text-sm  bg-[#F5F5F5] border border-[#EEEEEE] rounded-lg touch-manipulation"
                >
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserAccounts;