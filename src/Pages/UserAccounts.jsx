import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../Components/Sidebar';
import TopBar from '../Components/TopBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllUsers } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const UserAccounts = () => {
  const [activeNav, setActiveNav] = useState('User Accounts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Name');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const entriesPerPage = 10;
  const totalEntries = users.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const usersData = await getAllUsers();
        // Filter out the current admin from the users list
        const filteredUsers = usersData.filter(user => user.id !== currentUser.uid);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const sortOptions = [
    { value: 'Name', label: 'Name' },
    { value: 'Email', label: 'Email' },
    { value: 'Status', label: 'Status' },
    { value: 'Date', label: 'Date Created' }
  ];

  const handleSortChange = (value) => {
    console.log('Sorting changed to:', value);
    setSortBy(value);
    setIsDropdownOpen(false);
  };

  // Filter and sort users using useMemo for better performance
  const filteredUsers = useMemo(() => {
    console.log('Recomputing filtered users. Sort by:', sortBy);
    
    const filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      
      // Search by name
      const nameMatch = user.fullName?.toLowerCase().includes(searchLower);
      
      // Search by email
      const emailMatch = user.email?.toLowerCase().includes(searchLower);
      
      // Search by status
      const statusMatch = (user.status || 'inactive').toLowerCase().includes(searchLower);
      
      // Search by date (format: MM/DD/YYYY or DD/MM/YYYY)
      let dateMatch = false;
      if (searchTerm.trim()) {
        const userDate = user.createdAt?.toDate?.() || user.createdAt;
        if (userDate) {
          const dateString = userDate.toLocaleDateString();
          dateMatch = dateString.includes(searchTerm);
        }
      }
      
      return nameMatch || emailMatch || statusMatch || dateMatch;
    });
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Name':
          return (a.fullName || '').localeCompare(b.fullName || '');
        case 'Email':
          return (a.email || '').localeCompare(b.email || '');
        case 'Status':
          const statusA = a.status || 'inactive';
          const statusB = b.status || 'inactive';
          return statusA.localeCompare(statusB);
        case 'Date':
          const dateA = a.createdAt?.toDate?.() || a.createdAt || new Date(0);
          const dateB = b.createdAt?.toDate?.() || b.createdAt || new Date(0);
          return new Date(dateB) - new Date(dateA);
        default:
          return 0;
      }
    });
  }, [users, searchTerm, sortBy]);

  const activeUsersCount = filteredUsers.filter(user => user.status === 'active').length;

  // Close dropdown when clicking outside
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

  const dropdownRef = React.useRef();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] flex">
        <Sidebar 
          activeNav={activeNav} 
          setActiveNav={setActiveNav}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <div className="flex-1 flex flex-col md:ml-0">
          <TopBar />
          <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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

        {/* User Accounts Content */}
        <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
          <h1 className='text-3xl sm:text-4xl  font-nunitoSansBold font-bold mb-4 text-primaryBlack'>User Accounts</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
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
                    <th className="text-left py-3 px-4 font-medium text-[#B5B7C0]">Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#EEEEEE] hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-[#292D32]">{user.fullName || 'N/A'}</td>
                      <td className="py-4 px-4 text-sm text-[#292D32]">{user.email || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                          user.status === 'active' 
                            ? 'bg-[#16C09861] text-[#008767] border border-[#00B087]' 
                            : 'bg-[#FFC5C5] text-[#DF0404] border border-[#DF0404]'
                        }`}>
                          {user.status || 'inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#292D32]">
                        {user.createdAt?.toDate?.() 
                          ? user.createdAt.toDate().toLocaleDateString()
                          : user.createdAt instanceof Date 
                            ? user.createdAt.toLocaleDateString()
                            : 'N/A'
                        }
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
                      <h3 className="font-semibold text-gray-800 text-base">{user.fullName || 'N/A'}</h3>
                      <p className="text-sm text-gray-600 mt-1 break-all">{user.email || 'N/A'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created: {user.createdAt?.toDate?.() 
                          ? user.createdAt.toDate().toLocaleDateString()
                          : user.createdAt instanceof Date 
                            ? user.createdAt.toLocaleDateString()
                            : 'N/A'
                        }
                      </p>
                    </div>
                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status || 'inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No users found matching your search.' : 'No users found.'}
              </div>
            )}

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <div className="flex flex-col lg:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 space-y-4 lg:space-y-0">
                <div className="text-xs sm:text-sm text-[#B5B7C0] font-poppinsMedium text-center lg:text-left">
                  Showing data 1 to {Math.min(entriesPerPage, filteredUsers.length)} of {totalEntries} entries
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserAccounts;