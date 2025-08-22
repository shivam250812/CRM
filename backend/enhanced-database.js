const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'crm.db');

// Database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enhanced Database Schema for Comprehensive CRM
const createEnhancedTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Companies Entity
      db.run(`
        CREATE TABLE IF NOT EXISTS companies (
          company_id INTEGER PRIMARY KEY AUTOINCREMENT,
          company_name VARCHAR(255) NOT NULL,
          website VARCHAR(255),
          industry VARCHAR(100),
          status VARCHAR(20) CHECK(status IN ('Lead', 'Active Customer', 'Churned', 'Prospect')) NOT NULL DEFAULT 'Prospect',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 2. Contacts Entity
      db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
          contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(20),
          role_at_company VARCHAR(100),
          company_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (company_id) REFERENCES companies (company_id) ON DELETE SET NULL
        )
      `);

      // 3. Enhanced Team_Members Entity
      db.run(`
        CREATE TABLE IF NOT EXISTS team_members_new (
          member_id INTEGER PRIMARY KEY AUTOINCREMENT,
          member_name VARCHAR(255) NOT NULL,
          role VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(20),
          department VARCHAR(100),
          hire_date DATE,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 4. Enhanced Feedbacks Entity
      db.run(`
        CREATE TABLE IF NOT EXISTS feedbacks_new (
          feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
          feedback_title VARCHAR(255) NOT NULL,
          description TEXT,
          feedback_type VARCHAR(30) CHECK(feedback_type IN ('Bug Report', 'Feature Request', 'Usability Issue', 'General Inquiry')) NOT NULL,
          urgency VARCHAR(20) CHECK(urgency IN ('Low', 'Medium', 'High', 'Critical')) NOT NULL DEFAULT 'Medium',
          resolution_status VARCHAR(20) CHECK(resolution_status IN ('New', 'Under Review', 'Planned', 'In Progress', 'Resolved', 'Won''t Fix')) NOT NULL DEFAULT 'New',
          source VARCHAR(50),
          contact_id INTEGER,
          assigned_member_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE SET NULL,
          FOREIGN KEY (assigned_member_id) REFERENCES team_members_new (member_id) ON DELETE SET NULL
        )
      `);

      // 5. Enhanced Projects Entity
      db.run(`
        CREATE TABLE IF NOT EXISTS projects_new (
          project_id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_name VARCHAR(255) NOT NULL,
          description TEXT,
          start_date DATE,
          end_date DATE,
          status VARCHAR(20) CHECK(status IN ('Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled')) NOT NULL DEFAULT 'Not Started',
          project_manager_id INTEGER,
          budget DECIMAL(10,2),
          progress_percentage INTEGER DEFAULT 0 CHECK(progress_percentage >= 0 AND progress_percentage <= 100),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_manager_id) REFERENCES team_members_new (member_id) ON DELETE SET NULL
        )
      `);

      // 6. Enhanced Tasks Entity
      db.run(`
        CREATE TABLE IF NOT EXISTS tasks_new (
          task_id INTEGER PRIMARY KEY AUTOINCREMENT,
          task_name VARCHAR(255) NOT NULL,
          description TEXT,
          due_date DATE,
          status VARCHAR(20) CHECK(status IN ('To Do', 'In Progress', 'In Review', 'Done')) NOT NULL DEFAULT 'To Do',
          priority VARCHAR(20) CHECK(priority IN ('Low', 'Medium', 'High')) NOT NULL DEFAULT 'Medium',
          project_id INTEGER NOT NULL,
          assigned_member_id INTEGER,
          parent_task_id INTEGER,
          estimated_hours DECIMAL(5,2),
          actual_hours DECIMAL(5,2),
          completion_percentage INTEGER DEFAULT 0 CHECK(completion_percentage >= 0 AND completion_percentage <= 100),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects_new (project_id) ON DELETE CASCADE,
          FOREIGN KEY (assigned_member_id) REFERENCES team_members_new (member_id) ON DELETE SET NULL,
          FOREIGN KEY (parent_task_id) REFERENCES tasks_new (task_id) ON DELETE SET NULL
        )
      `);

      // 7. Project_Members Junction Table
      db.run(`
        CREATE TABLE IF NOT EXISTS project_members (
          project_id INTEGER,
          member_id INTEGER,
          role_on_project VARCHAR(100),
          joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (project_id, member_id),
          FOREIGN KEY (project_id) REFERENCES projects_new (project_id) ON DELETE CASCADE,
          FOREIGN KEY (member_id) REFERENCES team_members_new (member_id) ON DELETE CASCADE
        )
      `);

      // 8. Feedback_Project_Links Junction Table
      db.run(`
        CREATE TABLE IF NOT EXISTS feedback_project_links_new (
          feedback_id INTEGER,
          project_id INTEGER,
          notes TEXT,
          link_type VARCHAR(50) DEFAULT 'Related',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (feedback_id, project_id),
          FOREIGN KEY (feedback_id) REFERENCES feedbacks_new (feedback_id) ON DELETE CASCADE,
          FOREIGN KEY (project_id) REFERENCES projects_new (project_id) ON DELETE CASCADE
        )
      `);

      // 9. Comments Entity (Polymorphic)
      db.run(`
        CREATE TABLE IF NOT EXISTS comments (
          comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
          body TEXT NOT NULL,
          author_member_id INTEGER NOT NULL,
          parent_entity_id INTEGER NOT NULL,
          parent_entity_type VARCHAR(50) NOT NULL,
          parent_comment_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author_member_id) REFERENCES team_members_new (member_id) ON DELETE CASCADE,
          FOREIGN KEY (parent_comment_id) REFERENCES comments (comment_id) ON DELETE CASCADE
        )
      `);

      // 10. Attachments Entity (Polymorphic)
      db.run(`
        CREATE TABLE IF NOT EXISTS attachments (
          attachment_id INTEGER PRIMARY KEY AUTOINCREMENT,
          file_name VARCHAR(255) NOT NULL,
          file_url VARCHAR(500) NOT NULL,
          file_size INTEGER,
          file_type VARCHAR(100),
          uploaded_by_member_id INTEGER NOT NULL,
          parent_entity_id INTEGER NOT NULL,
          parent_entity_type VARCHAR(50) NOT NULL,
          uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (uploaded_by_member_id) REFERENCES team_members_new (member_id) ON DELETE CASCADE
        )
      `);

      // 11. Activity Log for Audit Trail
      db.run(`
        CREATE TABLE IF NOT EXISTS activity_log (
          log_id INTEGER PRIMARY KEY AUTOINCREMENT,
          entity_type VARCHAR(50) NOT NULL,
          entity_id INTEGER NOT NULL,
          action VARCHAR(50) NOT NULL,
          old_values TEXT,
          new_values TEXT,
          performed_by_member_id INTEGER,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (performed_by_member_id) REFERENCES team_members_new (member_id) ON DELETE SET NULL
        )
      `);

      // 12. Customer Interaction History
      db.run(`
        CREATE TABLE IF NOT EXISTS interaction_history (
          interaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
          contact_id INTEGER NOT NULL,
          interaction_type VARCHAR(50) NOT NULL,
          interaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          subject VARCHAR(255),
          description TEXT,
          outcome VARCHAR(100),
          next_action VARCHAR(255),
          handled_by_member_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE CASCADE,
          FOREIGN KEY (handled_by_member_id) REFERENCES team_members_new (member_id) ON DELETE SET NULL
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tables:', err.message);
          reject(err);
        } else {
          console.log('Enhanced database tables created successfully');
          resolve();
        }
      });
    });
  });
};

// Migration function to transfer existing data
const migrateExistingData = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Migrate team_members (avoid duplicates)
      db.run(`
        INSERT OR IGNORE INTO team_members_new (member_name, role, email, phone, created_at)
        SELECT name, role, email, phone, created_at 
        FROM team_members
      `);

      // Migrate projects with enhanced fields (avoid duplicates)
      db.run(`
        INSERT OR IGNORE INTO projects_new (project_name, description, start_date, end_date, status, created_at)
        SELECT name, description, start_date, end_date, 
               CASE 
                 WHEN status = 'planned' THEN 'Not Started'
                 WHEN status = 'in_progress' THEN 'In Progress'
                 WHEN status = 'completed' THEN 'Completed'
                 ELSE 'Not Started'
               END,
               created_at
        FROM projects
      `);

      // Migrate tasks with enhanced fields (avoid duplicates)
      db.run(`
        INSERT OR IGNORE INTO tasks_new (task_name, description, due_date, status, priority, project_id, assigned_member_id, created_at)
        SELECT 
          t.name, 
          t.description, 
          t.due_date,
          CASE 
            WHEN t.status = 'planned' THEN 'To Do'
            WHEN t.status = 'in_progress' THEN 'In Progress'
            WHEN t.status = 'completed' THEN 'Done'
            ELSE 'To Do'
          END,
          'Medium',
          p.project_id,
          tm.member_id,
          t.created_at
        FROM tasks t
        LEFT JOIN projects_new p ON p.project_name = (
          SELECT name FROM projects WHERE id = t.project_id
        )
        LEFT JOIN team_members_new tm ON tm.member_name = (
          SELECT name FROM team_members WHERE id = t.assigned_member_id
        )
      `);

      // Create default contacts from feedback emails
      db.run(`
        INSERT OR IGNORE INTO contacts (email, first_name, created_at)
        SELECT DISTINCT email, 
               CASE 
                 WHEN email LIKE '%@%' THEN SUBSTR(email, 1, INSTR(email, '@') - 1)
                 ELSE 'Unknown'
               END,
               MIN(created_at)
        FROM feedbacks 
        WHERE email IS NOT NULL AND email != ''
        GROUP BY email
      `);

      // Migrate feedbacks with enhanced fields (avoid duplicates)
      db.run(`
        INSERT OR IGNORE INTO feedbacks_new (feedback_title, description, feedback_type, urgency, resolution_status, source, contact_id, created_at)
        SELECT 
          f.title,
          f.description,
          CASE 
            WHEN f.type = 'Bug' THEN 'Bug Report'
            WHEN f.type = 'Feature Request' THEN 'Feature Request'
            WHEN f.type = 'Comment' THEN 'General Inquiry'
            WHEN f.type = 'Incident' THEN 'Bug Report'
            ELSE 'General Inquiry'
          END,
          CASE 
            WHEN f.urgency = 'Critical' THEN 'Critical'
            WHEN f.urgency = 'High' THEN 'High'
            WHEN f.urgency = 'Medium' THEN 'Medium'
            WHEN f.urgency = 'Low' THEN 'Low'
            ELSE 'Medium'
          END,
          CASE 
            WHEN f.status = 'Open' THEN 'New'
            WHEN f.status = 'Under Review' THEN 'Under Review'
            WHEN f.status = 'In Progress' THEN 'In Progress'
            WHEN f.status = 'Closed' THEN 'Resolved'
            WHEN f.status = 'Under Investigation' THEN 'Under Review'
            ELSE 'New'
          END,
          'Email',
          c.contact_id,
          f.created_at
        FROM feedbacks f
        LEFT JOIN contacts c ON c.email = f.email
      `);

      // Migrate feedback project links (only if the table exists)
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='feedback_project_links'", (err, row) => {
        if (row) {
          db.run(`
            INSERT INTO feedback_project_links_new (feedback_id, project_id, notes, created_at)
            SELECT 
              fn.feedback_id,
              pn.project_id,
              COALESCE(fpl.notes, '') as notes,
              fpl.created_at
            FROM feedback_project_links fpl
            LEFT JOIN feedbacks_new fn ON fn.feedback_title = (
              SELECT title FROM feedbacks WHERE id = fpl.feedback_id
            )
            LEFT JOIN projects_new pn ON pn.project_name = (
              SELECT name FROM projects WHERE id = fpl.project_id
            )
            WHERE fn.feedback_id IS NOT NULL AND pn.project_id IS NOT NULL
          `, (err) => {
            if (err) {
              console.log('Warning: Could not migrate feedback project links:', err.message);
            }
            console.log('Data migration completed successfully');
            resolve();
          });
        } else {
          console.log('Data migration completed successfully (no existing feedback_project_links table)');
          resolve();
        }
      });
    });
  });
};

// Initialize enhanced database
const initializeEnhancedDatabase = async () => {
  try {
    await createEnhancedTables();
    await migrateExistingData();
    
    // Check if we need to insert sample data
    const companyCount = await getRecord('SELECT COUNT(*) as count FROM companies');
    if (companyCount.count === 0) {
      const { insertSampleData } = require('./sample-data');
      await insertSampleData();
    }
    
    console.log('Enhanced CRM database initialized successfully');
  } catch (error) {
    console.error('Error initializing enhanced database:', error);
  }
};

// Utility functions for database operations
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const getAllRecords = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve({ data: rows });
      }
    });
  });
};

const getRecord = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

module.exports = {
  db,
  initializeEnhancedDatabase,
  runQuery,
  getAllRecords,
  getRecord
};
