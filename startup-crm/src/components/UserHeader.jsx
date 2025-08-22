import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, ChevronDown, Settings, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const UserHeader = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin': return '🔑';
      case 'Manager': return '📊';
      case 'Sales Rep': return '💼';
      case 'Developer': return '🎧';
      default: return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'Manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Sales Rep': return 'bg-green-100 text-green-800 border-green-200';
      case 'Developer': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user.first_name || user.username}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                {getRoleIcon(user.role)} {user.role}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user.username
                    }
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border mt-1 ${getRoleColor(user.role)}`}>
                    <span>{getRoleIcon(user.role)}</span>
                    <span>{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Permissions */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Access Level: {user.role}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  toast.info('Profile settings coming soon!');
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserHeader;
