const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const SALT_ROUNDS = 12;

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Role-based authorization middleware
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Permission-based authorization middleware
function requirePermission(resource, action) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const db = req.app.get('db');
      const permission = await new Promise((resolve, reject) => {
        db.get(
          'SELECT * FROM role_permissions WHERE role = ? AND resource = ? AND action = ?',
          [req.user.role, resource, action],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!permission) {
        return res.status(403).json({ error: 'Insufficient permissions for this action' });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Data filtering middleware for role-based access
function filterDataByRole(req, res, next) {
  req.dataFilters = {};

  switch (req.user?.role) {
    case 'Admin':
      // Admin sees everything - no filters
      break;
    
    case 'Manager':
      // Manager sees everything - no filters for now
      break;
    
    case 'Sales Rep':
      // Sales Rep only sees assigned companies/contacts
      req.dataFilters.assignedOnly = true;
      req.dataFilters.userId = req.user.user_id;
      break;
    
    case 'Developer':
      // Developer sees all feedbacks but limited other data
      if (req.originalUrl.includes('/feedbacks')) {
        // No filter for feedbacks
      } else {
        req.dataFilters.readOnly = true;
      }
      break;
  }

  next();
}

// Utility functions
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

function generateToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Login function
async function loginUser(db, username, password) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = 1',
      [username, username],
      async (err, user) => {
        if (err) {
          reject(err);
          return;
        }

        if (!user) {
          reject(new Error('User not found or inactive'));
          return;
        }

        try {
          const isValidPassword = await comparePassword(password, user.password_hash);
          if (!isValidPassword) {
            reject(new Error('Invalid password'));
            return;
          }

          // Update last login
          db.run(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
            [user.user_id]
          );

          // Generate token
          const token = generateToken(user);

          // Store session
          const tokenHash = await hashPassword(token);
          db.run(
            'INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES (?, ?, datetime("now", "+24 hours"))',
            [user.user_id, tokenHash]
          );

          resolve({
            token,
            user: {
              user_id: user.user_id,
              username: user.username,
              email: user.email,
              role: user.role,
              first_name: user.first_name,
              last_name: user.last_name
            }
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

// Create user function
async function createUser(db, userData) {
  const { username, email, password, role, first_name, last_name } = userData;
  
  return new Promise(async (resolve, reject) => {
    try {
      const password_hash = await hashPassword(password);
      
      db.run(
        'INSERT INTO users (username, email, password_hash, role, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, password_hash, role, first_name, last_name],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ user_id: this.lastID, username, email, role, first_name, last_name });
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  authenticateToken,
  requireRole,
  requirePermission,
  filterDataByRole,
  hashPassword,
  comparePassword,
  generateToken,
  loginUser,
  createUser,
  JWT_SECRET
};
