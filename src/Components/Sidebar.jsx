import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ activeNav, setActiveNav, isOpen, setIsOpen }) => {
  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'User Accounts', icon: Users, active: false },
    { name: 'Subscriptions', icon: CreditCard, active: false },
  ];

  const bottomNavItems = [
    { name: 'Settings', icon: Settings },
    { name: 'Logout', icon: LogOut }
  ];

  const handleNavClick = (navName) => {
    setActiveNav(navName);
    // Close drawer on mobile when navigation item is clicked
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden absolute z-50 p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 ${
          isOpen 
            ? 'top-4 left-52 transform -translate-x-2' 
            : 'top-2 left-6'
        }`}
      >
        {isOpen ? (
          <X size={20} className="text-gray-700" />
        ) : (
          <Menu size={20} className="text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40
        w-64 bg-white shadow-sm flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeNav === item.name
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-200">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar; 