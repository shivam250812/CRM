const express = require('express');
const { runQuery, getAllRecords, getRecord } = require('./enhanced-database');

const router = express.Router();

// ==================== COMPANIES ROUTES ====================

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await getAllRecords(`
      SELECT c.*, 
             COUNT(DISTINCT contacts.contact_id) as contact_count,
             COUNT(DISTINCT f.feedback_id) as feedback_count
      FROM companies c
      LEFT JOIN contacts ON contacts.company_id = c.company_id
      LEFT JOIN feedbacks_new f ON f.contact_id = contacts.contact_id
      GROUP BY c.company_id
      ORDER BY c.created_at DESC
    `);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create company
router.post('/companies', async (req, res) => {
  try {
    const { company_name, website, industry, status } = req.body;
    const result = await runQuery(
      'INSERT INTO companies (company_name, website, industry, status) VALUES (?, ?, ?, ?)',
      [company_name, website, industry, status || 'Prospect']
    );
    const newCompany = await getRecord('SELECT * FROM companies WHERE company_id = ?', [result.id]);
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update company
router.put('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, website, industry, status } = req.body;
    await runQuery(
      'UPDATE companies SET company_name = ?, website = ?, industry = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE company_id = ?',
      [company_name, website, industry, status, id]
    );
    const updatedCompany = await getRecord('SELECT * FROM companies WHERE company_id = ?', [id]);
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete company
router.delete('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery('DELETE FROM companies WHERE company_id = ?', [id]);
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CONTACTS ROUTES ====================

// Get all contacts
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await getAllRecords(`
      SELECT c.*, 
             companies.company_name,
             COUNT(f.feedback_id) as feedback_count
      FROM contacts c
      LEFT JOIN companies ON companies.company_id = c.company_id
      LEFT JOIN feedbacks_new f ON f.contact_id = c.contact_id
      GROUP BY c.contact_id
      ORDER BY c.created_at DESC
    `);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create contact
router.post('/contacts', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, role_at_company, company_id } = req.body;
    const result = await runQuery(
      'INSERT INTO contacts (first_name, last_name, email, phone, role_at_company, company_id) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, role_at_company, company_id]
    );
    const newContact = await getRecord(`
      SELECT c.*, companies.company_name
      FROM contacts c
      LEFT JOIN companies ON companies.company_id = c.company_id
      WHERE c.contact_id = ?
    `, [result.id]);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact
router.put('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, role_at_company, company_id } = req.body;
    await runQuery(
      'UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone = ?, role_at_company = ?, company_id = ?, updated_at = CURRENT_TIMESTAMP WHERE contact_id = ?',
      [first_name, last_name, email, phone, role_at_company, company_id, id]
    );
    const updatedContact = await getRecord(`
      SELECT c.*, companies.company_name
      FROM contacts c
      LEFT JOIN companies ON companies.company_id = c.company_id
      WHERE c.contact_id = ?
    `, [id]);
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete contact
router.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery('DELETE FROM contacts WHERE contact_id = ?', [id]);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ENHANCED FEEDBACKS ROUTES ====================

// Get all feedbacks with full relationship data
router.get('/feedbacks-enhanced', async (req, res) => {
  try {
    const feedbacks = await getAllRecords(`
      SELECT f.*,
             c.first_name, c.last_name, c.email as contact_email,
             companies.company_name,
             tm.member_name as assigned_member_name
      FROM feedbacks_new f
      LEFT JOIN contacts c ON c.contact_id = f.contact_id
      LEFT JOIN companies ON companies.company_id = c.company_id
      LEFT JOIN team_members_new tm ON tm.member_id = f.assigned_member_id
      ORDER BY f.created_at DESC
    `);
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create enhanced feedback
router.post('/feedbacks-enhanced', async (req, res) => {
  try {
    const { 
      feedback_title, description, feedback_type, urgency, 
      resolution_status, source, contact_id, email, assigned_member_id 
    } = req.body;
    
    // If email is provided but no contact_id, try to find the contact
    let finalContactId = contact_id;
    if (!finalContactId && email) {
      const existingContact = await getRecord('SELECT contact_id FROM contacts WHERE email = ?', [email]);
      if (existingContact) {
        finalContactId = existingContact.contact_id;
      }
    }
    
    const result = await runQuery(
      `INSERT INTO feedbacks_new 
       (feedback_title, description, feedback_type, urgency, resolution_status, source, contact_id, assigned_member_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [feedback_title, description, feedback_type, urgency, resolution_status, source, finalContactId, assigned_member_id]
    );
    const newFeedback = await getRecord(`
      SELECT f.*,
             c.first_name, c.last_name, c.email as contact_email,
             companies.company_name,
             tm.member_name as assigned_member_name
      FROM feedbacks_new f
      LEFT JOIN contacts c ON c.contact_id = f.contact_id
      LEFT JOIN companies ON companies.company_id = c.company_id
      LEFT JOIN team_members_new tm ON tm.member_id = f.assigned_member_id
      WHERE f.feedback_id = ?
    `, [result.id]);
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ENHANCED PROJECTS ROUTES ====================

// Get all projects with team and task counts
router.get('/projects-enhanced', async (req, res) => {
  try {
    const projects = await getAllRecords(`
      SELECT p.*,
             tm.member_name as project_manager_name,
             COUNT(DISTINCT t.task_id) as task_count,
             COUNT(DISTINCT pm.member_id) as team_member_count,
             AVG(t.completion_percentage) as avg_task_completion
      FROM projects_new p
      LEFT JOIN team_members_new tm ON tm.member_id = p.project_manager_id
      LEFT JOIN tasks_new t ON t.project_id = p.project_id
      LEFT JOIN project_members pm ON pm.project_id = p.project_id
      GROUP BY p.project_id
      ORDER BY p.created_at DESC
    `);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create enhanced project
router.post('/projects-enhanced', async (req, res) => {
  try {
    const { 
      project_name, description, start_date, end_date, 
      status, project_manager_id, budget 
    } = req.body;
    const result = await runQuery(
      `INSERT INTO projects_new 
       (project_name, description, start_date, end_date, status, project_manager_id, budget) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [project_name, description, start_date, end_date, status, project_manager_id, budget]
    );
    const newProject = await getRecord(`
      SELECT p.*, tm.member_name as project_manager_name
      FROM projects_new p
      LEFT JOIN team_members_new tm ON tm.member_id = p.project_manager_id
      WHERE p.project_id = ?
    `, [result.id]);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ENHANCED TASKS ROUTES ====================

// Get all tasks with full relationship data
router.get('/tasks-enhanced', async (req, res) => {
  try {
    const tasks = await getAllRecords(`
      SELECT t.*,
             p.project_name,
             tm.member_name as assigned_member_name,
             parent.task_name as parent_task_name
      FROM tasks_new t
      LEFT JOIN projects_new p ON p.project_id = t.project_id
      LEFT JOIN team_members_new tm ON tm.member_id = t.assigned_member_id
      LEFT JOIN tasks_new parent ON parent.task_id = t.parent_task_id
      ORDER BY t.created_at DESC
    `);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create enhanced task
router.post('/tasks-enhanced', async (req, res) => {
  try {
    const { 
      task_name, description, due_date, status, priority,
      project_id, assigned_member_id, parent_task_id, estimated_hours
    } = req.body;
    const result = await runQuery(
      `INSERT INTO tasks_new 
       (task_name, description, due_date, status, priority, project_id, assigned_member_id, parent_task_id, estimated_hours) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [task_name, description, due_date, status, priority, project_id, assigned_member_id, parent_task_id, estimated_hours]
    );
    const newTask = await getRecord(`
      SELECT t.*,
             p.project_name,
             tm.member_name as assigned_member_name,
             parent.task_name as parent_task_name
      FROM tasks_new t
      LEFT JOIN projects_new p ON p.project_id = t.project_id
      LEFT JOIN team_members_new tm ON tm.member_id = t.assigned_member_id
      LEFT JOIN tasks_new parent ON parent.task_id = t.parent_task_id
      WHERE t.task_id = ?
    `, [result.id]);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ENHANCED TEAM MEMBERS ROUTES ====================

// Get all team members with project and task counts
router.get('/team-members-enhanced', async (req, res) => {
  try {
    const teamMembers = await getAllRecords(`
      SELECT tm.*,
             COUNT(DISTINCT p.project_id) as managed_projects_count,
             COUNT(DISTINCT pm.project_id) as member_projects_count,
             COUNT(DISTINCT t.task_id) as assigned_tasks_count
      FROM team_members_new tm
      LEFT JOIN projects_new p ON p.project_manager_id = tm.member_id
      LEFT JOIN project_members pm ON pm.member_id = tm.member_id
      LEFT JOIN tasks_new t ON t.assigned_member_id = tm.member_id
      GROUP BY tm.member_id
      ORDER BY tm.created_at DESC
    `);
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create enhanced team member
router.post('/team-members-enhanced', async (req, res) => {
  try {
    const { member_name, role, email, phone, department, hire_date } = req.body;
    const result = await runQuery(
      'INSERT INTO team_members_new (member_name, role, email, phone, department, hire_date) VALUES (?, ?, ?, ?, ?, ?)',
      [member_name, role, email, phone, department, hire_date]
    );
    const newMember = await getRecord('SELECT * FROM team_members_new WHERE member_id = ?', [result.id]);
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COMMENTS ROUTES ====================

// Get comments for an entity
router.get('/comments/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const comments = await getAllRecords(`
      SELECT c.*, tm.member_name as author_name
      FROM comments c
      LEFT JOIN team_members_new tm ON tm.member_id = c.author_member_id
      WHERE c.parent_entity_type = ? AND c.parent_entity_id = ?
      ORDER BY c.created_at DESC
    `, [entityType, entityId]);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create comment
router.post('/comments', async (req, res) => {
  try {
    const { body, author_member_id, parent_entity_id, parent_entity_type, parent_comment_id } = req.body;
    const result = await runQuery(
      'INSERT INTO comments (body, author_member_id, parent_entity_id, parent_entity_type, parent_comment_id) VALUES (?, ?, ?, ?, ?)',
      [body, author_member_id, parent_entity_id, parent_entity_type, parent_comment_id]
    );
    const newComment = await getRecord(`
      SELECT c.*, tm.member_name as author_name
      FROM comments c
      LEFT JOIN team_members_new tm ON tm.member_id = c.author_member_id
      WHERE c.comment_id = ?
    `, [result.id]);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ATTACHMENTS ROUTES ====================

// Get attachments for an entity
router.get('/attachments/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const attachments = await getAllRecords(`
      SELECT a.*, tm.member_name as uploaded_by_name
      FROM attachments a
      LEFT JOIN team_members_new tm ON tm.member_id = a.uploaded_by_member_id
      WHERE a.parent_entity_type = ? AND a.parent_entity_id = ?
      ORDER BY a.uploaded_at DESC
    `, [entityType, entityId]);
    res.json(attachments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create attachment
router.post('/attachments', async (req, res) => {
  try {
    const { 
      file_name, file_url, file_size, file_type, 
      uploaded_by_member_id, parent_entity_id, parent_entity_type 
    } = req.body;
    const result = await runQuery(
      'INSERT INTO attachments (file_name, file_url, file_size, file_type, uploaded_by_member_id, parent_entity_id, parent_entity_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [file_name, file_url, file_size, file_type, uploaded_by_member_id, parent_entity_id, parent_entity_type]
    );
    const newAttachment = await getRecord(`
      SELECT a.*, tm.member_name as uploaded_by_name
      FROM attachments a
      LEFT JOIN team_members_new tm ON tm.member_id = a.uploaded_by_member_id
      WHERE a.attachment_id = ?
    `, [result.id]);
    res.status(201).json(newAttachment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ENHANCED PROJECTS ROUTES ====================

// Get all projects with enhanced data
router.get('/projects-enhanced', async (req, res) => {
  try {
    const projects = await getAllRecords(`
      SELECT p.*,
             tm.member_name as project_manager_name,
             COUNT(DISTINCT t.task_id) as task_count,
             COUNT(DISTINCT fpl.feedback_id) as feedback_count
      FROM projects_new p
      LEFT JOIN team_members_new tm ON tm.member_id = p.project_manager_id
      LEFT JOIN tasks_new t ON t.project_id = p.project_id
      LEFT JOIN feedback_project_links_new fpl ON fpl.project_id = p.project_id
      GROUP BY p.project_id
      ORDER BY p.start_date DESC
    `);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create enhanced project
router.post('/projects-enhanced', async (req, res) => {
  try {
    const { 
      project_name, description, start_date, end_date, status, project_manager_id 
    } = req.body;
    const result = await runQuery(
      `INSERT INTO projects_new 
       (project_name, description, start_date, end_date, status, project_manager_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [project_name, description, start_date, end_date, status || 'Not Started', project_manager_id]
    );
    const newProject = await getRecord(`
      SELECT p.*,
             tm.member_name as project_manager_name,
             0 as task_count,
             0 as feedback_count
      FROM projects_new p
      LEFT JOIN team_members_new tm ON tm.member_id = p.project_manager_id
      WHERE p.project_id = ?
    `, [result.id]);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update enhanced project
router.put('/projects-enhanced/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      project_name, description, start_date, end_date, status, project_manager_id 
    } = req.body;
    await runQuery(
      `UPDATE projects_new 
       SET project_name = ?, description = ?, start_date = ?, end_date = ?, status = ?, 
           project_manager_id = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE project_id = ?`,
      [project_name, description, start_date, end_date, status, project_manager_id, id]
    );
    const updatedProject = await getRecord(`
      SELECT p.*,
             tm.member_name as project_manager_name,
             COUNT(DISTINCT t.task_id) as task_count,
             COUNT(DISTINCT fpl.feedback_id) as feedback_count
      FROM projects_new p
      LEFT JOIN team_members_new tm ON tm.member_id = p.project_manager_id
      LEFT JOIN tasks_new t ON t.project_id = p.project_id
      LEFT JOIN feedback_project_links_new fpl ON fpl.project_id = p.project_id
      WHERE p.project_id = ?
      GROUP BY p.project_id
    `, [id]);
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ENHANCED TEAM MEMBERS ROUTES ====================

// Get all team members with enhanced data
router.get('/team-members-enhanced', async (req, res) => {
  try {
    const teamMembers = await getAllRecords(`
      SELECT tm.*,
             COUNT(DISTINCT p.project_id) as managed_projects_count,
             COUNT(DISTINCT t.task_id) as assigned_tasks_count
      FROM team_members_new tm
      LEFT JOIN projects_new p ON p.project_manager_id = tm.member_id
      LEFT JOIN tasks_new t ON t.assigned_member_id = tm.member_id
      GROUP BY tm.member_id
      ORDER BY tm.created_at DESC
    `);
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create enhanced team member
router.post('/team-members-enhanced', async (req, res) => {
  try {
    const { member_name, role, email, phone } = req.body;
    const result = await runQuery(
      'INSERT INTO team_members_new (member_name, role, email, phone) VALUES (?, ?, ?, ?)',
      [member_name, role, email, phone]
    );
    const newMember = await getRecord(`
      SELECT tm.*,
             0 as managed_projects_count,
             0 as assigned_tasks_count
      FROM team_members_new tm
      WHERE tm.member_id = ?
    `, [result.id]);
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update enhanced team member
router.put('/team-members-enhanced/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { member_name, role, email, phone } = req.body;
    await runQuery(
      `UPDATE team_members_new 
       SET member_name = ?, role = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE member_id = ?`,
      [member_name, role, email, phone, id]
    );
    const updatedMember = await getRecord(`
      SELECT tm.*,
             COUNT(DISTINCT p.project_id) as managed_projects_count,
             COUNT(DISTINCT t.task_id) as assigned_tasks_count
      FROM team_members_new tm
      LEFT JOIN projects_new p ON p.project_manager_id = tm.member_id
      LEFT JOIN tasks_new t ON t.assigned_member_id = tm.member_id
      WHERE tm.member_id = ?
      GROUP BY tm.member_id
    `, [id]);
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ENHANCED TASKS ROUTES ====================

// Get all tasks with enhanced data
router.get('/tasks-enhanced', async (req, res) => {
  try {
    const tasks = await getAllRecords(`
      SELECT t.*,
             p.project_name,
             tm.member_name as assigned_member_name
      FROM tasks_new t
      LEFT JOIN projects_new p ON p.project_id = t.project_id
      LEFT JOIN team_members_new tm ON tm.member_id = t.assigned_member_id
      ORDER BY t.due_date ASC
    `);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create enhanced task
router.post('/tasks-enhanced', async (req, res) => {
  try {
    const { 
      task_name, description, due_date, status, priority, 
      project_id, assigned_member_id 
    } = req.body;
    const result = await runQuery(
      `INSERT INTO tasks_new 
       (task_name, description, due_date, status, priority, project_id, assigned_member_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [task_name, description, due_date, status || 'To Do', priority || 'Medium', project_id, assigned_member_id]
    );
    const newTask = await getRecord(`
      SELECT t.*,
             p.project_name,
             tm.member_name as assigned_member_name
      FROM tasks_new t
      LEFT JOIN projects_new p ON p.project_id = t.project_id
      LEFT JOIN team_members_new tm ON tm.member_id = t.assigned_member_id
      WHERE t.task_id = ?
    `, [result.id]);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update enhanced task
router.put('/tasks-enhanced/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      task_name, description, due_date, status, priority, 
      project_id, assigned_member_id 
    } = req.body;
    await runQuery(
      `UPDATE tasks_new 
       SET task_name = ?, description = ?, due_date = ?, status = ?, priority = ?, 
           project_id = ?, assigned_member_id = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE task_id = ?`,
      [task_name, description, due_date, status, priority, project_id, assigned_member_id, id]
    );
    const updatedTask = await getRecord(`
      SELECT t.*,
             p.project_name,
             tm.member_name as assigned_member_name
      FROM tasks_new t
      LEFT JOIN projects_new p ON p.project_id = t.project_id
      LEFT JOIN team_members_new tm ON tm.member_id = t.assigned_member_id
      WHERE t.task_id = ?
    `, [id]);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ANALYTICS ROUTES ====================

// Get comprehensive analytics
router.get('/analytics/dashboard', async (req, res) => {
  try {
    const analytics = {};
    
    // Company analytics
    const companyStats = await getRecord(`
      SELECT 
        COUNT(*) as total_companies,
        COUNT(CASE WHEN status = 'Active Customer' THEN 1 END) as active_customers,
        COUNT(CASE WHEN status = 'Lead' THEN 1 END) as leads,
        COUNT(CASE WHEN status = 'Prospect' THEN 1 END) as prospects
      FROM companies
    `);
    analytics.companies = companyStats;

    // Feedback analytics by source and urgency
    const feedbackStats = await getAllRecords(`
      SELECT 
        feedback_type,
        urgency,
        resolution_status,
        COUNT(*) as count
      FROM feedbacks_new
      GROUP BY feedback_type, urgency, resolution_status
    `);
    analytics.feedbacks = feedbackStats.data;

    // Project progress analytics
    const projectStats = await getAllRecords(`
      SELECT 
        status,
        COUNT(*) as count,
        AVG(progress_percentage) as avg_progress
      FROM projects_new
      GROUP BY status
    `);
    analytics.projects = projectStats.data;

    // Task completion analytics
    const taskStats = await getAllRecords(`
      SELECT 
        status,
        priority,
        COUNT(*) as count,
        AVG(completion_percentage) as avg_completion
      FROM tasks_new
      GROUP BY status, priority
    `);
    analytics.tasks = taskStats.data;

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ENHANCED FEEDBACK PROJECT LINKS ROUTES ====================

// Get all feedback project links with enhanced data
router.get('/feedback-project-links-enhanced', async (req, res) => {
  try {
    const links = await getAllRecords(`
      SELECT fpl.*,
             f.feedback_title,
             p.project_name
      FROM feedback_project_links_new fpl
      LEFT JOIN feedbacks_new f ON f.feedback_id = fpl.feedback_id
      LEFT JOIN projects_new p ON p.project_id = fpl.project_id
      ORDER BY fpl.created_at DESC
    `);
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single feedback project link by IDs
router.get('/feedback-project-links-enhanced/:feedbackId/:projectId', async (req, res) => {
  try {
    const { feedbackId, projectId } = req.params;
    const link = await getRecord(`
      SELECT fpl.*,
             f.feedback_title,
             p.project_name
      FROM feedback_project_links_new fpl
      LEFT JOIN feedbacks_new f ON f.feedback_id = fpl.feedback_id
      LEFT JOIN projects_new p ON p.project_id = fpl.project_id
      WHERE fpl.feedback_id = ? AND fpl.project_id = ?
    `, [feedbackId, projectId]);
    
    if (!link) {
      return res.status(404).json({ error: 'Feedback project link not found' });
    }
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create feedback project link
router.post('/feedback-project-links-enhanced', async (req, res) => {
  try {
    const { feedback_id, project_id, notes, link_type } = req.body;
    
    // Check if link already exists
    const existingLink = await getRecord(
      'SELECT * FROM feedback_project_links_new WHERE feedback_id = ? AND project_id = ?',
      [feedback_id, project_id]
    );
    
    if (existingLink) {
      return res.status(400).json({ error: 'Link between this feedback and project already exists' });
    }
    
    await runQuery(
      `INSERT INTO feedback_project_links_new (feedback_id, project_id, notes, link_type) 
       VALUES (?, ?, ?, ?)`,
      [feedback_id, project_id, notes, link_type || 'Related']
    );
    
    // Return the created link with joined data
    const newLink = await getRecord(`
      SELECT fpl.*,
             f.feedback_title,
             p.project_name
      FROM feedback_project_links_new fpl
      LEFT JOIN feedbacks_new f ON f.feedback_id = fpl.feedback_id
      LEFT JOIN projects_new p ON p.project_id = fpl.project_id
      WHERE fpl.feedback_id = ? AND fpl.project_id = ?
    `, [feedback_id, project_id]);
    
    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update feedback project link
router.put('/feedback-project-links-enhanced/:feedbackId/:projectId', async (req, res) => {
  try {
    const { feedbackId, projectId } = req.params;
    const { notes, link_type } = req.body;
    
    await runQuery(
      `UPDATE feedback_project_links_new 
       SET notes = ?, link_type = ?
       WHERE feedback_id = ? AND project_id = ?`,
      [notes, link_type, feedbackId, projectId]
    );
    
    // Return updated link with joined data
    const updatedLink = await getRecord(`
      SELECT fpl.*,
             f.feedback_title,
             p.project_name
      FROM feedback_project_links_new fpl
      LEFT JOIN feedbacks_new f ON f.feedback_id = fpl.feedback_id
      LEFT JOIN projects_new p ON p.project_id = fpl.project_id
      WHERE fpl.feedback_id = ? AND fpl.project_id = ?
    `, [feedbackId, projectId]);
    
    res.json(updatedLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete feedback project link
router.delete('/feedback-project-links-enhanced/:feedbackId/:projectId', async (req, res) => {
  try {
    const { feedbackId, projectId } = req.params;
    await runQuery(
      'DELETE FROM feedback_project_links_new WHERE feedback_id = ? AND project_id = ?',
      [feedbackId, projectId]
    );
    res.json({ message: 'Feedback project link deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
