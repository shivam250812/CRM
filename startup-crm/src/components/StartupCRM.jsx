import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, Filter, ArrowLeft, Mail, Phone, Calendar, CheckSquare, AlertCircle, User, Briefcase, MessageSquare, Link, Moon, Sun, Download, BarChart3, Settings, Trash2, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import enhancedApi from '../services/enhancedApi';
import Analytics from './Analytics';
import CompaniesView from './CompaniesView';
import ContactsView from './ContactsView';
import UserHeader from './UserHeader';
import { useAuth } from '../contexts/AuthContext';
import useDarkMode from '../hooks/useDarkMode';
import { exportToCSV, exportToJSON, generateReportData } from '../utils/export';

const Modal = React.memo(({
  showModal,
  modalType,
  editingItem,
  formData,
  projects,
  teamMembers,
  feedbacks,
  onClose,
  onSave,
  handleInputChange,
  handleSelectChange
}) => {
  if (!showModal) {
    return null;
  }

  const renderForm = () => {
    switch (modalType) {
      case 'feedback':
        return (
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Feedback Title"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.title || ''}
              onChange={handleInputChange('title')}
            />
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.type || ''}
              onChange={handleSelectChange('type')}
            >
              <option value="">Select Type</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Usability Issue">Usability Issue</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
            <textarea
              placeholder="Description"
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows="3"
              value={formData.description || ''}
              onChange={handleInputChange('description')}
            />
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.urgency || ''}
              onChange={handleSelectChange('urgency')}
            >
              <option value="">Select Urgency</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.status || ''}
              onChange={handleSelectChange('status')}
            >
              <option value="">Select Status</option>
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Won't Fix">Won't Fix</option>
            </select>
            <input
              type="email"
              placeholder="Contact Email"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.email || ''}
              onChange={handleInputChange('email')}
            />
            <input
              type="date"
              placeholder="Created Date"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.created || ''}
              onChange={handleInputChange('created')}
            />
          </form>
        );
             case 'project':
         return (
           <form className="space-y-4">
             <input
               type="text"
               placeholder="Project Name"
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.name || ''}
               onChange={handleInputChange('name')}
             />
             <textarea
               placeholder="Description"
               className="w-full p-2 border border-gray-300 rounded-lg"
               rows="3"
               value={formData.description || ''}
               onChange={handleInputChange('description')}
             />
             <input
               type="date"
               placeholder="Start Date"
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.startDate || ''}
               onChange={handleInputChange('startDate')}
             />
             <input
               type="date"
               placeholder="End Date"
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.endDate || ''}
               onChange={handleInputChange('endDate')}
             />
             <select
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.status || ''}
               onChange={handleSelectChange('status')}
             >
               <option value="">Select Status</option>
               <option value="Not Started">Not Started</option>
               <option value="In Progress">In Progress</option>
               <option value="Completed">Completed</option>
               <option value="On Hold">On Hold</option>
               <option value="Cancelled">Cancelled</option>
             </select>
           </form>
         );

       case 'team':
         return (
           <form className="space-y-4">
             <input
               type="text"
               placeholder="Member Name"
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.name || ''}
               onChange={handleInputChange('name')}
             />
             <input
               type="text"
               placeholder="Role"
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.role || ''}
               onChange={handleInputChange('role')}
             />
             <input
               type="email"
               placeholder="Email"
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.email || ''}
               onChange={handleInputChange('email')}
             />
             <input
               type="tel"
               placeholder="Phone"
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.phone || ''}
               onChange={handleInputChange('phone')}
             />
             <textarea
               placeholder="Notes"
               className="w-full p-2 border border-gray-300 rounded-lg"
               rows="3"
               value={formData.notes || ''}
               onChange={handleInputChange('notes')}
             />
           </form>
         );

       case 'task':
         return (
           <form className="space-y-4">
             <input
               type="text"
               placeholder="Task Name"
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.name || ''}
               onChange={handleInputChange('name')}
             />
             <textarea
               placeholder="Description"
               className="w-full p-2 border border-gray-300 rounded-lg"
               rows="3"
               value={formData.description || ''}
               onChange={handleInputChange('description')}
             />
             <input
               type="date"
               placeholder="Due Date"
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.dueDate || ''}
               onChange={handleInputChange('dueDate')}
             />
             <select
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.status || ''}
               onChange={handleSelectChange('status')}
             >
               <option value="">Select Status</option>
               <option value="To Do">To Do</option>
               <option value="In Progress">In Progress</option>
               <option value="In Review">In Review</option>
               <option value="Done">Done</option>
             </select>
             <select
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.priority || ''}
               onChange={handleSelectChange('priority')}
             >
               <option value="">Select Priority</option>
               <option value="Low">Low</option>
               <option value="Medium">Medium</option>
               <option value="High">High</option>
             </select>
             <select
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.project || ''}
               onChange={handleSelectChange('project')}
             >
               <option value="">Select Project</option>
               {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
             </select>
             <select
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.assignedMember || ''}
               onChange={handleSelectChange('assignedMember')}
             >
               <option value="">Select Team Member</option>
               {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
             </select>
           </form>
         );

       case 'feedbackLink':
         return (
           <form className="space-y-4">
             <select
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.feedback || ''}
               onChange={handleSelectChange('feedback')}
             >
               <option value="">Select Feedback</option>
               {feedbacks.map(f => <option key={f.id} value={f.title}>{f.title}</option>)}
             </select>
             <select
               className="w-full p-2 border border-gray-300 rounded-lg"
               value={formData.project || ''}
               onChange={handleSelectChange('project')}
             >
               <option value="">Select Project</option>
               {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
             </select>
             <textarea
               placeholder="Notes"
               className="w-full p-2 border border-gray-300 rounded-lg"
               rows="3"
               value={formData.notes || ''}
               onChange={handleInputChange('notes')}
             />
           </form>
         );

       default:
         return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
        </h2>
        {renderForm()}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose} // Use the onClose prop
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave} // Use the onSave prop
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editingItem ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
});

// Main StartupCRM component
const StartupCRM = () => {
  // Authentication
  const { user, hasPermission, hasRole } = useAuth();
  
  // State for different sections
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Dark mode hook
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  
  // Bulk actions state
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Search state for different views
  const [searchTerms, setSearchTerms] = useState({
    feedbacks: '',
    projects: '',
    team: '',
    tasks: '',
    feedbackLinks: '',
    global: ''
  });
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data from database
  const [feedbacks, setFeedbacks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [feedbackProjectLinks, setFeedbackProjectLinks] = useState([]);

  // API functions to load data from database
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading data from enhanced API...');
      const [feedbacksRes, projectsRes, teamMembersRes, tasksRes, feedbackLinksRes] = await Promise.all([
        enhancedApi.enhancedFeedbacks.getAll(),
        enhancedApi.enhancedProjects.getAll(),
        enhancedApi.enhancedTeamMembers.getAll(),
        enhancedApi.enhancedTasks.getAll(),
        enhancedApi.enhancedFeedbackProjectLinks.getAll()
      ]);
      console.log('Enhanced API responses:', { feedbacksRes, projectsRes, teamMembersRes, tasksRes, feedbackLinksRes });

      // Transform feedbacks data (API returns {data: [...]} structure)
      const feedbacksData = feedbacksRes.data?.data || feedbacksRes.data || [];
      setFeedbacks(feedbacksData.map(feedback => ({
        id: feedback.feedback_id,
        title: feedback.feedback_title,
        type: feedback.feedback_type,
        description: feedback.description,
        urgency: feedback.urgency,
        status: feedback.resolution_status,
        email: feedback.contact_email,
        created: feedback.created_at ? feedback.created_at.split('T')[0] : ''
      })));

      // Transform projects data
      const projectsData = projectsRes.data?.data || projectsRes.data || [];
      setProjects(projectsData.map(project => ({
        id: project.project_id,
        name: project.project_name,
        description: project.description,
        startDate: project.start_date,
        endDate: project.end_date,
        status: project.status
      })));

      // Transform team members data
      const teamMembersData = teamMembersRes.data?.data || teamMembersRes.data || [];
      setTeamMembers(teamMembersData.map(member => ({
        id: member.member_id,
        name: member.member_name,
        role: member.role,
        email: member.email,
        phone: member.phone
      })));

      // Transform tasks data
      const tasksData = tasksRes.data?.data || tasksRes.data || [];
      setTasks(tasksData.map(task => ({
        id: task.task_id,
        name: task.task_name,
        description: task.description,
        dueDate: task.due_date,
        status: task.status,
        priority: task.priority,
        project: task.project_name || 'N/A',
        assignedMember: task.assigned_member_name || 'Unassigned'
      })));

      // Transform feedback project links data
      const feedbackLinksData = feedbackLinksRes.data?.data || feedbackLinksRes.data || [];
      
      setFeedbackProjectLinks(feedbackLinksData.map(link => ({
        id: `${link.feedback_id}-${link.project_id}`, // Composite ID
        feedback_id: link.feedback_id,
        project_id: link.project_id,
        feedback: link.feedback_title || 'N/A',
        project: link.project_name || 'N/A',
        notes: link.notes || ''
      })));
    } catch (err) {
      setError('Failed to load data: ' + err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Helper functions for CRUD operations
  const openAddModal = (type) => {
    setModalType(type);
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setFormData({...item});
    setShowModal(true);
  };

  const handleSave = async () => {
    const toastId = toast.loading('Saving...');
    setLoading(true);
    try {
      switch (modalType) {
        case 'feedback':
          console.log('Feedback form data:', formData);
          const feedbackData = {
            feedback_title: formData.title,
            feedback_type: formData.type,
            description: formData.description,
            urgency: formData.urgency,
            resolution_status: formData.status || 'New',
            source: formData.source || 'Manual Entry',
            email: formData.email
          };
          console.log('Creating feedback with data:', feedbackData);
          
          if (editingItem) {
            await enhancedApi.enhancedFeedbacks.update(editingItem.id, {
              feedback_title: formData.title,
              feedback_type: formData.type,
              description: formData.description,
              urgency: formData.urgency,
              resolution_status: formData.status,
              source: formData.source || 'Manual Entry',
              contact_id: formData.contact_id
            });
          } else {
            await enhancedApi.enhancedFeedbacks.create(feedbackData);
          }
          break;
        case 'project':
          console.log('Project form data:', formData);
          const projectData = {
            project_name: formData.name,
            description: formData.description,
            start_date: formData.startDate,
            end_date: formData.endDate,
            status: formData.status || 'Not Started'
          };
          console.log('Creating project with data:', projectData);
          
          if (editingItem) {
            await enhancedApi.enhancedProjects.update(editingItem.id, projectData);
          } else {
            await enhancedApi.enhancedProjects.create(projectData);
          }
          break;
        case 'team':
          if (editingItem) {
            await enhancedApi.enhancedTeamMembers.update(editingItem.id, {
              member_name: formData.name,
              role: formData.role,
              email: formData.email,
              phone: formData.phone
            });
          } else {
            await enhancedApi.enhancedTeamMembers.create({
              member_name: formData.name,
              role: formData.role,
              email: formData.email,
              phone: formData.phone
            });
          }
          break;
        case 'task':
          const projectId = projects.find(p => p.name === formData.project)?.id;
          const memberId = teamMembers.find(m => m.name === formData.assignedMember)?.id;
          
          console.log('Task form data:', formData);
          console.log('Available projects:', projects.map(p => ({id: p.id, name: p.name})));
          console.log('Available team members:', teamMembers.map(m => ({id: m.id, name: m.name})));
          console.log('Selected project ID:', projectId, 'for project:', formData.project);
          console.log('Selected member ID:', memberId, 'for member:', formData.assignedMember);
          
          if (editingItem) {
            await enhancedApi.enhancedTasks.update(editingItem.id, {
              task_name: formData.name,
              description: formData.description,
              due_date: formData.dueDate,
              status: formData.status,
              priority: formData.priority || 'Medium',
              project_id: projectId,
              assigned_member_id: memberId
            });
          } else {
            const taskData = {
              task_name: formData.name,
              description: formData.description,
              due_date: formData.dueDate,
              status: formData.status || 'To Do',
              priority: formData.priority || 'Medium',
              project_id: projectId,
              assigned_member_id: memberId
            };
            console.log('Creating task with data:', taskData);
            await enhancedApi.enhancedTasks.create(taskData);
          }
          break;
        case 'feedbackLink':
          const linkProjectId = projects.find(p => p.name === formData.project)?.id;
          // Find feedback by title
          const linkFeedbackId = feedbacks.find(f => f.title === formData.feedback)?.id;
          
          console.log('Feedback Link form data:', formData);
          console.log('Available projects:', projects.map(p => ({id: p.id, name: p.name})));
          console.log('Available feedbacks:', feedbacks.map(f => ({id: f.id, title: f.title})));
          console.log('Selected project ID:', linkProjectId, 'for project:', formData.project);
          console.log('Selected feedback ID:', linkFeedbackId, 'for feedback:', formData.feedback);
          
          // Validate that both feedback and project are selected
          if (!linkFeedbackId) {
            throw new Error('Please select a feedback');
          }
          if (!linkProjectId) {
            throw new Error('Please select a project');
          }
          
          const linkData = {
            feedback_id: linkFeedbackId,
            project_id: linkProjectId,
            notes: formData.notes || ''
          };
          console.log('Creating feedback project link with data:', linkData);
          
          if (editingItem) {
            // For updates, we need to use the composite ID
            const [feedbackId, projectId] = editingItem.id.split('-');
            await enhancedApi.enhancedFeedbackProjectLinks.update(feedbackId, projectId, {
              notes: formData.notes
            });
          } else {
            await enhancedApi.enhancedFeedbackProjectLinks.create(linkData);
          }
          break;
      }
      
      // Reload data after successful save
      await loadAllData();
      setShowModal(false);
      toast.success(editingItem ? 'Updated successfully!' : 'Created successfully!', { id: toastId });
    } catch (err) {
      setError('Failed to save: ' + err.message);
      toast.error('Failed to save: ' + err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-red-100 text-red-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Closed': 'bg-green-100 text-green-800',
      'Planned': 'bg-purple-100 text-purple-800',
      'Under Investigation': 'bg-orange-100 text-orange-800',
      'completed': 'bg-green-100 text-green-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'planned': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-800',
      'High': 'bg-orange-100 text-orange-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };
    return colors[urgency] || 'bg-gray-100 text-gray-800';
  };

  // Simple form handlers
  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }, []);

  // Optimized callback functions to prevent re-renders
  const updateSearchTerm = useCallback((view, term) => {
    setSearchTerms(prev => ({
      ...prev,
      [view]: term
    }));
  }, []);

  // Optimized handler for select dropdowns
  const handleSelectChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }, []);

  // Export handlers
  const handleExportData = useCallback((type, format) => {
    try {
      let data, filename;
      
      switch (type) {
        case 'feedbacks':
          data = feedbacks;
          filename = 'feedbacks_export';
          break;
        case 'projects':
          data = projects;
          filename = 'projects_export';
          break;
        case 'tasks':
          data = tasks;
          filename = 'tasks_export';
          break;
        case 'team':
          data = teamMembers;
          filename = 'team_members_export';
          break;
        case 'all':
          data = generateReportData(feedbacks, projects, teamMembers, tasks);
          filename = 'crm_complete_report';
          break;
        default:
          throw new Error('Invalid export type');
      }

      if (format === 'csv') {
        exportToCSV(data, filename);
      } else if (format === 'json') {
        exportToJSON(data, filename);
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully!`);
    } catch (error) {
      toast.error('Export failed: ' + error.message);
    }
  }, [feedbacks, projects, teamMembers, tasks]);

  // Bulk actions handlers
  const handleSelectItem = useCallback((id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      setShowBulkActions(newSet.size > 0);
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((items, type) => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
      setShowBulkActions(true);
    }
  }, [selectedItems.size]);

  const handleBulkDelete = useCallback(async (type) => {
    if (selectedItems.size === 0) return;
    
    const toastId = toast.loading(`Deleting ${selectedItems.size} items...`);
    try {
      const promises = Array.from(selectedItems).map(id => {
        switch (type) {
          case 'feedbacks':
            return apiService.feedbacks.delete(id);
          case 'projects':
            return apiService.projects.delete(id);
          case 'tasks':
            return apiService.tasks.delete(id);
          case 'team':
            return apiService.teamMembers.delete(id);
          default:
            throw new Error('Invalid type');
        }
      });
      
      await Promise.all(promises);
      await loadAllData();
      setSelectedItems(new Set());
      setShowBulkActions(false);
      toast.success(`${selectedItems.size} items deleted successfully!`, { id: toastId });
    } catch (error) {
      toast.error('Bulk delete failed: ' + error.message, { id: toastId });
    }
  }, [selectedItems, loadAllData]);

  // Filter functions
  const filterFeedbacks = () => {
    return feedbacks.filter(feedback => {
      const searchTerm = searchTerms.feedbacks;
      const matchesSearch = !searchTerm || 
        feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filterStatus || feedback.status === filterStatus;
      const matchesType = !filterType || feedback.type === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  };

  const filterProjects = () => {
    return projects.filter(project => {
      const searchTerm = searchTerms.projects;
      const matchesSearch = !searchTerm || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filterStatus || project.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  };

  const filterTeamMembers = () => {
    return teamMembers.filter(member => {
      const searchTerm = searchTerms.team;
      const matchesSearch = !searchTerm || 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  };

  const filterTasks = () => {
    return tasks.filter(task => {
      const searchTerm = searchTerms.tasks;
      const matchesSearch = !searchTerm || 
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedMember.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filterStatus || task.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  };

  const filterFeedbackLinks = () => {
    return feedbackProjectLinks.filter(link => {
      const searchTerm = searchTerms.feedbackLinks;
      const matchesSearch = !searchTerm || 
        link.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.notes.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  };

  // Modal Component
  // const Modal = React.memo(() => {
  //   if (!showModal) return null;

  //   const renderForm = () => {
  //     switch (modalType) {
  //       case 'feedback':
  //         return (
  //           <form className="space-y-4">
  //             <input
  //               type="text"
  //               placeholder="Feedback Title"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.title || ''}
  //               onChange={handleInputChange('title')}
  //             />
  //             <select
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.type || ''}
  //               onChange={handleSelectChange('type')}
  //             >
  //               <option value="">Select Type</option>
  //               <option value="Bug">Bug</option>
  //               <option value="Feature Request">Feature Request</option>
  //               <option value="Comment">Comment</option>
  //               <option value="Incident">Incident</option>
  //             </select>
  //             <textarea
  //               placeholder="Description"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               rows="3"
  //               value={formData.description || ''}
  //               onChange={handleInputChange('description')}
  //             />
  //             <select
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.urgency || ''}
  //               onChange={handleSelectChange('urgency')}
  //             >
  //               <option value="">Select Urgency</option>
  //               <option value="Critical">Critical</option>
  //               <option value="High">High</option>
  //               <option value="Medium">Medium</option>
  //               <option value="Low">Low</option>
  //             </select>
  //             <select
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.status || ''}
  //               onChange={handleSelectChange('status')}
  //             >
  //               <option value="">Select Status</option>
  //               <option value="Open">Open</option>
  //               <option value="Under Review">Under Review</option>
  //               <option value="In Progress">In Progress</option>
  //               <option value="Closed">Closed</option>
  //               <option value="Under Investigation">Under Investigation</option>
  //             </select>
  //             <input
  //               type="email"
  //               placeholder="Contact Email"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.email || ''}
  //               onChange={handleInputChange('email')}
  //             />
  //             <input
  //               type="date"
  //               placeholder="Created Date"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.created || ''}
  //               onChange={handleInputChange('created')}
  //             />
  //           </form>
  //         );

  //       case 'project':
  //         return (
  //           <form className="space-y-4">
  //             <input
  //               type="text"
  //               placeholder="Project Name"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.name || ''}
  //               onChange={handleInputChange('name')}
  //             />
  //             <textarea
  //               placeholder="Description"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               rows="3"
  //               value={formData.description || ''}
  //               onChange={handleInputChange('description')}
  //             />
  //             <input
  //               type="date"
  //               placeholder="Start Date"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.startDate || ''}
  //               onChange={handleInputChange('startDate')}
  //             />
  //             <input
  //               type="date"
  //               placeholder="End Date"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.endDate || ''}
  //               onChange={handleInputChange('endDate')}
  //             />
  //             <select
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.status || ''}
  //               onChange={handleSelectChange('status')}
  //             >
  //               <option value="">Select Status</option>
  //               <option value="planned">Planned</option>
  //               <option value="in_progress">In Progress</option>
  //               <option value="completed">Completed</option>
  //             </select>
  //           </form>
  //         );

  //       case 'team':
  //         return (
  //           <form className="space-y-4">
  //             <input
  //               type="text"
  //               placeholder="Member Name"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.name || ''}
  //               onChange={handleInputChange('name')}
  //             />
  //             <input
  //               type="text"
  //               placeholder="Role"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.role || ''}
  //               onChange={handleInputChange('role')}
  //             />
  //             <input
  //               type="email"
  //               placeholder="Email"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.email || ''}
  //               onChange={handleInputChange('email')}
  //             />
  //             <input
  //               type="tel"
  //               placeholder="Phone"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.phone || ''}
  //               onChange={handleInputChange('phone')}
  //             />
  //             <textarea
  //               placeholder="Notes"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               rows="3"
  //               value={formData.notes || ''}
  //               onChange={handleInputChange('notes')}
  //             />
  //           </form>
  //         );

  //       case 'task':
  //         return (
  //           <form className="space-y-4">
  //             <input
  //               type="text"
  //               placeholder="Task Name"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.name || ''}
  //               onChange={handleInputChange('name')}
  //             />
  //             <textarea
  //               placeholder="Description"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               rows="3"
  //               value={formData.description || ''}
  //               onChange={handleInputChange('description')}
  //             />
  //             <input
  //               type="date"
  //               placeholder="Due Date"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.dueDate || ''}
  //               onChange={handleInputChange('dueDate')}
  //             />
  //             <select
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.status || ''}
  //               onChange={handleSelectChange('status')}
  //             >
  //               <option value="">Select Status</option>
  //               <option value="planned">Planned</option>
  //               <option value="in_progress">In Progress</option>
  //               <option value="completed">Completed</option>
  //             </select>
  //             <select
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.project || ''}
  //               onChange={handleSelectChange('project')}
  //             >
  //               <option value="">Select Project</option>
  //               {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
  //             </select>
  //             <select
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.assignedMember || ''}
  //               onChange={handleSelectChange('assignedMember')}
  //             >
  //               <option value="">Select Team Member</option>
  //               {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
  //             </select>
  //           </form>
  //         );

  //       case 'feedbackLink':
  //         return (
  //           <form className="space-y-4">
  //             <input
  //               type="text"
  //               placeholder="Feedback Title or Description"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.feedback || ''}
  //               onChange={handleInputChange('feedback')}
  //             />
  //             <select
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               value={formData.project || ''}
  //               onChange={handleSelectChange('project')}
  //             >
  //               <option value="">Select Project</option>
  //               {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
  //             </select>
  //             <textarea
  //               placeholder="Notes"
  //               className="w-full p-2 border border-gray-300 rounded-lg"
  //               rows="3"
  //               value={formData.notes || ''}
  //               onChange={handleInputChange('notes')}
  //             />
  //           </form>
  //         );

  //       default:
  //         return null;
  //     }
  //   };

  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  //       <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
  //         <h2 className="text-xl font-bold mb-4">
  //           {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
  //         </h2>
  //         {renderForm()}
  //         <div className="flex justify-end space-x-3 mt-6">
  //           <button
  //             onClick={() => setShowModal(false)}
  //             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             onClick={handleSave}
  //             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  //           >
  //             {editingItem ? 'Update' : 'Save'}
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // });

  // Filter dashboard sections based on user role
  const getDashboardSections = () => {
    const sections = [];

    // Companies (Admin, Manager, Sales Rep)
    if (hasRole(['Admin', 'Manager', 'Sales Rep'])) {
      sections.push({
        key: 'companies',
        title: 'Companies',
        icon: Building2,
        color: 'text-indigo-600',
        view: 'companies'
      });
    }

    // Contacts (Admin, Manager, Sales Rep)
    if (hasRole(['Admin', 'Manager', 'Sales Rep'])) {
      sections.push({
        key: 'contacts',
        title: 'Contacts',
        icon: User,
        color: 'text-purple-600',
        view: 'contacts'
      });
    }

    // Feedbacks (all roles)
    sections.push({
      key: 'feedbacks',
      title: 'Feedbacks',
      icon: MessageSquare,
      color: 'text-blue-600',
      view: 'feedbacks'
    });

    // Projects (Admin, Manager, limited for Sales Rep)
    if (hasRole(['Admin', 'Manager', 'Sales Rep'])) {
      sections.push({
        key: 'projects',
        title: 'Projects',
        icon: Briefcase,
        color: 'text-green-600',
        view: 'projects'
      });
    }

    // Team Members (Admin, Manager)
    if (hasRole(['Admin', 'Manager'])) {
      sections.push({
        key: 'team',
        title: 'Team Members',
        icon: User,
        color: 'text-orange-600',
        view: 'team'
      });
    }

    // Tasks (all roles)
    sections.push({
      key: 'tasks',
      title: 'Tasks',
      icon: CheckSquare,
      color: 'text-purple-600',
      view: 'tasks'
    });

    // Feedback Project Links (Admin, Manager, Developer)
    if (hasRole(['Admin', 'Manager', 'Developer'])) {
      sections.push({
        key: 'feedbackLinks',
        title: 'Feedback Project Links',
        icon: Link,
        color: 'text-pink-600',
        view: 'feedbackLinks'
      });
    }

    return sections;
  };

  // Dashboard View
  const Dashboard = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Startup CRM</h1>
        <div className="flex items-center space-x-4">
          {hasPermission('analytics', 'read') && (
            <button
              onClick={() => setCurrentView('analytics')}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </button>
          )}
          {(hasRole(['Admin', 'Manager']) || hasPermission('feedbacks', 'export')) && (
            <div className="relative">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            {showBulkActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                <div className="py-1">
                  <button
                    onClick={() => handleExportData('all', 'csv')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Export All (CSV)
                  </button>
                  <button
                    onClick={() => handleExportData('all', 'json')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Export All (JSON)
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => handleExportData('feedbacks', 'csv')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Export Feedbacks
                  </button>
                  <button
                    onClick={() => handleExportData('projects', 'csv')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Export Projects
                  </button>
                  <button
                    onClick={() => handleExportData('tasks', 'csv')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Export Tasks
                  </button>
                </div>
              </div>
            )}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getDashboardSections().map((section) => {
          const IconComponent = section.icon;
          return (
            <div 
              key={section.key}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setCurrentView(section.view)}
            >
              <div className="flex items-center mb-4">
                <IconComponent className={`h-8 w-8 ${section.color} mr-3`} />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{section.title}</h2>
              </div>
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  <span>{section.title} Table</span>
                </div>
                {hasPermission(section.key, 'create') && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddModal(section.key === 'feedbackLinks' ? 'feedbackLink' : section.key);
                    }}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New {section.title.slice(0, -1)}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        
        {/* Analytics Card - Available to all authenticated users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setCurrentView('analytics')}>
          <div className="flex items-center mb-4">
            <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Analytics</h2>
          </div>
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
              <CheckSquare className="h-4 w-4 mr-2" />
              <span>Data Insights</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView('analytics');
              }}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              View Analytics
            </button>
          </div>
        </div>

        {/* Admin-only sections */}
        {hasRole(['Admin']) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => setCurrentView('maintenance')}>
            <div className="flex items-center mb-4">
              <Settings className="h-8 w-8 text-gray-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">System Settings</h2>
            </div>
            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                <CheckSquare className="h-4 w-4 mr-2" />
                <span>Admin Tools</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView('maintenance');
                }}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Settings className="h-4 w-4 mr-1" />
                System Tools
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Welcome message based on user role */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-blue-200 dark:border-gray-600">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Welcome back, {user?.first_name || user?.username}!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Role: <span className="font-medium">{user?.role}</span>
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {user?.role === 'Admin' && 'You have full access to all system features and user management.'}
          {user?.role === 'Manager' && 'You can manage projects, tasks, and view team activities.'}
          {user?.role === 'Sales Rep' && 'You can manage your assigned companies, contacts, and view project progress.'}
          {user?.role === 'Developer' && 'You can manage customer feedback and track support-related tasks.'}
        </div>
      </div>
    </div>
  );

  // Feedbacks View
  const FeedbacksView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="mr-4 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feedbacks</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedbacks..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerms.feedbacks}
              onChange={(e) => updateSearchTerm('feedbacks', e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
            <option value="Under Investigation">Under Investigation</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Bug">Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Comment">Comment</option>
            <option value="Incident">Incident</option>
          </select>
          <button 
            onClick={() => openAddModal('feedback')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add entry
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="w-12 p-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Feedback Title</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Feedback Type</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Description</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Urgency</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Resolution Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Contact Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Created</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filterFeedbacks().map((feedback) => (
                <tr key={feedback.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="p-4 text-sm text-gray-900 dark:text-gray-100 font-medium">{feedback.title}</td>
                  <td className="p-4 text-sm text-gray-900 dark:text-gray-100">{feedback.type}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{feedback.description}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(feedback.urgency)}`}>
                      {feedback.urgency}
                    </span>
                  </td>
                  <td className="p-4">
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer hover:opacity-80 ${getStatusColor(feedback.status)}`}
                      onClick={() => openEditModal('feedback', feedback)}
                    >
                      {feedback.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-blue-600 dark:text-blue-400">{feedback.email}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{feedback.created}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => openEditModal('feedback', feedback)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-600 dark:text-gray-400">1-25 of {feedbacks.length}</div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page: 25</span>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">←</button>
            <span className="text-sm text-gray-600 dark:text-gray-400">1/1</span>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">→</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Projects View with Detail Modal
  const ProjectsView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="mr-4 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerms.projects}
              onChange={(e) => updateSearchTerm('projects', e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button 
            onClick={() => openAddModal('project')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add entry
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="w-12 p-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Project Name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Description</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Start Date</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">End Date</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filterProjects().map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="p-4 text-sm text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:text-blue-800 dark:hover:text-blue-300"
                      onClick={() => {
                        setSelectedItem({type: 'project', data: project});
                        setCurrentView('projectDetail');
                      }}>
                    {project.name}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{project.description}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{project.startDate}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{project.endDate}</td>
                  <td className="p-4">
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer hover:opacity-80 ${getStatusColor(project.status)}`}
                      onClick={() => openEditModal('project', project)}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedItem({type: 'project', data: project});
                        setCurrentView('projectDetail');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => openEditModal('project', project)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Project Detail View
  const ProjectDetailView = () => {
    const project = selectedItem?.data;
    const projectTasks = tasks.filter(task => task.project === project?.name);
    const projectFeedbackLinks = feedbackProjectLinks.filter(link => link.project === project?.name);

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentView('projects')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Project</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Filters
            </button>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Project Name</h3>
              <p className="text-lg font-medium text-gray-900">{project?.name}</p>
              
              <h3 className="text-sm font-medium text-gray-500 mb-1 mt-4">Start Date</h3>
              <p className="text-gray-900">{project?.startDate}</p>
              
              <h3 className="text-sm font-medium text-gray-500 mb-1 mt-4">Status</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project?.status)}`}>
                {project?.status?.replace('_', ' ')}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-gray-900">{project?.description}</p>
              
              <h3 className="text-sm font-medium text-gray-500 mb-1 mt-4">End Date</h3>
              <p className="text-gray-900">{project?.endDate}</p>
            </div>
          </div>
        </div>

        {/* Tasks by Project */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tasks by Project</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 p-4">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Task Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Description</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Due Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Project</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projectTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="p-4 text-sm text-gray-900 font-medium">{task.name}</td>
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{task.description}</td>
                    <td className="p-4 text-sm text-gray-600">{task.dueDate}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-blue-600">{task.project}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
              <Plus className="h-4 w-4 mr-1" />
              Add entry
            </button>
          </div>
        </div>

        {/* Feedback Project Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Feedback Project Links by Project</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 p-4">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Feedback</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Project</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projectFeedbackLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="p-4 text-sm text-blue-600">{link.feedback}</td>
                    <td className="p-4 text-sm text-blue-600">{link.project}</td>
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{link.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">1/1</div>
          </div>
        </div>
      </div>
    );
  };

  // Team Members View
  const TeamMembersView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="mr-4 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerms.team}
              onChange={(e) => updateSearchTerm('team', e.target.value)}
            />
          </div>
          <button 
            onClick={() => openAddModal('team')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add entry
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="w-12 p-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Member Name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Role</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Phone</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Notes</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filterTeamMembers().map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="p-4 text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-800"
                      onClick={() => {
                        setSelectedItem({type: 'member', data: member});
                        setCurrentView('memberDetail');
                      }}>
                    {member.name}
                  </td>
                  <td className="p-4 text-sm text-gray-900 dark:text-gray-100">{member.role}</td>
                  <td className="p-4 text-sm text-blue-600 dark:text-blue-400">{member.email}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{member.phone}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">{member.notes}</td>
                  <td className="p-4 space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedItem({type: 'member', data: member});
                        setCurrentView('memberDetail');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => openEditModal('team', member)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Team Member Detail View
  const TeamMemberDetailView = () => {
    const member = selectedItem?.data;
    const memberTasks = tasks.filter(task => task.assignedMember === member?.name);

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentView('team')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Team Member</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Filters
            </button>
          </div>
        </div>

        {/* Member Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Member Name</h3>
              <p className="text-lg font-medium text-gray-900">{member?.name}</p>
              
              <h3 className="text-sm font-medium text-gray-500 mb-1 mt-4">Email</h3>
              <div className="flex items-center">
                <p className="text-blue-600">{member?.email}</p>
                <Mail className="h-4 w-4 ml-2 text-red-500" />
              </div>
              
              <h3 className="text-sm font-medium text-gray-500 mb-1 mt-4">Notes</h3>
              <p className="text-gray-900">{member?.notes}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Role</h3>
              <p className="text-gray-900">{member?.role}</p>
              
              <h3 className="text-sm font-medium text-gray-500 mb-1 mt-4">Phone</h3>
              <p className="text-gray-900">{member?.phone}</p>
            </div>
          </div>
        </div>

        {/* Tasks by Assigned Member */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tasks by Assigned Member</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 p-4">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Task Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Description</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Due Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Project</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {memberTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="p-4 text-sm text-gray-900 font-medium">{task.name}</td>
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{task.description}</td>
                    <td className="p-4 text-sm text-gray-600">{task.dueDate}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-blue-600">{task.project}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">1-25 of {memberTasks.length}</div>
          </div>
        </div>
      </div>
    );
  };

  // Tasks View
  const TasksView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="mr-4 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerms.tasks}
              onChange={(e) => updateSearchTerm('tasks', e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button 
            onClick={() => openAddModal('task')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add entry
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="w-12 p-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Task Name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Description</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Due Date</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Project</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Assigned Member</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filterTasks().map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="p-4 text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-800"
                      onClick={() => {
                        setSelectedItem({type: 'task', data: task});
                        setCurrentView('taskDetail');
                      }}>
                    {task.name}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">{task.description}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{task.dueDate}</td>
                  <td className="p-4">
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer hover:opacity-80 ${getStatusColor(task.status)}`}
                      onClick={() => openEditModal('task', task)}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-blue-600 dark:text-blue-400">{task.project}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{task.assignedMember}</td>
                  <td className="p-4 space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedItem({type: 'task', data: task});
                        setCurrentView('taskDetail');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => openEditModal('task', task)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Task Detail View
  const TaskDetailView = () => {
    const task = selectedItem?.data;

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentView('tasks')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Task</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Filters
            </button>
          </div>
        </div>

        {/* Task Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Task Name</h3>
              <p className="text-lg font-medium text-gray-900">{task?.name}</p>
              
              <h3 className="text-sm font-medium text-gray-500 mb-1 mt-4">Due Date</h3>
              <div className="flex items-center">
                <p className="text-gray-900">{task?.dueDate}</p>
                <Calendar className="h-4 w-4 ml-2 text-gray-400" />
              </div>
              
              <h3 className="text-sm font-medium text-gray-500 mb-1 mt-4">Project</h3>
              <p className="text-blue-600">{task?.project}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-gray-900">{task?.description}</p>
              
              <h3 className="text-sm font-medium text-gray-500 mb-1 mt-4">Status</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task?.status)}`}>
                {task?.status?.replace('_', ' ')}
              </span>
              
              <h3 className="text-sm font-medium text-gray-500 mb-1 mt-4">Assigned Member</h3>
              <p className="text-blue-600">{task?.assignedMember}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Feedback Project Links View
  const FeedbackProjectLinksView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="mr-4 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback Project Links</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback links..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerms.feedbackLinks}
              onChange={(e) => updateSearchTerm('feedbackLinks', e.target.value)}
            />
          </div>
          <button 
            onClick={() => openAddModal('feedbackLink')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add entry
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="w-12 p-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Feedback</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Project</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Notes</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filterFeedbackLinks().map((link) => (
                <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="p-4 text-sm text-blue-600 dark:text-blue-400">{link.feedback}</td>
                  <td className="p-4 text-sm text-blue-600 dark:text-blue-400">{link.project}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{link.notes}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => openEditModal('feedbackLink', link)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-600 dark:text-gray-400">1-25 of {feedbackProjectLinks.length}</div>
        </div>
      </div>
    </div>
  );

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics 
          feedbacks={feedbacks}
          projects={projects}
          teamMembers={teamMembers}
          tasks={tasks}
          feedbackProjectLinks={feedbackProjectLinks}
          onBack={() => setCurrentView('dashboard')}
        />;
      case 'companies':
        return <CompaniesView 
          onBack={() => setCurrentView('dashboard')}
          onCompanySelect={(company) => {
            setSelectedItem({type: 'company', data: company});
            setCurrentView('companyDetail');
          }}
        />;
      case 'contacts':
        return <ContactsView 
          onBack={() => setCurrentView('dashboard')}
          onContactSelect={(contact) => {
            setSelectedItem({type: 'contact', data: contact});
            setCurrentView('contactDetail');
          }}
        />;
      case 'feedbacks':
        return <FeedbacksView />;
      case 'projects':
        return <ProjectsView />;
      case 'projectDetail':
        return <ProjectDetailView />;
      case 'team':
        return <TeamMembersView />;
      case 'memberDetail':
        return <TeamMemberDetailView />;
      case 'tasks':
        return <TasksView />;
      case 'taskDetail':
        return <TaskDetailView />;
      case 'feedbackLinks':
        return <FeedbackProjectLinksView />;
      default:
        return <Dashboard />;
    }
  };

  if (loading && feedbacks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CRM data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 mt-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-red-500">×</span>
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4 flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span>Saving...</span>
          </div>
        </div>
      )}

      
      <Modal
        showModal={showModal}
        modalType={modalType}
        editingItem={editingItem}
        formData={formData}
        projects={projects}
        teamMembers={teamMembers}
        feedbacks={feedbacks}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
      />

      
      
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <Briefcase className="h-6 w-6 mr-2" />
                <span className="font-semibold">Menu</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Global search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={searchTerms.global}
                  onChange={(e) => updateSearchTerm('global', e.target.value)}
                />
              </div>
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <UserHeader />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default StartupCRM;