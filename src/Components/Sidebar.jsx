import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/',
      active: true 
    },
    { 
      name: 'User Accounts', 
      icon: Users, 
      path: '/users',
      active: false 
    },
    { 
      name: 'Subscriptions', 
      icon: CreditCard, 
      path: '/subscriptions',
      active: false 
    },
  ];

  const bottomNavItems = [
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/settings' 
    },
    { 
      name: 'Logout', 
      icon: LogOut, 
      path: '/login' 
    }
  ];

  const handleNavClick = (navName, path) => {
    // Handle logout separately
    if (navName === 'Logout') {
      handleLogout();
      return;
    }

    // Set active navigation
    setActiveNav(navName);
    
    // Navigate to the specified path
    navigate(path);
    
    // Close drawer on mobile when navigation item is clicked
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    // Clear any stored authentication tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    
    // Reset active navigation
    setActiveNav('Dashboard');
    
    // Navigate to login page
    navigate('/login');
    
    // Close mobile menu
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
    
    // Optional: Show logout confirmation
    console.log('User logged out successfully');
  };

  // Function to check if current path matches menu item
  const isCurrentPath = (path) => {
    return location.pathname === path;
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
        
        {/* Navigation Items */}
        <nav className="flex-1 px-4 pt-[4.5rem]">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isCurrentPath(item.path) || activeNav === item.name;
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name, item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-primaryBlue text-white'
                    : 'text-primaryBlack hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-nunitoSansSemiBold text-lg font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-200">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isCurrentPath(item.path) || activeNav === item.name;
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name, item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-primaryBlue text-white'
                    : 'text-primaryBlack hover:bg-gray-100'
                } ${item.name === 'Logout' ? 'hover:bg-red-50 hover:text-red-600' : ''}`}
              >
                <Icon size={20} />
                <span className="font-nunitoSansSemiBold text-lg font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;