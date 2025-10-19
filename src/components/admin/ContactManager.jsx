import React, { useState, useEffect, useCallback } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArchiveBoxIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  StarIcon,
  StarIcon as StarIconSolid,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import apiService from '../../services/api';

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyData, setReplyData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [showSendToAllModal, setShowSendToAllModal] = useState(false);
  const [isSendingToAll, setIsSendingToAll] = useState(false);
  const [allEmails, setAllEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [bulkEmailData, setBulkEmailData] = useState({
    subject: '',
    message: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(20);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });

  // SweetAlert helper functions
  const showSuccessAlert = (title, text) => {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#10b981',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl',
        title: 'font-poppins font-bold text-primary',
        content: 'font-poppins',
        confirmButton: 'rounded-xl font-medium'
      }
    });
  };

  const showErrorAlert = (title, text) => {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#ef4444',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl',
        title: 'font-poppins font-bold text-primary',
        content: 'font-poppins',
        confirmButton: 'rounded-xl font-medium'
      }
    });
  };

  // Fetch contacts from API
  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: contactsPerPage,
        status: filterStatus,
        search: searchTerm,
        sortBy: sortBy === 'newest' ? 'created_at' : sortBy === 'oldest' ? 'created_at' : sortBy,
        sortOrder: sortBy === 'newest' ? 'DESC' : sortBy === 'oldest' ? 'ASC' : 'DESC'
      };
      
      const response = await apiService.getContacts(params);
      if (response.success) {
        setContacts(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.error || 'Failed to fetch contacts');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20
      });
      // Show error only if it's not a network/connection issue
      if (error.message && !error.message.includes('fetch')) {
        await showErrorAlert('Error', 'Failed to load contacts');
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, contactsPerPage, filterStatus, searchTerm, sortBy]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts, currentPage, filterStatus, searchTerm, sortBy]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, searchTerm, filterStatus, sortBy]);

  // Handle contact selection
  const handleContactSelect = (contactId, isSelected) => {
    if (isSelected) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  // Handle contact actions
  const handleMarkAsRead = async (contactIds) => {
    try {
      console.log('Marking as read:', contactIds);
      await apiService.bulkUpdateContacts(contactIds, 'mark_read');
      await showSuccessAlert('Success', 'Contacts marked as read');
      await fetchContacts();
      setSelectedContacts([]); // Clear selection
    } catch (error) {
      console.error('Mark as read error:', error);
      await showErrorAlert('Error', `Failed to mark contacts as read: ${error.message || 'Unknown error'}`);
    }
  };

  const handleArchiveContacts = async (contactIds) => {
    try {
      console.log('Archiving contacts:', contactIds);
      await apiService.bulkUpdateContacts(contactIds, 'archive');
      await showSuccessAlert('Success', 'Contacts archived');
      await fetchContacts();
      setSelectedContacts([]); // Clear selection
    } catch (error) {
      console.error('Archive error:', error);
      await showErrorAlert('Error', `Failed to archive contacts: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteContacts = async (contactIds) => {
    console.log('Attempting to delete contacts:', contactIds);
    
    const result = await Swal.fire({
      title: 'Delete Contacts',
      text: 'Are you sure you want to delete the selected contacts? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete them!',
      customClass: {
        popup: 'rounded-2xl',
        title: 'font-poppins font-bold text-primary',
        content: 'font-poppins',
        confirmButton: 'rounded-xl font-medium',
        cancelButton: 'rounded-xl font-medium'
      }
    });

    if (result.isConfirmed) {
      try {
        console.log('Calling bulkUpdateContacts with:', contactIds, 'delete');
        const response = await apiService.bulkUpdateContacts(contactIds, 'delete');
        console.log('Delete response:', response);
        await showSuccessAlert('Success', 'Contacts deleted successfully');
        await fetchContacts();
        setSelectedContacts([]); // Clear selection after deletion
      } catch (error) {
        console.error('Delete error:', error);
        await showErrorAlert('Error', `Failed to delete contacts: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleStarContact = async (contactId, isStarred) => {
    try {
      await apiService.toggleContactStar(contactId, !isStarred);
      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? { ...contact, is_starred: !isStarred } : contact
      ));
    } catch (err) {
      await showErrorAlert('Error', 'Failed to update contact', err.message);
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleReply = (contact) => {
    setReplyData({
      to: contact.email,
      subject: `Re: ${contact.subject || 'No Subject'}`,
      message: ''
    });
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    try {
      setIsSendingReply(true);
      const response = await apiService.sendReply(replyData);
      if (response.success) {
        await showSuccessAlert('Success', 'Reply sent successfully');
        setShowReplyModal(false);
        setReplyData({ to: '', subject: '', message: '' });
      } else {
        throw new Error(response.error || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Send reply error:', error);
      await showErrorAlert('Error', `Failed to send reply: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleSendToAll = async () => {
    if (selectedEmails.length === 0) {
      await showErrorAlert('No Recipients', 'Please select at least one email address to send to.');
      return;
    }

    try {
      setIsSendingToAll(true);
      const emailData = {
        ...bulkEmailData,
        emails: selectedEmails // Include selected emails
      };
      const response = await apiService.sendBulkEmail(emailData);
      if (response.success) {
        await showSuccessAlert('Success', `Email sent to ${response.sentCount} recipients successfully!`);
        setShowSendToAllModal(false);
        setBulkEmailData({ subject: '', message: '' });
        setSelectedEmails([]);
      } else {
        throw new Error(response.error || 'Failed to send bulk email');
      }
    } catch (error) {
      console.error('Send bulk email error:', error);
      await showErrorAlert('Error', `Failed to send bulk email: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSendingToAll(false);
    }
  };

  const handleOpenSendToAll = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllEmails();
      if (response.success) {
        setAllEmails(response.emails);
        setSelectedEmails(response.emails); // Initialize with all emails selected
        setShowSendToAllModal(true);
      } else {
        throw new Error(response.error || 'Failed to fetch emails');
      }
    } catch (error) {
      console.error('Fetch emails error:', error);
      await showErrorAlert('Error', `Failed to fetch emails: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setSelectedEmails(prev => prev.filter(email => email !== emailToRemove));
  };

  const handleAddAllEmails = () => {
    setSelectedEmails(allEmails);
  };

  const handleRemoveAllEmails = () => {
    setSelectedEmails([]);
  };

  // CSV Download functionality
  const downloadCSV = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all contacts without pagination
      const response = await apiService.getContacts({
        page: 1,
        limit: 10000, // Large number to get all contacts
        status: 'all',
        search: '',
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch contacts');
      }

      const contacts = response.data;
      
      if (contacts.length === 0) {
        await showErrorAlert('No Data', 'No contacts found to export');
        return;
      }

      // Create CSV content
      const headers = [
        'Name',
        'Email', 
        'Phone',
        'Company',
        'Created At',
        'Last Contacted'
      ];

      const csvContent = [
        headers.join(','),
        ...contacts.map(contact => [
          `"${(contact.name || '').replace(/"/g, '""')}"`,
          `"${(contact.email || '').replace(/"/g, '""')}"`,
          `"${(contact.phone || '').replace(/"/g, '""')}"`,
          `"${(contact.company || '').replace(/"/g, '""')}"`,
          `"${contact.createdAt ? new Date(contact.createdAt).toLocaleString() : ''}"`,
          `"${contact.lastContacted ? new Date(contact.lastContacted).toLocaleString() : ''}"`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await showSuccessAlert('Success', `CSV file downloaded successfully with ${contacts.length} contacts!`);
      
    } catch (error) {
      console.error('CSV download error:', error);
      await showErrorAlert('Error', `Failed to download CSV: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };


  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-poppins">Contact Management</h2>
            <p className="text-gray-600 text-sm">Manage and respond to customer inquiries</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={downloadCSV}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Download CSV
                </>
              )}
            </button>
            <button
              onClick={handleOpenSendToAll}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send to All
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {selectedContacts.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-700 font-medium">
                {selectedContacts.length} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMarkAsRead(selectedContacts)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => handleArchiveContacts(selectedContacts)}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors text-sm font-medium"
                >
                  Archive
                </button>
                <button
                  onClick={() => handleDeleteContacts(selectedContacts)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedContacts([])}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Gmail-style Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Contact List */}
        <div className={`${selectedContact ? 'w-1/2' : 'w-full'} border-r border-gray-200 bg-white overflow-y-auto`}>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-600">Loading contacts...</span>
            </div>
          ) : (
            <div>
              {/* Select All Header */}
              <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedContacts.length === contacts.length && contacts.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">
                    {pagination.totalItems} contacts
                  </span>
                </div>
              </div>

              {/* Contact List - Gmail Style */}
              {contacts.length === 0 ? (
                <div className="text-center py-12">
                  <EnvelopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No contacts found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => handleViewContact(contact)}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedContacts.includes(contact.id) ? 'bg-blue-50' : ''
                    } ${selectedContact && selectedContact.id === contact.id ? 'bg-blue-100 border-l-4 border-l-blue-500' : ''}`}
                  >
                    <div className="px-4 py-3">
                      <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleContactSelect(contact.id, e.target.checked);
                        }}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
                        onClick={(e) => e.stopPropagation()}
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStarContact(contact.id, contact.is_starred);
                        }}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors mt-1"
                      >
                        {contact.is_starred ? (
                          <StarIconFilled className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <StarIcon className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        {/* Gmail-style header */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {contact.name}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                              {contact.status.replace('_', ' ')}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(contact.priority)}`}></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(contact.createdAt)}
                          </span>
                        </div>

                        {/* Subject line */}
                        <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                          {contact.subject || 'No Subject'}
                        </div>

                        {/* Message preview */}
                        <div className="text-sm text-gray-600 overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {contact.message}
                        </div>

                        {/* Contact info */}
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <EnvelopeIcon className="w-3 h-3" />
                            {contact.email}
                          </span>
                          {contact.phone && (
                            <span className="flex items-center gap-1">
                              <PhoneIcon className="w-3 h-3" />
                              {contact.phone}
                            </span>
                          )}
                          {contact.company && (
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-3 h-3" />
                              {contact.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            )))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} contacts
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-600">
                        Page {currentPage} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                        disabled={currentPage === pagination.totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Contact Details (Gmail-style) */}
        {selectedContact && (
          <div className="w-1/2 bg-white overflow-y-auto">
            <div className="h-full flex flex-col">
              {/* Contact Header */}
              <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-800 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {selectedContact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedContact.name}</h3>
                      <p className="text-sm text-gray-600">{selectedContact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedContact.status)}`}>
                      {selectedContact.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <XCircleIcon className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="flex-1 p-6">
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{selectedContact.email}</span>
                      </div>
                      {selectedContact.phone && (
                        <div className="flex items-center gap-3">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{selectedContact.phone}</span>
                        </div>
                      )}
                      {selectedContact.company && (
                        <div className="flex items-center gap-3">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{selectedContact.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Message</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        Subject: {selectedContact.subject || 'No Subject'}
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedContact.message}
                      </div>
                    </div>
                  </div>

                  {/* Status and Priority */}
                  <div className="flex items-center gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedContact.status)}`}>
                        {selectedContact.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedContact.priority)}`}>
                        {selectedContact.priority}
                      </span>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="text-xs text-gray-500">
                    <div>Received: {new Date(selectedContact.createdAt).toLocaleString()}</div>
                    {selectedContact.lastContacted && (
                      <div>Last Contacted: {new Date(selectedContact.lastContacted).toLocaleString()}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleReply(selectedContact)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Reply
                  </button>
                  <button 
                    onClick={() => handleDeleteContacts([selectedContact.id])}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 font-poppins">Send Reply</h3>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircleIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">To</label>
                  <input
                    type="email"
                    value={replyData.to}
                    onChange={(e) => setReplyData({...replyData, to: e.target.value})}
                    disabled={isSendingReply}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      isSendingReply ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="recipient@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
                  <input
                    type="text"
                    value={replyData.subject}
                    onChange={(e) => setReplyData({...replyData, subject: e.target.value})}
                    disabled={isSendingReply}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      isSendingReply ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
                  <textarea
                    value={replyData.message}
                    onChange={(e) => setReplyData({...replyData, message: e.target.value})}
                    disabled={isSendingReply}
                    rows={8}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      isSendingReply ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="Type your reply message here..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={handleSendReply}
                  disabled={isSendingReply}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                    isSendingReply 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-blue-700'
                  }`}
                >
                  {isSendingReply ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Reply'
                  )}
                </button>
                <button
                  onClick={() => setShowReplyModal(false)}
                  disabled={isSendingReply}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                    isSendingReply 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send to All Modal */}
      {showSendToAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 font-poppins">Send Email to All Contacts</h3>
                <button
                  onClick={() => setShowSendToAllModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircleIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Recipients ({selectedEmails.length} of {allEmails.length} selected)
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddAllEmails}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={handleRemoveAllEmails}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                
                {selectedEmails.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {selectedEmails.map((email, index) => (
                        <div key={index} className="relative inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm group">
                          <span className="pr-1">{email}</span>
                          <button
                            onClick={() => handleRemoveEmail(email)}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove email"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500">No emails selected</p>
                    <button
                      onClick={handleAddAllEmails}
                      className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      Select All Emails
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
                  <input
                    type="text"
                    value={bulkEmailData.subject}
                    onChange={(e) => setBulkEmailData({...bulkEmailData, subject: e.target.value})}
                    disabled={isSendingToAll}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      isSendingToAll ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
                  <textarea
                    value={bulkEmailData.message}
                    onChange={(e) => setBulkEmailData({...bulkEmailData, message: e.target.value})}
                    disabled={isSendingToAll}
                    rows={8}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      isSendingToAll ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="Type your message here..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={handleSendToAll}
                  disabled={isSendingToAll || !bulkEmailData.subject || !bulkEmailData.message}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                    isSendingToAll || !bulkEmailData.subject || !bulkEmailData.message
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-blue-700'
                  }`}
                >
                  {isSendingToAll ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending to {selectedEmails.length} recipients...
                    </>
                  ) : (
                    `Send to Selected (${selectedEmails.length} recipients)`
                  )}
                </button>
                <button
                  onClick={() => setShowSendToAllModal(false)}
                  disabled={isSendingToAll}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                    isSendingToAll 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContactManager;
