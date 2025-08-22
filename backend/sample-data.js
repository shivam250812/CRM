const { runQuery } = require('./enhanced-database');

const insertSampleData = async () => {
  try {
    console.log('Inserting sample data...');

    // Sample Companies
    const companies = [
      { name: 'TechCorp Inc', website: 'https://techcorp.com', industry: 'Technology', status: 'Active Customer' },
      { name: 'StartupHub', website: 'https://startuphub.io', industry: 'Professional Services', status: 'Lead' },
      { name: 'DataFlow Solutions', website: 'https://dataflow.com', industry: 'Technology', status: 'Prospect' },
      { name: 'GreenTech Innovations', website: 'https://greentech.com', industry: 'Technology', status: 'Active Customer' },
      { name: 'RetailMax', website: 'https://retailmax.com', industry: 'Retail', status: 'Churned' }
    ];

    const companyIds = [];
    for (const company of companies) {
      const result = await runQuery(
        'INSERT INTO companies (company_name, website, industry, status) VALUES (?, ?, ?, ?)',
        [company.name, company.website, company.industry, company.status]
      );
      companyIds.push(result.id);
    }

    // Sample Contacts
    const contacts = [
      { first_name: 'John', last_name: 'Smith', email: 'john.smith@techcorp.com', phone: '+1-555-0101', role: 'CTO', company_id: companyIds[0] },
      { first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.j@startuphub.io', phone: '+1-555-0102', role: 'Product Manager', company_id: companyIds[1] },
      { first_name: 'Mike', last_name: 'Davis', email: 'mike.davis@dataflow.com', phone: '+1-555-0103', role: 'Lead Developer', company_id: companyIds[2] },
      { first_name: 'Emily', last_name: 'Chen', email: 'emily.chen@greentech.com', phone: '+1-555-0104', role: 'Engineering Manager', company_id: companyIds[3] },
      { first_name: 'David', last_name: 'Wilson', email: 'david.w@retailmax.com', phone: '+1-555-0105', role: 'IT Director', company_id: companyIds[4] }
    ];

    const contactIds = [];
    for (const contact of contacts) {
      const result = await runQuery(
        'INSERT OR IGNORE INTO contacts (first_name, last_name, email, phone, role_at_company, company_id) VALUES (?, ?, ?, ?, ?, ?)',
        [contact.first_name, contact.last_name, contact.email, contact.phone, contact.role, contact.company_id]
      );
      contactIds.push(result.id || result.lastID);
    }

    // Sample Enhanced Feedbacks with created dates
    const feedbacks = [
      {
        title: 'Dashboard Loading Performance Issue',
        description: 'The main dashboard takes too long to load when we have lots of data.',
        type: 'Bug Report',
        urgency: 'High',
        status: 'In Progress',
        source: 'Email',
        contact_id: contactIds[0],
        created_date: '2024-01-15'
      },
      {
        title: 'Export to Excel Feature Request',
        description: 'We need the ability to export our reports to Excel format for our monthly reviews.',
        type: 'Feature Request',
        urgency: 'Medium',
        status: 'Planned',
        source: 'In-app Widget',
        contact_id: contactIds[1],
        created_date: '2024-01-20'
      },
      {
        title: 'Mobile App Crashes on iOS',
        description: 'The mobile app crashes when trying to upload images on iOS devices.',
        type: 'Bug Report',
        urgency: 'Critical',
        status: 'Under Review',
        source: 'Phone Call',
        contact_id: contactIds[2],
        created_date: '2024-01-25'
      },
      {
        title: 'Dark Mode Support',
        description: 'Please add dark mode support for better user experience during night work.',
        type: 'Feature Request',
        urgency: 'Low',
        status: 'New',
        source: 'Email',
        contact_id: contactIds[3],
        created_date: '2024-02-01'
      },
      {
        title: 'API Documentation Outdated',
        description: 'The API documentation doesn\'t match the current endpoints.',
        type: 'General Inquiry',
        urgency: 'Medium',
        status: 'Resolved',
        source: 'Email',
        contact_id: contactIds[4],
        created_date: '2024-02-05'
      }
    ];

    for (const feedback of feedbacks) {
      await runQuery(
        `INSERT OR IGNORE INTO feedbacks_new 
         (feedback_title, description, feedback_type, urgency, resolution_status, source, contact_id, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [feedback.title, feedback.description, feedback.type, feedback.urgency, feedback.status, feedback.source, feedback.contact_id, feedback.created_date]
      );
    }

    // Sample Team Members (insert first)
    const teamMembersData = [
      { name: 'Alice Johnson', role: 'Project Manager', email: 'alice.johnson@company.com', phone: '+1-555-0201' },
      { name: 'Bob Smith', role: 'Senior Developer', email: 'bob.smith@company.com', phone: '+1-555-0202' },
      { name: 'Carol Davis', role: 'QA Engineer', email: 'carol.davis@company.com', phone: '+1-555-0203' }
    ];

    const teamMemberIds = [];
    for (const member of teamMembersData) {
      const result = await runQuery(
        'INSERT OR IGNORE INTO team_members_new (member_name, role, email, phone) VALUES (?, ?, ?, ?)',
        [member.name, member.role, member.email, member.phone]
      );
      teamMemberIds.push(result.id || result.lastID);
    }

    // Get team member IDs for project assignment
    const { getAllRecords } = require('./enhanced-database');
    const teamMembersResult = await getAllRecords('SELECT member_id FROM team_members_new LIMIT 3');
    const teamMembers = teamMembersResult.data || teamMemberIds.map(id => ({ member_id: id }));
    
    // Sample Enhanced Projects
    const projects = [
      {
        name: 'Performance Optimization Initiative',
        description: 'Comprehensive performance improvements across the platform.',
        start_date: '2024-01-15',
        end_date: '2024-03-30',
        status: 'In Progress',
        project_manager_id: teamMembers?.[0]?.member_id || null,
        budget: 50000
      },
      {
        name: 'Mobile App Enhancement',
        description: 'Bug fixes and new features for mobile applications.',
        start_date: '2024-02-01',
        end_date: '2024-04-15',
        status: 'In Progress',
        project_manager_id: teamMembers?.[1]?.member_id || null,
        budget: 35000
      },
      {
        name: 'Documentation Update Project',
        description: 'Update all API documentation and user guides.',
        start_date: '2024-01-01',
        end_date: '2024-02-15',
        status: 'Completed',
        project_manager_id: teamMembers?.[2]?.member_id || null,
        budget: 15000
      }
    ];

    for (const project of projects) {
      await runQuery(
        `INSERT OR IGNORE INTO projects_new 
         (project_name, description, start_date, end_date, status, project_manager_id, budget) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [project.name, project.description, project.start_date, project.end_date, project.status, project.project_manager_id, project.budget]
      );
    }

    // Sample Tasks
    const tasks = [
      {
        name: 'Optimize database queries',
        description: 'Review and optimize slow database queries in the dashboard.',
        due_date: '2024-02-15',
        status: 'In Progress',
        priority: 'High',
        project_id: 1, // Performance Optimization Initiative
        assigned_member_id: teamMemberIds[0]
      },
      {
        name: 'Fix iOS crash bug',
        description: 'Investigate and fix the image upload crash on iOS devices.',
        due_date: '2024-02-20',
        status: 'To Do',
        priority: 'Critical',
        project_id: 2, // Mobile App Enhancement
        assigned_member_id: teamMemberIds[1]
      },
      {
        name: 'Update API documentation',
        description: 'Update all endpoint documentation to match current implementation.',
        due_date: '2024-02-10',
        status: 'Done',
        priority: 'Medium',
        project_id: 3, // Documentation Update Project
        assigned_member_id: teamMemberIds[2]
      }
    ];

    for (const task of tasks) {
      await runQuery(
        `INSERT OR IGNORE INTO tasks_new 
         (task_name, description, due_date, status, priority, project_id, assigned_member_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [task.name, task.description, task.due_date, task.status, task.priority, task.project_id, task.assigned_member_id]
      );
    }

    // Sample Feedback Project Links
    const feedbackLinks = [
      { feedback_id: 1, project_id: 1, notes: 'Dashboard performance directly related to optimization project' },
      { feedback_id: 3, project_id: 2, notes: 'iOS crash bug tied to mobile enhancement project' },
      { feedback_id: 5, project_id: 3, notes: 'Documentation feedback addressed in update project' }
    ];

    for (const link of feedbackLinks) {
      await runQuery(
        `INSERT OR IGNORE INTO feedback_project_links_new 
         (feedback_id, project_id, notes) 
         VALUES (?, ?, ?)`,
        [link.feedback_id, link.project_id, link.notes]
      );
    }

    console.log('Sample data inserted successfully!');
    console.log(`- ${companies.length} companies`);
    console.log(`- ${contacts.length} contacts`);
    console.log(`- ${feedbacks.length} feedbacks`);
    console.log(`- ${projects.length} projects`);
    console.log(`- ${teamMembersData.length} team members`);
    console.log(`- ${tasks.length} tasks`);
    console.log(`- ${feedbackLinks.length} feedback project links`);

  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};

module.exports = { insertSampleData };
