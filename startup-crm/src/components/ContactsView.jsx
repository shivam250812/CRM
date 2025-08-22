import React, { useState, useEffect } from 'react';
import { Plus, Search, ArrowLeft, User, Building2, Mail, Phone, MessageSquare, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactsApi, companiesApi } from '../services/enhancedApi';

const ContactsView = ({ onBack, onContactSelect }) => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role_at_company: '',
    company_id: ''
  });

  useEffect(() => {
    loadContacts();
    loadCompanies();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await contactsApi.getAll();
      setContacts(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load contacts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await companiesApi.getAll();
      setCompanies(response.data.data || []);
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  };

  const handleSave = async () => {
    const toastId = toast.loading('Saving contact...');
    try {
      if (editingContact) {
        await contactsApi.update(editingContact.contact_id, formData);
        toast.success('Contact updated successfully!', { id: toastId });
      } else {
        await contactsApi.create(formData);
        toast.success('Contact created successfully!', { id: toastId });
      }
      await loadContacts();
      setShowModal(false);
      setEditingContact(null);
      setFormData({
        first_name: '', last_name: '', email: '', phone: '', 
        role_at_company: '', company_id: ''
      });
    } catch (error) {
      toast.error('Failed to save contact: ' + error.message, { id: toastId });
    }
  };

  const handleDelete = async (contact) => {
    const contactName = `${contact.first_name} ${contact.last_name}`.trim() || contact.email;
    if (!window.confirm(`Are you sure you want to delete ${contactName}?`)) return;
    
    const toastId = toast.loading('Deleting contact...');
    try {
      await contactsApi.delete(contact.contact_id);
      toast.success('Contact deleted successfully!', { id: toastId });
      await loadContacts();
    } catch (error) {
      toast.error('Failed to delete contact: ' + error.message, { id: toastId });
    }
  };

  const openAddModal = () => {
    setEditingContact(null);
    setFormData({
      first_name: '', last_name: '', email: '', phone: '', 
      role_at_company: '', company_id: ''
    });
    setShowModal(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({
      first_name: contact.first_name || '',
      last_name: contact.last_name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      role_at_company: contact.role_at_company || '',
      company_id: contact.company_id || ''
    });
    setShowModal(true);
  };

  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
    const searchLower = searchTerm.toLowerCase();
    return (
      fullName.toLowerCase().includes(searchLower) ||
      (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
      (contact.role_at_company && contact.role_at_company.toLowerCase().includes(searchLower)) ||
      (contact.company_name && contact.company_name.toLowerCase().includes(searchLower))
    );
  });

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
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
            Add Contact
          </button>
        </div>
      </div>

      {/* Contacts Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <div 
              key={contact.contact_id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onContactSelect && onContactSelect(contact)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {`${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Unknown Name'}
                    </h3>
                    {contact.role_at_company && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{contact.role_at_company}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(contact);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contact);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {contact.company_name && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>{contact.company_name}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{contact.email}</span>
                </div>

                {contact.phone && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{contact.phone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{contact.feedback_count || 0} feedbacks</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredContacts.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No contacts found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first contact.'}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingContact ? 'Edit Contact' : 'Add Contact'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role at Company
                </label>
                <input
                  type="text"
                  placeholder="Marketing Manager"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={formData.role_at_company}
                  onChange={(e) => setFormData(prev => ({ ...prev, role_at_company: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company
                </label>
                <select
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={formData.company_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_id: e.target.value }))}
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.company_id} value={company.company_id}>
                      {company.company_name}
                    </option>
                  ))}
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
                disabled={!formData.email}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {editingContact ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsView;
