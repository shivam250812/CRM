const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./database');
const { initializeEnhancedDatabase } = require('./enhanced-database');
const { insertSampleData } = require('./sample-data');
const { insertSampleUsers } = require('./auth-sample-data');
const { initializeAuthSystem } = require('./auth-schema');
const routes = require('./routes');
const enhancedRoutes = require('./enhanced-routes');
const authRoutes = require('./auth-routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Vite dev server ports
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store database instance for middleware access
let dbInstance = null;

// Initialize databases and insert sample data
const initializeApp = async () => {
  try {
    dbInstance = await initializeDatabase();
    await initializeEnhancedDatabase();
    
    // Get the database instance from enhanced-database for auth system
    const { db } = require('./enhanced-database');
    await initializeAuthSystem(db);
    
    // Make database available to routes
    app.set('db', db);
    
    // Insert sample data
    setTimeout(async () => {
      try {
        await insertSampleData();
        const { db } = require('./enhanced-database');
        await insertSampleUsers(db);
        console.log('Sample data insertion completed');
      } catch (error) {
        console.error('Error inserting sample data:', error);
      }
    }, 1000);
  } catch (error) {
    console.error('Error initializing app:', error);
  }
};

initializeApp();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', routes);
app.use('/api', enhancedRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CRM Backend API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`CRM Backend API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
});

