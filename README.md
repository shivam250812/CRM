# 🚀 Enterprise CRM - Role-Based Customer Relationship Management System

A modern, enterprise-grade Customer Relationship Management (CRM) system built with React, Node.js, Express, and SQLite. Features comprehensive role-based access control, normalized database architecture, and a complete suite of customer management tools for startups and growing businesses.

![CRM Dashboard](https://img.shields.io/badge/Status-Enterprise%20Ready-green)
![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%205-green)
![Database](https://img.shields.io/badge/Database-SQLite%20%7C%20Normalized-orange)
![Auth](https://img.shields.io/badge/Auth-JWT%20%7C%20Role%20Based-red)
![Security](https://img.shields.io/badge/Security-bcrypt%20%7C%20CORS-purple)

## 📋 Table of Contents

- [Features](#-features)
- [Authentication & Roles](#-authentication--roles)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [User Roles & Permissions](#-user-roles--permissions)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Usage Guide](#-usage-guide)
- [Development](#-development)
- [Security Features](#-security-features)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## ✨ Features

### 🔐 Authentication & Security
- **🛡️ JWT Authentication**: Secure token-based login system
- **👤 Role-Based Access Control**: 4 distinct user roles (Admin, Manager, Sales Rep, Developer)
- **🔒 Password Security**: bcrypt hashing with salt rounds
- **🚫 Route Protection**: Protected API endpoints and frontend routes
- **⏰ Session Management**: 24-hour token expiration with auto-refresh
- **🔐 Permission-Based UI**: Dynamic interface based on user permissions

### 🎯 Core CRM Functionality
- **🏢 Customer Management**: Companies and contacts with relationship tracking
- **📝 Feedback Management**: Customer feedback with types, urgency, and resolution tracking
- **📊 Project Management**: Projects with timelines, team assignments, and status tracking
- **👥 Team Management**: Team members with roles, assignments, and contact information
- **✅ Task Management**: Tasks linked to projects and team members
- **🔗 Integration Links**: Connect feedback directly to relevant projects
- **📈 Analytics Dashboard**: Role-based analytics and reporting
- **📤 Data Export**: CSV/JSON export capabilities with role-based permissions

### 🎨 User Experience
- **🎭 Role-Adaptive UI**: Dashboard changes based on user role and permissions
- **🔍 Advanced Search**: Global and section-specific search functionality
- **🏷️ Smart Filtering**: Advanced filters with multi-select and date ranges
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **🌙 Dark Mode**: Complete dark/light theme toggle
- **⚡ Real-time Updates**: Live data synchronization with hot module replacement
- **🎯 Modern Interface**: Beautiful UI with Tailwind CSS and Lucide icons
- **🍞 Toast Notifications**: User-friendly success/error notifications

### 🛠️ Technical Excellence
- **🔄 Full CRUD Operations**: Complete data management for all entities
- **🚀 RESTful API**: Well-structured, documented API endpoints
- **💾 Normalized Database**: Properly structured SQLite with foreign keys
- **🔗 API Integration**: Robust Axios-based HTTP client with error handling
- **🎯 Component Architecture**: Modular React components with custom hooks
- **🚦 State Management**: Context-based authentication and app state
- **🔄 Hot Reloading**: Instant development feedback with Vite
- **📦 Bulk Operations**: Multi-select actions for efficient data management

## 🔐 Authentication & Roles

### 🎭 User Roles Overview

The system implements a comprehensive 4-tier role-based access control system:

| Role | Icon | Access Level | Primary Focus |
|------|------|-------------|---------------|
| **Admin** | 🔑 | Full System Access | User management, system configuration, all data |
| **Manager** | 📊 | Team & Project Management | Team oversight, project management, analytics |
| **Sales Rep** | 💼 | Customer-Focused | Customer relationships, limited project visibility |
| **Developer** | 🎧 | Support-Focused | Feedback management, task tracking |

### 🔑 Default Login Credentials

The system comes with pre-configured demo accounts for testing:

- **Admin Access**: `admin` / `admin123`
- **Manager Access**: `manager1` / `manager123`  
- **Sales Rep Access**: `sales1` / `sales123`
- **Developer Access**: `dev1` / `dev123`

### 🛡️ Security Features

- **JWT Tokens**: 24-hour expiration with secure payload
- **Password Hashing**: bcrypt with 12 salt rounds
- **Route Protection**: Both API and frontend route guards
- **Session Management**: Automatic token validation and cleanup
- **CORS Security**: Configured for development and production
- **SQL Injection Protection**: Parameterized queries throughout

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with dark mode
- **Lucide React** - Beautiful, consistent icon library
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Beautiful toast notifications
- **Recharts** - Responsive chart library for analytics

### Backend
- **Node.js** - JavaScript runtime environment
- **Express 5** - Fast, minimalist web framework
- **SQLite3** - Lightweight, embedded database
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcrypt** - Password hashing and encryption
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database Architecture
- **Normalized Schema** - Properly structured with foreign keys
- **Role Permissions** - Database-driven access control
- **User Sessions** - JWT token management
- **Data Relationships** - Complex entity relationships
- **Migration System** - Seamless schema updates

## 📁 Project Structure

```
crm2/
├── 🎨 startup-crm/                 # Frontend React Application
│   ├── 📦 public/                  # Static assets
│   ├── 🧩 src/
│   │   ├── 🎭 components/
│   │   │   ├── StartupCRM.jsx      # Main CRM component
│   │   │   ├── LoginPage.jsx       # Authentication login page
│   │   │   ├── ProtectedRoute.jsx  # Route protection wrapper
│   │   │   ├── UserHeader.jsx      # User profile header
│   │   │   ├── Analytics.jsx       # Analytics dashboard
│   │   │   ├── CompaniesView.jsx   # Companies management
│   │   │   ├── ContactsView.jsx    # Contacts management
│   │   │   └── ToastProvider.jsx   # Notification system
│   │   ├── 🔐 contexts/
│   │   │   └── AuthContext.jsx     # Authentication context
│   │   ├── 🎣 hooks/
│   │   │   └── useDarkMode.js      # Dark mode hook
│   │   ├── 🔧 services/
│   │   │   ├── api.js              # Legacy API service
│   │   │   └── enhancedApi.js      # Enhanced API with auth
│   │   ├── 🛠️ utils/
│   │   │   └── export.js           # Data export utilities
│   │   ├── 🎨 assets/              # Images and assets
│   │   ├── App.jsx                 # Root component with auth
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles with dark mode
│   ├── 📄 package.json             # Frontend dependencies
│   ├── ⚙️ vite.config.js           # Vite configuration
│   ├── 🎨 tailwind.config.js       # Tailwind CSS config
│   └── 📋 postcss.config.js        # PostCSS configuration
│
├── 🖥️ backend/                     # Backend API Server
│   ├── 🗄️ database.js             # Legacy database schema
│   ├── 🗄️ enhanced-database.js    # Normalized database schema
│   ├── 🔐 auth-schema.js          # Authentication tables
│   ├── 🔐 auth-middleware.js      # JWT & permission middleware
│   ├── 🔐 auth-routes.js          # Authentication API routes
│   ├── 🔐 auth-sample-data.js     # Sample users & permissions
│   ├── 🛣️ routes.js               # Legacy API routes
│   ├── 🛣️ enhanced-routes.js      # Enhanced API with joins
│   ├── 🖥️ server.js               # Express server with auth
│   ├── 🌱 seed.js                 # Legacy sample data
│   ├── 🌱 sample-data.js          # Enhanced sample data
│   ├── 💾 crm.db                  # SQLite database file
│   └── 📄 package.json            # Backend dependencies
│
└── 📖 README.md                   # This comprehensive guide
```

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd crm2
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../startup-crm
npm install
```

### 4. Initialize Database (Optional)
```bash
cd ../backend
node seed.js  # Populates database with sample data
```

## 🎯 Running the Application

### Option 1: Run Both Servers Manually

#### Terminal 1 - Start Backend Server
```bash
cd backend
npm start
```
✅ Backend will run on: **http://localhost:3001**

#### Terminal 2 - Start Frontend Server
```bash
cd startup-crm
npm run dev
```
✅ Frontend will run on: **http://localhost:5173** (or next available port)

### Option 2: Quick Start Script
```bash
# In project root, run both commands in separate terminals:
cd backend && npm start
cd startup-crm && npm run dev
```

## 👥 User Roles & Permissions

### 🔑 Admin Role - Full System Access
**Username**: `admin` | **Password**: `admin123`

**Capabilities:**
- ✅ **Full CRUD Access**: All entities (companies, contacts, feedbacks, projects, tasks, team members)
- ✅ **User Management**: Create, edit, delete users and manage roles
- ✅ **System Settings**: Access to system configuration and maintenance tools
- ✅ **Advanced Analytics**: Full reporting and analytics dashboard
- ✅ **Data Export**: All export formats (CSV, JSON) for all data
- ✅ **Bulk Operations**: Multi-select delete, edit, and export operations

**Dashboard View**: All sections visible with full functionality

### 📊 Manager Role - Team & Project Management
**Username**: `manager1` | **Password**: `manager123`

**Capabilities:**
- ✅ **Team Oversight**: View and manage all team member activities
- ✅ **Customer Data**: Full access to companies and contacts
- ✅ **Project Management**: Create, edit, and delete projects
- ✅ **Task Assignment**: Create and assign tasks to team members
- ✅ **Analytics Access**: Limited analytics focused on team performance
- ✅ **Data Export**: Export companies, contacts, and project data
- ❌ **User Management**: Cannot create or delete users

**Dashboard View**: Companies, Contacts, Feedbacks (read), Projects, Tasks, Team Members, Analytics

### 💼 Sales Rep Role - Customer-Focused
**Username**: `sales1` | **Password**: `sales123`

**Capabilities:**
- ✅ **Customer Management**: Full access to assigned companies and contacts
- ✅ **Feedback Viewing**: Read customer feedback related to their accounts
- ✅ **Task Management**: View and update tasks assigned to them
- ✅ **Limited Projects**: Read-only access to relevant projects
- ✅ **Personal Analytics**: View their own performance metrics
- ❌ **Team Management**: Cannot access other team members' data
- ❌ **System Settings**: No access to admin tools

**Dashboard View**: Companies, Contacts, Feedbacks (read-only), Projects (read-only), Tasks (limited), Analytics (personal)

### 🎧 Developer Role - Support-Focused
**Username**: `dev1` | **Password**: `dev123`

**Capabilities:**
- ✅ **Feedback Management**: Full CRUD access to customer feedback
- ✅ **Support Tickets**: Manage feedback as support tickets
- ✅ **Task Tracking**: View and update support-related tasks
- ✅ **Customer History**: Read-only access to customer communication history
- ✅ **Feedback Analytics**: Analytics focused on support metrics
- ❌ **Customer Management**: Cannot edit company or contact information
- ❌ **Project Management**: No project creation or management access

**Dashboard View**: Feedbacks, Tasks (support-related), Feedback Project Links, Analytics (support metrics)

### 🔐 Permission Matrix

| Feature | Admin | Manager | Sales Rep | Developer |
|---------|-------|---------|-----------|-----------|
| **Companies** | Full CRUD | Read/Update | Read/Update (assigned) | Read Only |
| **Contacts** | Full CRUD | Read/Update | Create/Read/Update | Read Only |
| **Feedbacks** | Full CRUD | Read/Update | Read Only | Full CRUD |
| **Projects** | Full CRUD | Full CRUD | Read Only | Read Only |
| **Tasks** | Full CRUD | Full CRUD | Read/Update (own) | Read/Update |
| **Team Members** | Full CRUD | Read/Update | No Access | No Access |
| **Analytics** | Full Access | Team Analytics | Personal Analytics | Support Analytics |
| **Data Export** | All Data | Limited Data | No Export | Feedback Data |
| **User Management** | Full Access | No Access | No Access | No Access |
| **System Settings** | Full Access | No Access | No Access | No Access |

## 📖 Usage Guide

### 🏠 Dashboard Overview
Access the application at **http://localhost:5173** to see:
- **5 Main Sections**: Feedbacks, Projects, Team Members, Tasks, Feedback Project Links
- **Global Search Bar**: Search across all sections
- **Add Entry Buttons**: Create new records in each section

### 📝 Managing Data

#### ➕ Adding New Records
1. Click **"Add entry"** button in any section
2. Fill out the modal form with required information
3. Click **"Save"** to create the record

#### ✏️ Editing Records
1. Click the **edit icon** (pencil) next to any record
2. Modify the information in the modal form
3. Click **"Save"** to update the record

#### 🔍 Searching and Filtering
- **Global Search**: Use the top search bar to search across all sections
- **Section Search**: Use individual search bars in each section
- **Status Filters**: Use dropdown filters to show specific statuses
- **Type Filters**: Filter feedback by type (Bug, Feature Request, etc.)

### 📊 Section Details

#### 📝 Feedbacks
- **Fields**: Title, Type, Description, Urgency, Status, Email, Created Date
- **Types**: Bug, Feature Request, Comment, Incident
- **Urgency Levels**: Critical, High, Medium, Low
- **Statuses**: Open, Under Review, In Progress, Closed, Under Investigation

#### 📋 Projects
- **Fields**: Name, Description, Start Date, End Date, Status
- **Statuses**: Planned, In Progress, Completed

#### 👥 Team Members
- **Fields**: Name, Role, Email, Phone, Notes

#### ✅ Tasks
- **Fields**: Name, Description, Due Date, Status, Project Assignment, Team Member Assignment
- **Relationships**: Links to specific projects and team members

#### 🔗 Feedback Project Links
- **Purpose**: Connect customer feedback to relevant projects
- **Fields**: Feedback Title, Project Assignment, Notes

## 🔌 API Documentation

### Base URL
```
http://localhost:3001/api
```

### 🔐 Authentication Endpoints
```http
POST   /api/auth/login              # User login
POST   /api/auth/logout             # User logout
GET    /api/auth/profile            # Get current user profile
PUT    /api/auth/profile            # Update user profile
PUT    /api/auth/change-password    # Change password
GET    /api/auth/users              # Get all users (Admin only)
POST   /api/auth/users              # Create new user (Admin only)
PUT    /api/auth/users/:id          # Update user (Admin only)
DELETE /api/auth/users/:id          # Delete user (Admin only)
GET    /api/auth/permissions/:role  # Get role permissions
```

### 🔑 Authentication Headers
All protected endpoints require JWT token in Authorization header:
```http
Authorization: Bearer <jwt_token>
```

### 📝 Feedbacks Endpoints
```http
GET    /api/feedbacks           # Get all feedbacks
POST   /api/feedbacks           # Create new feedback
PUT    /api/feedbacks/:id       # Update feedback
DELETE /api/feedbacks/:id       # Delete feedback
```

### 📋 Projects Endpoints
```http
GET    /api/projects            # Get all projects
POST   /api/projects            # Create new project
PUT    /api/projects/:id        # Update project
DELETE /api/projects/:id        # Delete project
```

### 👥 Team Members Endpoints
```http
GET    /api/team-members        # Get all team members
POST   /api/team-members        # Create new team member
PUT    /api/team-members/:id    # Update team member
DELETE /api/team-members/:id    # Delete team member
```

### ✅ Tasks Endpoints
```http
GET    /api/tasks               # Get all tasks
POST   /api/tasks               # Create new task
PUT    /api/tasks/:id           # Update task
DELETE /api/tasks/:id           # Delete task
```

### 🔗 Feedback Project Links Endpoints
```http
GET    /api/feedback-project-links     # Get all links
POST   /api/feedback-project-links     # Create new link
PUT    /api/feedback-project-links/:id # Update link
DELETE /api/feedback-project-links/:id # Delete link
```

### 🏥 Health Check
```http
GET    /health                  # Server health status
```

## 🗄️ Database Schema

### 🔐 Authentication Tables

#### `users`
```sql
user_id INTEGER PRIMARY KEY AUTOINCREMENT
username VARCHAR(50) NOT NULL UNIQUE
email VARCHAR(100) NOT NULL UNIQUE
password_hash VARCHAR(255) NOT NULL
role VARCHAR(20) NOT NULL DEFAULT 'Sales Rep'
first_name VARCHAR(50)
last_name VARCHAR(50)
is_active BOOLEAN DEFAULT 1
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
last_login TIMESTAMP
```

#### `user_sessions`
```sql
session_id INTEGER PRIMARY KEY AUTOINCREMENT
user_id INTEGER NOT NULL
token_hash VARCHAR(255) NOT NULL
expires_at TIMESTAMP NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
is_active BOOLEAN DEFAULT 1
FOREIGN KEY (user_id) REFERENCES users(user_id)
```

#### `role_permissions`
```sql
permission_id INTEGER PRIMARY KEY AUTOINCREMENT
role VARCHAR(20) NOT NULL
resource VARCHAR(50) NOT NULL
action VARCHAR(20) NOT NULL
UNIQUE(role, resource, action)
```

#### `user_assignments`
```sql
assignment_id INTEGER PRIMARY KEY AUTOINCREMENT
user_id INTEGER NOT NULL
entity_type VARCHAR(20) NOT NULL
entity_id INTEGER NOT NULL
assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
FOREIGN KEY (user_id) REFERENCES users(user_id)
```

### 🏢 Enhanced Business Tables

#### `companies`
```sql
company_id INTEGER PRIMARY KEY AUTOINCREMENT
company_name VARCHAR(255) NOT NULL
website VARCHAR(255)
industry VARCHAR(100)
status VARCHAR(20) CHECK(status IN ('Lead', 'Active Customer', 'Churned', 'Prospect'))
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `contacts`
```sql
contact_id INTEGER PRIMARY KEY AUTOINCREMENT
first_name VARCHAR(100)
last_name VARCHAR(100)
email VARCHAR(255) NOT NULL UNIQUE
phone VARCHAR(20)
role_at_company VARCHAR(100)
company_id INTEGER
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
FOREIGN KEY (company_id) REFERENCES companies(company_id)
```

### 📊 Legacy Tables (for backward compatibility)

#### `feedbacks`
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
title TEXT NOT NULL
type TEXT
description TEXT
urgency TEXT
status TEXT
email TEXT
created_date TEXT
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `projects`
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
name TEXT NOT NULL
description TEXT
start_date TEXT
end_date TEXT
status TEXT
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `team_members`
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
name TEXT NOT NULL
role TEXT
email TEXT
phone TEXT
notes TEXT
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `tasks`
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
name TEXT NOT NULL
description TEXT
due_date TEXT
status TEXT
project_id INTEGER
assigned_member_id INTEGER
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
FOREIGN KEY (project_id) REFERENCES projects (id)
FOREIGN KEY (assigned_member_id) REFERENCES team_members (id)
```

#### `feedback_project_links`
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
feedback_title TEXT
project_id INTEGER
notes TEXT
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
FOREIGN KEY (project_id) REFERENCES projects (id)
```

## 🔧 Development

### 🛠️ Available Scripts

#### Frontend (startup-crm/)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Backend (backend/)
```bash
npm start        # Start production server
npm run dev      # Start development server
```

### 🏗️ Building for Production

#### Frontend Build
```bash
cd startup-crm
npm run build
```
The built files will be in the `dist/` directory.

#### Backend Deployment
The backend is production-ready as-is. Just ensure:
- Environment variables are properly set (especially JWT_SECRET)
- Database file permissions are correct
- Port 3001 is available (or configure different port)
- SSL/HTTPS configured for production JWT usage

## 🔒 Security Features

### 🛡️ Authentication Security
- **JWT Tokens**: Stateless authentication with 24-hour expiration
- **Password Hashing**: bcrypt with 12 salt rounds for maximum security
- **Session Management**: Automatic token cleanup and validation
- **Account Lockout**: Protection against brute force attacks
- **Secure Headers**: CORS and security headers configured

### 🔐 Authorization & Access Control
- **Role-Based Permissions**: Database-driven permission system
- **Route Protection**: Both API and frontend route guards
- **Data Filtering**: Users only see data they're authorized to access
- **Permission Granularity**: Create, Read, Update, Delete, Export permissions
- **Dynamic UI**: Interface adapts based on user permissions

### 🛠️ Data Security
- **SQL Injection Protection**: Parameterized queries throughout
- **Input Validation**: Frontend and backend validation
- **Data Encryption**: Sensitive data properly encrypted
- **Audit Trail**: User activity logging and session tracking
- **Backup Safety**: Secure database backup procedures

### 🌐 Network Security
- **CORS Configuration**: Properly configured cross-origin policies
- **Environment Variables**: Sensitive data in environment files
- **API Rate Limiting**: Protection against API abuse (production ready)
- **HTTPS Ready**: SSL/TLS certificate support for production

### 🔍 Security Best Practices
- **Principle of Least Privilege**: Users have minimum required permissions
- **Defense in Depth**: Multiple layers of security
- **Regular Token Rotation**: Automatic token expiration
- **Secure Development**: Security-first development approach
- **Production Hardening**: Ready for enterprise deployment

### 🔄 Database Management

#### Reset Database
```bash
cd backend
rm crm.db          # Remove existing database
node database.js   # Recreate tables
node seed.js       # Add sample data
```

#### Backup Database
```bash
cd backend
cp crm.db crm_backup_$(date +%Y%m%d).db
```

## 🐛 Troubleshooting

### Common Issues

#### 🔴 "ECONNREFUSED" Error
**Problem**: Frontend can't connect to backend
**Solution**:
1. Ensure backend is running on port 3001
2. Check backend logs for errors
3. Verify CORS configuration

#### 🔴 "Port already in use"
**Problem**: Port 3001 or 5173 is already occupied
**Solution**:
```bash
# Kill processes on ports
lsof -ti:3001 | xargs kill -9  # Kill backend
lsof -ti:5173 | xargs kill -9  # Kill frontend
```

#### 🔴 Database Errors
**Problem**: SQLite database issues
**Solution**:
1. Check file permissions on `crm.db`
2. Reinitialize database:
   ```bash
   cd backend
   rm crm.db
   node database.js
   ```

#### 🔴 Modal Forms Not Opening
**Problem**: Add entry buttons don't show forms
**Solution**:
1. Check browser console for JavaScript errors
2. Ensure all dependencies are installed
3. Restart development server

#### 🔴 Tailwind Styles Not Loading
**Problem**: CSS styles not applying
**Solution**:
1. Verify `postcss.config.js` exists
2. Check `tailwind.config.js` configuration
3. Restart development server

### 🔍 Debug Mode

Enable debug logging:

#### Backend Debug
```bash
cd backend
DEBUG=* npm start
```

#### Frontend Debug
Check browser developer tools console for detailed logs.

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For support, please:
1. Check this README for common issues
2. Review the troubleshooting section
3. Check the browser console for errors
4. Open an issue with detailed error information

---

## 🎉 Quick Start Summary

1. **Install dependencies**: `cd backend && npm install && cd ../startup-crm && npm install`
2. **Start backend**: `cd backend && npm start`
3. **Start frontend**: `cd startup-crm && npm run dev`
4. **Open browser**: Visit `http://localhost:5173` (or next available port)
5. **Login**: Use any of the demo credentials:
   - **Admin**: `admin` / `admin123` (Full access)
   - **Manager**: `manager1` / `manager123` (Team management)
   - **Sales Rep**: `sales1` / `sales123` (Customer focused)
   - **Developer**: `dev1` / `dev123` (Support focused)
6. **Explore**: Each role sees a different dashboard with appropriate permissions!

### 🌟 Key Features to Try
- **Role-Based Dashboard**: Login with different roles to see the adaptive interface
- **Dark Mode Toggle**: Click the moon/sun icon in the top navigation
- **Analytics Dashboard**: Click "Analytics" to see role-specific insights
- **Data Export**: Use the "Export" button (if you have permissions)
- **User Profile**: Click your user avatar to see role information and logout

### 🔐 Enterprise Features
- **Secure Authentication**: JWT-based with bcrypt password hashing
- **Dynamic Permissions**: Interface adapts to your role automatically
- **Data Security**: Users only see data they're authorized to access
- **Professional UI**: Clean, modern interface with dark mode support

**Welcome to Enterprise-Grade CRM!** 🚀✨🏢

