// Utility functions for exporting data

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values that might contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    });
    csvContent += values.join(',') + '\n';
  });

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateReportData = (feedbacks, projects, teamMembers, tasks) => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return {
    generatedAt: currentDate,
    summary: {
      totalFeedbacks: feedbacks.length,
      totalProjects: projects.length,
      totalTeamMembers: teamMembers.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      urgentFeedbacks: feedbacks.filter(f => f.urgency === 'Critical' || f.urgency === 'High').length,
      activeProjects: projects.filter(p => p.status === 'in_progress').length,
    },
    feedbacks: feedbacks.map(f => ({
      id: f.id,
      title: f.title,
      type: f.type,
      urgency: f.urgency,
      status: f.status,
      email: f.email,
      created: f.created_date || f.created,
    })),
    projects: projects.map(p => ({
      id: p.id,
      name: p.name,
      status: p.status,
      startDate: p.start_date || p.startDate,
      endDate: p.end_date || p.endDate,
    })),
    tasks: tasks.map(t => ({
      id: t.id,
      name: t.name,
      status: t.status,
      project: t.project,
      assignedMember: t.assignedMember,
      dueDate: t.due_date || t.dueDate,
    })),
  };
};
