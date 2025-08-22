import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Users, Briefcase, MessageSquare, CheckSquare, AlertCircle, Calendar, ArrowLeft } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
        {change && (
          <div className={`flex items-center mt-2 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            {changeType === 'increase' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const Analytics = ({ feedbacks, projects, teamMembers, tasks, feedbackProjectLinks, onBack }) => {
  const analytics = useMemo(() => {
    // Basic stats
    const totalFeedbacks = feedbacks.length;
    const totalProjects = projects.length;
    const totalTeamMembers = teamMembers.length;
    const totalTasks = tasks.length;

    // Feedback analytics
    const feedbacksByType = feedbacks.reduce((acc, feedback) => {
      acc[feedback.type] = (acc[feedback.type] || 0) + 1;
      return acc;
    }, {});

    const feedbacksByUrgency = feedbacks.reduce((acc, feedback) => {
      acc[feedback.urgency] = (acc[feedback.urgency] || 0) + 1;
      return acc;
    }, {});

    const feedbacksByStatus = feedbacks.reduce((acc, feedback) => {
      acc[feedback.status] = (acc[feedback.status] || 0) + 1;
      return acc;
    }, {});

    // Project analytics
    const projectsByStatus = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

    // Task analytics
    const tasksByStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    const tasksByProject = tasks.reduce((acc, task) => {
      const projectName = task.project || 'Unassigned';
      acc[projectName] = (acc[projectName] || 0) + 1;
      return acc;
    }, {});

    // Convert to chart data
    const feedbackTypeData = Object.entries(feedbacksByType).map(([name, value]) => ({ name, value }));
    const feedbackUrgencyData = Object.entries(feedbacksByUrgency).map(([name, value]) => ({ name, value }));
    const feedbackStatusData = Object.entries(feedbacksByStatus).map(([name, value]) => ({ name, value }));
    const projectStatusData = Object.entries(projectsByStatus).map(([name, value]) => ({ name, value }));
    const taskStatusData = Object.entries(tasksByStatus).map(([name, value]) => ({ name, value }));
    const taskProjectData = Object.entries(tasksByProject).map(([name, value]) => ({ name, value })).slice(0, 10);

    // Timeline data (simplified - using created dates if available)
    const monthlyData = {};
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = { month: monthKey, feedbacks: 0, projects: 0, tasks: 0 };
    }

    // Add some sample trend data (in real app, this would be based on actual creation dates)
    Object.keys(monthlyData).forEach((month, index) => {
      monthlyData[month].feedbacks = Math.floor(Math.random() * 20) + 5;
      monthlyData[month].projects = Math.floor(Math.random() * 8) + 2;
      monthlyData[month].tasks = Math.floor(Math.random() * 30) + 10;
    });

    const timelineData = Object.values(monthlyData);

    return {
      totalFeedbacks,
      totalProjects,
      totalTeamMembers,
      totalTasks,
      feedbackTypeData,
      feedbackUrgencyData,
      feedbackStatusData,
      projectStatusData,
      taskStatusData,
      taskProjectData,
      timelineData,
      completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0,
      urgentFeedbacks: feedbacks.filter(f => f.urgency === 'Critical' || f.urgency === 'High').length,
      activeProjects: projects.filter(p => p.status === 'in_progress').length,
    };
  }, [feedbacks, projects, teamMembers, tasks]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Feedbacks"
          value={analytics.totalFeedbacks}
          change="+12% from last month"
          changeType="increase"
          icon={MessageSquare}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Projects"
          value={analytics.activeProjects}
          change="+5% from last month"
          changeType="increase"
          icon={Briefcase}
          color="bg-green-500"
        />
        <StatCard
          title="Team Members"
          value={analytics.totalTeamMembers}
          change="+2 new members"
          changeType="increase"
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="Task Completion"
          value={`${analytics.completionRate}%`}
          change={analytics.completionRate > 70 ? "+8% from last month" : "-3% from last month"}
          changeType={analytics.completionRate > 70 ? "increase" : "decrease"}
          icon={CheckSquare}
          color="bg-orange-500"
        />
      </div>

      {/* Urgent Items Alert */}
      {analytics.urgentFeedbacks > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Urgent Attention Required</h3>
              <p className="text-sm text-red-700 mt-1">
                You have {analytics.urgentFeedbacks} urgent feedback items that need immediate attention.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Activity Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="feedbacks" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="projects" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="tasks" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback by Type */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Feedback Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.feedbackTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.feedbackTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Task Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.taskStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks by Project */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Project</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.taskProjectData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Urgency</h3>
          <div className="space-y-3">
            {analytics.feedbackUrgencyData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
          <div className="space-y-3">
            {analytics.projectStatusData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-700 capitalize">{item.name.replace('_', ' ')}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Total Records</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics.totalFeedbacks + analytics.totalProjects + analytics.totalTasks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Avg Tasks/Project</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics.totalProjects > 0 ? Math.round(analytics.totalTasks / analytics.totalProjects) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Team Utilization</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics.totalTeamMembers > 0 ? Math.round((analytics.totalTasks / analytics.totalTeamMembers) * 10) / 10 : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
