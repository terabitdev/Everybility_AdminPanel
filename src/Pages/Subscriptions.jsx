import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import TopBar from '../Components/TopBar';

const Subscriptions = () => {
  const [activeNav, setActiveNav] = useState('Subscriptions');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Sample subscription data
  const subscriptionData = [
    { id: '00001', name: 'Christine Brooks', email: 'jessica@microsoft.com', date: '04 Sep 2019', status: 'Subscribed', plan: 'Family' },
    { id: '00002', name: 'Rosie Pearson', email: 'floyd@yahoo.com', date: '28 May 2019', status: 'Processing', plan: 'Clinic' },
    { id: '00003', name: 'Darrell Caldwell', email: 'ronald@adobe.com', date: '23 Nov 2019', status: 'Cancelled', plan: 'School' },
    { id: '00004', name: 'Gilbert Johnston', email: 'marvin@tesla.com', date: '05 Feb 2019', status: 'Subscribed', plan: 'Clinic' },
    { id: '00005', name: 'Alan Cain', email: 'jerome@google.com', date: '25 Jul 2019', status: 'Processing', plan: 'School' },
    { id: '00006', name: 'Alfred Murray', email: 'kathryn@microsoft.com', date: '15 Aug 2019', status: 'Subscribed', plan: 'Family' },
    { id: '00007', name: 'Maggie Sullivan', email: 'jacob@yahoo.com', date: '31 Dec 2019', status: 'Processing', plan: 'Custom' }
  ];

  const totalEntries = 1256;
  const entriesPerPage = 7;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const filteredSubscriptions = subscriptionData.filter(subscription =>
    subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subscribedCount = subscriptionData.filter(sub => sub.status === 'Subscribed').length;
  const processingCount = subscriptionData.filter(sub => sub.status === 'Processing').length;
  const cancelledCount = subscriptionData.filter(sub => sub.status === 'Cancelled').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Subscribed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <TopBar 
          userName="Moni Roy"
          userRole="Admin"
          userInitials="MR"
          profileImageUrl="/assets/profile.png"
        />

        {/* Subscriptions Content */}
        <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-gray-800'>Subscriptions</h1>
          
          {/* Subscription Management Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            {/* Stats and Controls */}
            <div className="flex flex-col space-y-4 mb-6">
            
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 sm:top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="Newest">Sort by: Newest</option>
                  <option value="Oldest">Sort by: Oldest</option>
                  <option value="Name">Sort by: Name</option>
                  <option value="Status">Sort by: Status</option>
                  <option value="Plan">Sort by: Plan</option>
                </select>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-800">{subscription.name}</td>
                      <td className="py-4 px-4 text-gray-600">{subscription.email}</td>
                      <td className="py-4 px-4 text-gray-600">{subscription.date}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                          {subscription.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{subscription.plan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tablet View (md-lg) */}
            <div className="hidden md:block lg:hidden overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-gray-800 font-medium">{subscription.name}</div>
                          <div className="text-sm text-gray-500">{subscription.email}</div>
                          <div className="text-xs text-gray-400">{subscription.date}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                          {subscription.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{subscription.plan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredSubscriptions.map((subscription) => (
                <div key={subscription.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-base">{subscription.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 break-all">{subscription.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{subscription.date}</p>
                    </div>
                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-500">Plan:</span>
                    <span className="text-sm font-medium text-gray-800">{subscription.plan}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col lg:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 space-y-4 lg:space-y-0">
              <div className="text-xs sm:text-sm text-gray-600 text-center lg:text-left">
                Showing data 1 to {entriesPerPage} of {totalEntries} entries
              </div>
              
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 touch-manipulation"
                >
                  ←
                </button>
                
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded touch-manipulation ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <span className="px-1 sm:px-2 text-gray-400 text-xs sm:text-sm">...</span>
                
                <button
                  onClick={() => setCurrentPage(17)}
                  className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800 touch-manipulation"
                >
                  17
                </button>
                
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 touch-manipulation"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Subscriptions;