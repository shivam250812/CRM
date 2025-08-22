const sqlite3 = require('sqlite3').verbose();

// Authentication database schema
function createAuthTables(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table for authentication
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          user_id INTEGER PRIMARY KEY AUTOINCREMENT,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'Sales Rep',
          first_name VARCHAR(50),
          last_name VARCHAR(50),
          is_active BOOLEAN DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP,
          CONSTRAINT check_role CHECK (role IN ('Admin', 'Manager', 'Sales Rep', 'Developer'))
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
          return;
        }
      });

      // User sessions table for token management
      db.run(`
        CREATE TABLE IF NOT EXISTS user_sessions (
          session_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          token_hash VARCHAR(255) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT 1,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creating user_sessions table:', err);
          reject(err);
          return;
        }
      });

      // Role permissions table
      db.run(`
        CREATE TABLE IF NOT EXISTS role_permissions (
          permission_id INTEGER PRIMARY KEY AUTOINCREMENT,
          role VARCHAR(20) NOT NULL,
          resource VARCHAR(50) NOT NULL,
          action VARCHAR(20) NOT NULL,
          UNIQUE(role, resource, action),
          CONSTRAINT check_role_perms CHECK (role IN ('Admin', 'Manager', 'Sales Rep', 'Developer')),
          CONSTRAINT check_action CHECK (action IN ('create', 'read', 'update', 'delete', 'export'))
        )
      `, (err) => {
        if (err) {
          console.error('Error creating role_permissions table:', err);
          reject(err);
          return;
        }
      });

      // User assignments table (links users to companies/projects)
      db.run(`
        CREATE TABLE IF NOT EXISTS user_assignments (
          assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          entity_type VARCHAR(20) NOT NULL,
          entity_id INTEGER NOT NULL,
          assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
          CONSTRAINT check_entity_type CHECK (entity_type IN ('company', 'project', 'feedback'))
        )
      `, (err) => {
        if (err) {
          console.error('Error creating user_assignments table:', err);
          reject(err);
        } else {
          console.log('Authentication tables created successfully');
          resolve();
        }
      });
    });
  });
}

// Insert default role permissions
function insertRolePermissions(db) {
  return new Promise((resolve, reject) => {
    const permissions = [
      // Admin - Full access
      ['Admin', 'users', 'create'], ['Admin', 'users', 'read'], ['Admin', 'users', 'update'], ['Admin', 'users', 'delete'],
      ['Admin', 'companies', 'create'], ['Admin', 'companies', 'read'], ['Admin', 'companies', 'update'], ['Admin', 'companies', 'delete'], ['Admin', 'companies', 'export'],
      ['Admin', 'contacts', 'create'], ['Admin', 'contacts', 'read'], ['Admin', 'contacts', 'update'], ['Admin', 'contacts', 'delete'], ['Admin', 'contacts', 'export'],
      ['Admin', 'feedbacks', 'create'], ['Admin', 'feedbacks', 'read'], ['Admin', 'feedbacks', 'update'], ['Admin', 'feedbacks', 'delete'], ['Admin', 'feedbacks', 'export'],
      ['Admin', 'projects', 'create'], ['Admin', 'projects', 'read'], ['Admin', 'projects', 'update'], ['Admin', 'projects', 'delete'], ['Admin', 'projects', 'export'],
      ['Admin', 'tasks', 'create'], ['Admin', 'tasks', 'read'], ['Admin', 'tasks', 'update'], ['Admin', 'tasks', 'delete'], ['Admin', 'tasks', 'export'],
      ['Admin', 'team_members', 'create'], ['Admin', 'team_members', 'read'], ['Admin', 'team_members', 'update'], ['Admin', 'team_members', 'delete'],
      ['Admin', 'analytics', 'read'], ['Admin', 'settings', 'update'],

      // Manager - Team oversight and project management
      ['Manager', 'companies', 'read'], ['Manager', 'companies', 'update'], ['Manager', 'companies', 'export'],
      ['Manager', 'contacts', 'read'], ['Manager', 'contacts', 'update'], ['Manager', 'contacts', 'export'],
      ['Manager', 'feedbacks', 'read'], ['Manager', 'feedbacks', 'update'],
      ['Manager', 'projects', 'create'], ['Manager', 'projects', 'read'], ['Manager', 'projects', 'update'], ['Manager', 'projects', 'delete'],
      ['Manager', 'tasks', 'create'], ['Manager', 'tasks', 'read'], ['Manager', 'tasks', 'update'], ['Manager', 'tasks', 'delete'],
      ['Manager', 'team_members', 'read'], ['Manager', 'team_members', 'update'],
      ['Manager', 'analytics', 'read'],

      // Sales Rep - Customer focused
      ['Sales Rep', 'companies', 'read'], ['Sales Rep', 'companies', 'update'],
      ['Sales Rep', 'contacts', 'create'], ['Sales Rep', 'contacts', 'read'], ['Sales Rep', 'contacts', 'update'],
      ['Sales Rep', 'feedbacks', 'read'],
      ['Sales Rep', 'projects', 'read'],
      ['Sales Rep', 'tasks', 'read'], ['Sales Rep', 'tasks', 'update'],
      ['Sales Rep', 'analytics', 'read'],

      // Developer - Feedback and support focused
      ['Developer', 'companies', 'read'],
      ['Developer', 'contacts', 'read'],
      ['Developer', 'feedbacks', 'create'], ['Developer', 'feedbacks', 'read'], ['Developer', 'feedbacks', 'update'],
      ['Developer', 'tasks', 'read'], ['Developer', 'tasks', 'update'],
      ['Developer', 'analytics', 'read']
    ];

    const stmt = db.prepare('INSERT OR IGNORE INTO role_permissions (role, resource, action) VALUES (?, ?, ?)');
    
    permissions.forEach(([role, resource, action]) => {
      stmt.run(role, resource, action);
    });

    stmt.finalize((err) => {
      if (err) {
        console.error('Error inserting role permissions:', err);
        reject(err);
      } else {
        console.log('Role permissions inserted successfully');
        resolve();
      }
    });
  });
}

async function initializeAuthSystem(db) {
  try {
    await createAuthTables(db);
    await insertRolePermissions(db);
    console.log('Authentication system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize authentication system:', error);
    throw error;
  }
}

module.exports = {
  createAuthTables,
  insertRolePermissions,
  initializeAuthSystem
};
