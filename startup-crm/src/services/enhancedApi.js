import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend-domain.railway.app/api'
  : 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Companies API
export const companiesApi = {
  getAll: () => api.get('/companies'),
  getById: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
};

// Contacts API
export const contactsApi = {
  getAll: () => api.get('/contacts'),
  getById: (id) => api.get(`/contacts/${id}`),
  create: (data) => api.post('/contacts', data),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
};

// Enhanced Feedbacks API
export const enhancedFeedbacksApi = {
  getAll: () => api.get('/feedbacks-enhanced'),
  getById: (id) => api.get(`/feedbacks-enhanced/${id}`),
  create: (data) => api.post('/feedbacks-enhanced', data),
  update: (id, data) => api.put(`/feedbacks-enhanced/${id}`, data),
  delete: (id) => api.delete(`/feedbacks-enhanced/${id}`),
};

// Enhanced Projects API
export const enhancedProjectsApi = {
  getAll: () => api.get('/projects-enhanced'),
  getById: (id) => api.get(`/projects-enhanced/${id}`),
  create: (data) => api.post('/projects-enhanced', data),
  update: (id, data) => api.put(`/projects-enhanced/${id}`, data),
  delete: (id) => api.delete(`/projects-enhanced/${id}`),
};

// Enhanced Tasks API
export const enhancedTasksApi = {
  getAll: () => api.get('/tasks-enhanced'),
  getById: (id) => api.get(`/tasks-enhanced/${id}`),
  create: (data) => api.post('/tasks-enhanced', data),
  update: (id, data) => api.put(`/tasks-enhanced/${id}`, data),
  delete: (id) => api.delete(`/tasks-enhanced/${id}`),
};

// Enhanced Team Members API
export const enhancedTeamMembersApi = {
  getAll: () => api.get('/team-members-enhanced'),
  getById: (id) => api.get(`/team-members-enhanced/${id}`),
  create: (data) => api.post('/team-members-enhanced', data),
  update: (id, data) => api.put(`/team-members-enhanced/${id}`, data),
  delete: (id) => api.delete(`/team-members-enhanced/${id}`),
};

// Comments API
export const commentsApi = {
  getForEntity: (entityType, entityId) => api.get(`/comments/${entityType}/${entityId}`),
  create: (data) => api.post('/comments', data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Attachments API
export const attachmentsApi = {
  getForEntity: (entityType, entityId) => api.get(`/attachments/${entityType}/${entityId}`),
  create: (data) => api.post('/attachments', data),
  delete: (id) => api.delete(`/attachments/${id}`),
};

// Analytics API
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
};

// Project Members API (junction table)
export const projectMembersApi = {
  getForProject: (projectId) => api.get(`/project-members/project/${projectId}`),
  getForMember: (memberId) => api.get(`/project-members/member/${memberId}`),
  add: (data) => api.post('/project-members', data),
  remove: (projectId, memberId) => api.delete(`/project-members/${projectId}/${memberId}`),
};

// Interaction History API
export const interactionHistoryApi = {
  getForContact: (contactId) => api.get(`/interaction-history/contact/${contactId}`),
  create: (data) => api.post('/interaction-history', data),
  update: (id, data) => api.put(`/interaction-history/${id}`, data),
  delete: (id) => api.delete(`/interaction-history/${id}`),
};

// Enhanced Feedback Project Links API
export const enhancedFeedbackProjectLinksApi = {
  getAll: () => api.get('/feedback-project-links-enhanced'),
  getById: (feedbackId, projectId) => api.get(`/feedback-project-links-enhanced/${feedbackId}/${projectId}`),
  create: (data) => api.post('/feedback-project-links-enhanced', data),
  update: (feedbackId, projectId, data) => api.put(`/feedback-project-links-enhanced/${feedbackId}/${projectId}`, data),
  delete: (feedbackId, projectId) => api.delete(`/feedback-project-links-enhanced/${feedbackId}/${projectId}`),
};

export default {
  companies: companiesApi,
  contacts: contactsApi,
  enhancedFeedbacks: enhancedFeedbacksApi,
  enhancedProjects: enhancedProjectsApi,
  enhancedTasks: enhancedTasksApi,
  enhancedTeamMembers: enhancedTeamMembersApi,
  enhancedFeedbackProjectLinks: enhancedFeedbackProjectLinksApi,
  comments: commentsApi,
  attachments: attachmentsApi,
  analytics: analyticsApi,
  projectMembers: projectMembersApi,
  interactionHistory: interactionHistoryApi,
};
