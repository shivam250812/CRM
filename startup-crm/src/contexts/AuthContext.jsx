import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || 'https://enterprise-crm-backend.onrender.com/api')
  : 'http://localhost:3001/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedToken && storedUser) {
        try {
          // Verify token is still valid
          const response = await fetch('http://localhost:3001/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          
          if (response.ok) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('http://localhost:3001/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const hasPermission = (resource, action) => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'Admin') return true;
    
    // Define permissions by role
    const permissions = {
      'Manager': {
        'companies': ['read', 'update', 'export'],
        'contacts': ['read', 'update', 'export'],
        'feedbacks': ['read', 'update'],
        'projects': ['create', 'read', 'update', 'delete'],
        'tasks': ['create', 'read', 'update', 'delete'],
        'team_members': ['read', 'update'],
        'analytics': ['read']
      },
      'Sales Rep': {
        'companies': ['read', 'update'],
        'contacts': ['create', 'read', 'update'],
        'feedbacks': ['read'],
        'projects': ['read'],
        'tasks': ['read', 'update'],
        'analytics': ['read']
      },
      'Developer': {
        'companies': ['read'],
        'contacts': ['read'],
        'feedbacks': ['create', 'read', 'update'],
        'tasks': ['read', 'update'],
        'analytics': ['read']
      }
    };

    const rolePermissions = permissions[user.role];
    if (!rolePermissions || !rolePermissions[resource]) return false;
    
    return rolePermissions[resource].includes(action);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    hasRole,
    hasPermission,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
