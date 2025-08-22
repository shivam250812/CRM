const express = require('express');
const router = express.Router();
const { 
  authenticateToken, 
  requireRole, 
  requirePermission,
  loginUser, 
  createUser,
  hashPassword 
} = require('./auth-middleware');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = req.app.get('db');
    const result = await loginUser(db, username, password);

    res.json({
      message: 'Login successful',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.message === 'User not found or inactive' || error.message === 'Invalid password') {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Logout route
router.post('/logout', authenticateToken, (req, res) => {
  try {
    const db = req.app.get('db');
    
    // Invalidate all sessions for this user
    db.run(
      'UPDATE user_sessions SET is_active = 0 WHERE user_id = ?',
      [req.user.user_id],
      (err) => {
        if (err) {
          console.error('Logout error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Logout successful' });
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    const db = req.app.get('db');

    db.run(
      'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?',
      [first_name, last_name, email, req.user.user_id],
      function(err) {
        if (err) {
          console.error('Profile update error:', err);
          return res.status(500).json({ error: 'Failed to update profile' });
        }
        res.json({ message: 'Profile updated successfully' });
      }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const db = req.app.get('db');

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Get current user
    db.get(
      'SELECT password_hash FROM users WHERE user_id = ?',
      [req.user.user_id],
      async (err, user) => {
        if (err) {
          console.error('Password change error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        try {
          const { comparePassword } = require('./auth-middleware');
          const isValid = await comparePassword(current_password, user.password_hash);
          
          if (!isValid) {
            return res.status(400).json({ error: 'Current password is incorrect' });
          }

          const new_password_hash = await hashPassword(new_password);
          
          db.run(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [new_password_hash, req.user.user_id],
            (err) => {
              if (err) {
                console.error('Password update error:', err);
                return res.status(500).json({ error: 'Failed to update password' });
              }
              res.json({ message: 'Password updated successfully' });
            }
          );
        } catch (error) {
          console.error('Password validation error:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      }
    );
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin routes for user management
router.get('/users', authenticateToken, requireRole(['Admin']), (req, res) => {
  const db = req.app.get('db');
  
  db.all(
    'SELECT user_id, username, email, role, first_name, last_name, is_active, created_at, last_login FROM users ORDER BY created_at DESC',
    [],
    (err, users) => {
      if (err) {
        console.error('Users fetch error:', err);
        return res.status(500).json({ error: 'Failed to fetch users' });
      }
      res.json({ data: users });
    }
  );
});

// Create new user (Admin only)
router.post('/users', authenticateToken, requireRole(['Admin']), async (req, res) => {
  try {
    const { username, email, password, role, first_name, last_name } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Username, email, password, and role are required' });
    }

    const db = req.app.get('db');
    const user = await createUser(db, { username, email, password, role, first_name, last_name });

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('User creation error:', error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update user (Admin only)
router.put('/users/:id', authenticateToken, requireRole(['Admin']), async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, role, first_name, last_name, is_active } = req.body;
    const db = req.app.get('db');

    db.run(
      'UPDATE users SET username = ?, email = ?, role = ?, first_name = ?, last_name = ?, is_active = ? WHERE user_id = ?',
      [username, email, role, first_name, last_name, is_active, userId],
      function(err) {
        if (err) {
          console.error('User update error:', err);
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Failed to update user' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
      }
    );
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', authenticateToken, requireRole(['Admin']), (req, res) => {
  const userId = req.params.id;
  const db = req.app.get('db');

  // Prevent admin from deleting themselves
  if (parseInt(userId) === req.user.user_id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  db.run(
    'DELETE FROM users WHERE user_id = ?',
    [userId],
    function(err) {
      if (err) {
        console.error('User deletion error:', err);
        return res.status(500).json({ error: 'Failed to delete user' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    }
  );
});

// Get role permissions
router.get('/permissions/:role', authenticateToken, requireRole(['Admin', 'Manager']), (req, res) => {
  const role = req.params.role;
  const db = req.app.get('db');

  db.all(
    'SELECT resource, action FROM role_permissions WHERE role = ? ORDER BY resource, action',
    [role],
    (err, permissions) => {
      if (err) {
        console.error('Permissions fetch error:', err);
        return res.status(500).json({ error: 'Failed to fetch permissions' });
      }
      res.json({ data: permissions });
    }
  );
});

module.exports = router;
