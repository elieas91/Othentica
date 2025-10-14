import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaExternalLinkAlt, FaImage, FaUpload } from 'react-icons/fa';
import apiService from '../../services/api';
import Swal from 'sweetalert2';

const ClientsManager = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website_url: '',
    logo_url: '',
    display_order: 0
  });

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getClients();
      
      if (response.success) {
        setClients(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch clients');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError(error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch clients. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select an image file.',
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select an image smaller than 5MB.',
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Client name is required.',
      });
      return;
    }

    try {
      setUploading(true);

      const clientData = {
        name: formData.name,
        industry: formData.industry,
        website_url: formData.website_url,
        display_order: parseInt(formData.display_order) || 0
      };

      // Add file to FormData if present
      if (selectedFile) {
        clientData.logo = selectedFile;
      }

      let response;
      if (editingId) {
        response = await apiService.updateClient(editingId, clientData);
      } else {
        response = await apiService.createClient(clientData);
      }

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: editingId ? 'Client updated successfully!' : 'Client created successfully!',
        });
        
        // Reset form
        resetForm();
        fetchClients();
      } else {
        throw new Error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving client:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to save client. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (client) => {
    setFormData({
      name: client.name || '',
      industry: client.industry || '',
      website_url: client.website_url || '',
      logo_url: client.logo_url || '',
      display_order: client.display_order || 0
    });
    setEditingId(client.id);
    setIsEditing(true);
    setShowAddForm(true);
    setSelectedFile(null);
    setPreviewUrl(client.logo_url || '');
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await apiService.deleteClient(id);
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Client has been deleted.',
          });
          fetchClients();
        } else {
          throw new Error(response.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete client. Please try again.',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      industry: '',
      website_url: '',
      logo_url: '',
      display_order: 0
    });
    setEditingId(null);
    setIsEditing(false);
    setShowAddForm(false);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleAddNew = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleCancel = () => {
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={fetchClients}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clients Management</h2>
          <p className="text-gray-600">Manage client logos and information</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Add New Client
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Client' : 'Add New Client'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter client name"
                  required
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter industry"
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Logo
              </label>
              <div className="space-y-4">
                {/* File Input */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                    <FaUpload className="w-4 h-4" />
                    Choose Image
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  {selectedFile && (
                    <span className="text-sm text-gray-600">
                      {selectedFile.name}
                    </span>
                  )}
                </div>

                {/* Preview */}
                {(previewUrl || formData.logo_url) && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img
                        src={previewUrl || formData.logo_url}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Current Logo URL (for editing) */}
                {isEditing && formData.logo_url && !selectedFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Current: {formData.logo_url}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    {isEditing ? 'Update Client' : 'Create Client'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clients List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Clients ({clients.length})
          </h3>
        </div>

        {clients.length === 0 ? (
          <div className="text-center py-12">
            <FaImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No clients found</p>
            <p className="text-gray-400">Add your first client to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 h-[50vh] overflow-y-scroll">
            {clients.map((client) => (
              <div key={client.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {client.logo_url ? (
                        <img
                          src={client.logo_url}
                          alt={`${client.name} logo`}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <FaImage className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Client Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-medium text-gray-900 truncate">
                        {client.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{client.industry || 'No industry specified'}</span>
                        {client.website_url && (
                          <a
                            href={client.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:text-primary-dark transition-colors"
                          >
                            <FaExternalLinkAlt className="w-3 h-3" />
                            Website
                          </a>
                        )}
                        <span>Order: {client.display_order}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit client"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete client"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsManager;
