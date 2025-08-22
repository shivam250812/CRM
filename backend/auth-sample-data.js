const { createUser } = require('./auth-middleware');

async function insertSampleUsers(db) {
  const sampleUsers = [
    {
      username: 'admin',
      email: 'admin@crm.com',
      password: 'admin123',
      role: 'Admin',
      first_name: 'System',
      last_name: 'Administrator'
    },
    {
      username: 'manager1',
      email: 'manager@crm.com',
      password: 'manager123',
      role: 'Manager',
      first_name: 'John',
      last_name: 'Manager'
    },
    {
      username: 'sales1',
      email: 'sales@crm.com',
      password: 'sales123',
      role: 'Sales Rep',
      first_name: 'Sarah',
      last_name: 'Sales'
    },
    {
      username: 'dev1',
      email: 'developer@crm.com',
      password: 'dev123',
      role: 'Developer',
      first_name: 'Mike',
      last_name: 'Developer'
    },
    {
      username: 'sales2',
      email: 'alice.sales@crm.com',
      password: 'sales123',
      role: 'Sales Rep',
      first_name: 'Alice',
      last_name: 'Johnson'
    }
  ];

  console.log('Inserting sample users...');

  for (const userData of sampleUsers) {
    try {
      await createUser(db, userData);
      console.log(`✓ Created user: ${userData.username} (${userData.role})`);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        console.log(`→ User ${userData.username} already exists, skipping`);
      } else {
        console.error(`✗ Error creating user ${userData.username}:`, error.message);
      }
    }
  }

  // Insert sample user assignments for Sales Reps
  const assignments = [
    { user_id: 3, entity_type: 'company', entity_id: 1 }, // sales1 -> TechStart Inc
    { user_id: 3, entity_type: 'company', entity_id: 2 }, // sales1 -> Innovation Labs
    { user_id: 5, entity_type: 'company', entity_id: 3 }, // sales2 -> Growth Corp
    { user_id: 5, entity_type: 'company', entity_id: 4 }, // sales2 -> Scale Solutions
  ];

  for (const assignment of assignments) {
    try {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT OR IGNORE INTO user_assignments (user_id, entity_type, entity_id) VALUES (?, ?, ?)',
          [assignment.user_id, assignment.entity_type, assignment.entity_id],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    } catch (error) {
      console.error('Error inserting user assignment:', error);
    }
  }

  console.log('Sample users and assignments created successfully!');
  console.log('\n🔑 Login Credentials:');
  console.log('Admin: admin / admin123');
  console.log('Manager: manager1 / manager123');
  console.log('Sales Rep: sales1 / sales123');
  console.log('Developer: dev1 / dev123');
}

module.exports = { insertSampleUsers };
