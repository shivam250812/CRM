const express = require('express');
const { runQuery, getAllRecords, getRecord } = require('./database');

const router = express.Router();

// FEEDBACKS ROUTES
// Get all feedbacks
router.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await getAllRecords('SELECT * FROM feedbacks ORDER BY created_at DESC');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create feedback
router.post('/feedbacks', async (req, res) => {
  try {
    const { title, type, description, urgency, status, email, created_date } = req.body;
    const result = await runQuery(
      'INSERT INTO feedbacks (title, type, description, urgency, status, email, created_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, type, description, urgency, status, email, created_date]
    );
    const newFeedback = await getRecord('SELECT * FROM feedbacks WHERE id = ?', [result.id]);
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update feedback
router.put('/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, description, urgency, status, email, created_date } = req.body;
    await runQuery(
      'UPDATE feedbacks SET title = ?, type = ?, description = ?, urgency = ?, status = ?, email = ?, created_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, type, description, urgency, status, email, created_date, id]
    );
    const updatedFeedback = await getRecord('SELECT * FROM feedbacks WHERE id = ?', [id]);
    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete feedback
router.delete('/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery('DELETE FROM feedbacks WHERE id = ?', [id]);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PROJECTS ROUTES
// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await getAllRecords('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/projects', async (req, res) => {
  try {
    const { name, description, start_date, end_date, status } = req.body;
    const result = await runQuery(
      'INSERT INTO projects (name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      [name, description, start_date, end_date, status]
    );
    const newProject = await getRecord('SELECT * FROM projects WHERE id = ?', [result.id]);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, start_date, end_date, status } = req.body;
    await runQuery(
      'UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, start_date, end_date, status, id]
    );
    const updatedProject = await getRecord('SELECT * FROM projects WHERE id = ?', [id]);
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TEAM MEMBERS ROUTES
// Get all team members
router.get('/team-members', async (req, res) => {
  try {
    const teamMembers = await getAllRecords('SELECT * FROM team_members ORDER BY created_at DESC');
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create team member
router.post('/team-members', async (req, res) => {
  try {
    const { name, role, email, phone, notes } = req.body;
    const result = await runQuery(
      'INSERT INTO team_members (name, role, email, phone, notes) VALUES (?, ?, ?, ?, ?)',
      [name, role, email, phone, notes]
    );
    const newMember = await getRecord('SELECT * FROM team_members WHERE id = ?', [result.id]);
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update team member
router.put('/team-members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, phone, notes } = req.body;
    await runQuery(
      'UPDATE team_members SET name = ?, role = ?, email = ?, phone = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, role, email, phone, notes, id]
    );
    const updatedMember = await getRecord('SELECT * FROM team_members WHERE id = ?', [id]);
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete team member
router.delete('/team-members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery('DELETE FROM team_members WHERE id = ?', [id]);
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TASKS ROUTES
// Get all tasks with project and team member details
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await getAllRecords(`
      SELECT 
        t.*,
        p.name as project_name,
        tm.name as assigned_member_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN team_members tm ON t.assigned_member_id = tm.id
      ORDER BY t.created_at DESC
    `);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/tasks', async (req, res) => {
  try {
    const { name, description, due_date, status, project_id, assigned_member_id } = req.body;
    const result = await runQuery(
      'INSERT INTO tasks (name, description, due_date, status, project_id, assigned_member_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, due_date, status, project_id, assigned_member_id]
    );
    const newTask = await getRecord(`
      SELECT 
        t.*,
        p.name as project_name,
        tm.name as assigned_member_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN team_members tm ON t.assigned_member_id = tm.id
      WHERE t.id = ?
    `, [result.id]);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, due_date, status, project_id, assigned_member_id } = req.body;
    await runQuery(
      'UPDATE tasks SET name = ?, description = ?, due_date = ?, status = ?, project_id = ?, assigned_member_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, due_date, status, project_id, assigned_member_id, id]
    );
    const updatedTask = await getRecord(`
      SELECT 
        t.*,
        p.name as project_name,
        tm.name as assigned_member_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN team_members tm ON t.assigned_member_id = tm.id
      WHERE t.id = ?
    `, [id]);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FEEDBACK PROJECT LINKS ROUTES
// Get all feedback project links
router.get('/feedback-project-links', async (req, res) => {
  try {
    const links = await getAllRecords(`
      SELECT 
        fpl.*,
        p.name as project_name
      FROM feedback_project_links fpl
      LEFT JOIN projects p ON fpl.project_id = p.id
      ORDER BY fpl.created_at DESC
    `);
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create feedback project link
router.post('/feedback-project-links', async (req, res) => {
  try {
    const { feedback_title, project_id, notes } = req.body;
    const result = await runQuery(
      'INSERT INTO feedback_project_links (feedback_title, project_id, notes) VALUES (?, ?, ?)',
      [feedback_title, project_id, notes]
    );
    const newLink = await getRecord(`
      SELECT 
        fpl.*,
        p.name as project_name
      FROM feedback_project_links fpl
      LEFT JOIN projects p ON fpl.project_id = p.id
      WHERE fpl.id = ?
    `, [result.id]);
    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update feedback project link
router.put('/feedback-project-links/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback_title, project_id, notes } = req.body;
    await runQuery(
      'UPDATE feedback_project_links SET feedback_title = ?, project_id = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [feedback_title, project_id, notes, id]
    );
    const updatedLink = await getRecord(`
      SELECT 
        fpl.*,
        p.name as project_name
      FROM feedback_project_links fpl
      LEFT JOIN projects p ON fpl.project_id = p.id
      WHERE fpl.id = ?
    `, [id]);
    res.json(updatedLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete feedback project link
router.delete('/feedback-project-links/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery('DELETE FROM feedback_project_links WHERE id = ?', [id]);
    res.json({ message: 'Feedback project link deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

