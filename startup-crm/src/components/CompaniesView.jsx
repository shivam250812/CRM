import React, { useState, useEffect } from 'react';
import { Plus, Search, ArrowLeft, Building2, Users, MessageSquare, Edit, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { companiesApi } from '../services/enhancedApi';

const CompaniesView = ({ onBack, onCompanySelect }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    website: '',
    industry: '',
    status: 'Prospect'
  });

  const statusColors = {
    'Lead': 'bg-yellow-100 text-yellow-800',
    'Active Customer': 'bg-green-100 text-green-800',
    'Churned': 'bg-red-100 text-red-800',
    'Prospect': 'bg-blue-100 text-blue-800'
  };

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 
    'Manufacturing', 'Real Estate', 'Professional Services', 'Other'
  ];

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const response = await companiesApi.getAll();
      setCompanies(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load companies: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const toastId = toast.loading('Saving company...');
    try {
      if (editingCompany) {
        await companiesApi.update(editingCompany.company_id, formData);
        toast.success('Company updated successfully!', { id: toastId });
      } else {
        await companiesApi.create(formData);
        toast.success('Company created successfully!', { id: toastId });
      }
      await loadCompanies();
      setShowModal(false);
      setEditingCompany(null);
      setFormData({ company_name: '', website: '', industry: '', status: 'Prospect' });
    } catch (error) {
      toast.error('Failed to save company: ' + error.message, { id: toastId });
    }
  };

  const handleDelete = async (company) => {
    if (!window.confirm(`Are you sure you want to delete ${company.company_name}?`)) return;
    
    const toastId = toast.loading('Deleting company...');
    try {
      await companiesApi.delete(company.company_id);
      toast.success('Company deleted successfully!', { id: toastId });
      await loadCompanies();
    } catch (error) {
      toast.error('Failed to delete company: ' + error.message, { id: toastId });
    }
  };

  const openAddModal = () => {
    setEditingCompany(null);
    setFormData({ company_name: '', website: '', industry: '', status: 'Prospect' });
    setShowModal(true);
  };

  const openEditModal = (company) => {
    setEditingCompany(company);
    setFormData({
      company_name: company.company_name,
      website: company.website || '',
      industry: company.industry || '',
      status: company.status
    });
    setShowModal(true);
  };

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
    company.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Companies</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </button>
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div 
              key={company.company_id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onCompanySelect && onCompanySelect(company)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {company.company_name}
                    </h3>
                    {company.industry && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{company.industry}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(company);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(company);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[company.status]}`}>
                    {company.status}
                  </span>
                  {company.website && (
                    <a
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{company.contact_count || 0} contacts</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{company.feedback_count || 0} feedbacks</span>
                  </div>
                </div>

                {company.website && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {company.website}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCompanies.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No companies found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first company.'}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingCompany ? 'Edit Company' : 'Add Company'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Industry
                </label>
                <select
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                >
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Prospect">Prospect</option>
                  <option value="Lead">Lead</option>
                  <option value="Active Customer">Active Customer</option>
                  <option value="Churned">Churned</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.company_name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {editingCompany ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesView;
