import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from './LoginPage';

const ProtectedRoute = ({ children, roles = null, permission = null }) => {
  const { isAuthenticated, hasRole, hasPermission, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Check role-based access
  if (roles && !hasRole(roles)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md">
            <div className="text-red-600 dark:text-red-400 text-6xl mb-4">🚫</div>
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
              Access Denied
            </h2>
            <p className="text-red-600 dark:text-red-300">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              Required role: {Array.isArray(roles) ? roles.join(' or ') : roles}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (permission && !hasPermission(permission.resource, permission.action)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md">
            <div className="text-red-600 dark:text-red-400 text-6xl mb-4">🚫</div>
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
              Access Denied
            </h2>
            <p className="text-red-600 dark:text-red-300">
              You don't have permission to perform this action.
            </p>
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              Required permission: {permission.action} on {permission.resource}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
