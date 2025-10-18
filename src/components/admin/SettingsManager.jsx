import React, { useState, useEffect, useCallback } from 'react';
import { 
  Cog6ToothIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import apiService from '../../services/api';

const SettingsManager = () => {
  const [activeSection, setActiveSection] = useState('main'); // 'main', 'auto-reply', 'testimonial-email', 'testimonial-approval-email'
  const [autoReplyMessage, setAutoReplyMessage] = useState('');
  const [testimonialEmailMessage, setTestimonialEmailMessage] = useState('');
  const [testimonialApprovalEmailMessage, setTestimonialApprovalEmailMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const [isEditingTestimonialApproval, setIsEditingTestimonialApproval] = useState(false);

  useEffect(() => {
    if (activeSection === 'auto-reply') {
      fetchAutoReplyMessage();
    } else if (activeSection === 'testimonial-email') {
      fetchTestimonialEmailMessage();
    } else if (activeSection === 'testimonial-approval-email') {
      fetchTestimonialApprovalEmailMessage();
    }
  }, [activeSection, fetchAutoReplyMessage, fetchTestimonialEmailMessage, fetchTestimonialApprovalEmailMessage]);

  const fetchAutoReplyMessage = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAutoReplyMessage();
      if (response.success) {
        setAutoReplyMessage(response.message || '');
      } else {
        throw new Error(response.error || 'Failed to fetch auto-reply message');
      }
    } catch (error) {
      console.error('Fetch auto-reply message error:', error);
      await showErrorAlert('Error', `Failed to fetch auto-reply message: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveAutoReply = async () => {
    if (!autoReplyMessage.trim()) {
      await showErrorAlert('Validation Error', 'Auto-reply message cannot be empty.');
      return;
    }

    try {
      setIsSaving(true);
      const response = await apiService.updateAutoReplyMessage(autoReplyMessage);
      if (response.success) {
        await showSuccessAlert('Success', 'Auto-reply message updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error(response.error || 'Failed to update auto-reply message');
      }
    } catch (error) {
      console.error('Update auto-reply message error:', error);
      await showErrorAlert('Error', `Failed to update auto-reply message: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    fetchAutoReplyMessage(); // Reset to original value
  };

  const fetchTestimonialEmailMessage = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getTestimonialEmailMessage();
      if (response.success) {
        setTestimonialEmailMessage(response.message || '');
      } else {
        throw new Error(response.error || 'Failed to fetch testimonial email message');
      }
    } catch (error) {
      console.error('Fetch testimonial email message error:', error);
      await showErrorAlert('Error', `Failed to fetch testimonial email message: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTestimonialApprovalEmailMessage = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getTestimonialApprovalEmailMessage();
      if (response.success) {
        setTestimonialApprovalEmailMessage(response.message || '');
      } else {
        throw new Error(response.error || 'Failed to fetch testimonial approval email message');
      }
    } catch (error) {
      console.error('Fetch testimonial approval email message error:', error);
      await showErrorAlert('Error', `Failed to fetch testimonial approval email message: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveTestimonialEmail = async () => {
    if (!testimonialEmailMessage.trim()) {
      await showErrorAlert('Validation Error', 'Testimonial email message cannot be empty.');
      return;
    }

    try {
      setIsSaving(true);
      const response = await apiService.updateTestimonialEmailMessage(testimonialEmailMessage);
      if (response.success) {
        await showSuccessAlert('Success', 'Testimonial email message updated successfully!');
        setIsEditingTestimonial(false);
      } else {
        throw new Error(response.error || 'Failed to update testimonial email message');
      }
    } catch (error) {
      console.error('Update testimonial email message error:', error);
      await showErrorAlert('Error', `Failed to update testimonial email message: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelTestimonialEdit = () => {
    setIsEditingTestimonial(false);
    fetchTestimonialEmailMessage(); // Reset to original value
  };

  const handleSaveTestimonialApprovalEmail = async () => {
    if (!testimonialApprovalEmailMessage.trim()) {
      await showErrorAlert('Validation Error', 'Testimonial approval email message cannot be empty.');
      return;
    }

    try {
      setIsSaving(true);
      const response = await apiService.updateTestimonialApprovalEmailMessage(testimonialApprovalEmailMessage);
      
      if (response.success) {
        await showSuccessAlert('Success!', 'Testimonial approval email message updated successfully.');
        setIsEditingTestimonialApproval(false);
      } else {
        throw new Error(response.error || 'Failed to update testimonial approval email message');
      }
    } catch (error) {
      console.error('Save testimonial approval email message error:', error);
      await showErrorAlert('Error', `Failed to save testimonial approval email message: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelTestimonialApprovalEdit = () => {
    setIsEditingTestimonialApproval(false);
    fetchTestimonialApprovalEmailMessage(); // Reset to original value
  };

  const showSuccessAlert = (title, text) => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'OK'
    });
  };

  const showErrorAlert = (title, text) => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'OK'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Main Settings Menu
  if (activeSection === 'main') {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-2">Settings</h2>
          <p className="text-gray-600">Manage your website settings and configurations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Auto-Reply Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <EnvelopeIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Auto-Reply Message</h3>
                <p className="text-gray-600 text-sm">Configure automatic responses</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Set up automatic email responses sent to users who submit contact forms.
            </p>
            <button
              onClick={() => setActiveSection('auto-reply')}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Configure Auto-Reply
            </button>
          </div>

          {/* Testimonial Email Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <EnvelopeIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Testimonial Email</h3>
                <p className="text-gray-600 text-sm">Configure testimonial confirmations</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Set up automatic email responses sent to users who submit testimonials.
            </p>
            <button
              onClick={() => setActiveSection('testimonial-email')}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Configure Testimonial Email
            </button>
          </div>

          {/* Testimonial Approval Email Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <EnvelopeIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Testimonial Approval Email</h3>
                <p className="text-gray-600 text-sm">Configure approval notifications</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Set up automatic email notifications sent when testimonials are approved.
            </p>
            <button
              onClick={() => setActiveSection('testimonial-approval-email')}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Configure Approval Email
            </button>
          </div>

          {/* Email Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Cog6ToothIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Email Settings</h3>
                <p className="text-gray-600 text-sm">SMTP and email preferences</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Configure email server settings and delivery preferences.
            </p>
            <button
              disabled
              className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed font-medium"
            >
              Coming Soon
            </button>
          </div>

          {/* General Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Cog6ToothIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">General Settings</h3>
                <p className="text-gray-600 text-sm">Website configuration</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Manage general website settings and preferences.
            </p>
            <button
              disabled
              className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed font-medium"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Auto-Reply Configuration Section
  if (activeSection === 'auto-reply') {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => setActiveSection('main')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Settings
          </button>
          <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-2">Auto-Reply Message</h2>
          <p className="text-gray-600">Configure the automatic response sent to contact form submissions</p>
        </div>

      {/* Auto-Reply Message Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <EnvelopeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-poppins">Auto-Reply Message</h3>
              <p className="text-blue-100 text-sm">Configure the automatic response sent to contact form submissions</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-Reply Message
            </label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">How it works</h4>
                  <p className="text-blue-800 text-sm">
                    When someone fills out your contact form, they will automatically receive this message. 
                    You can personalize it with their name and include your message details.
                  </p>
                </div>
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Auto-Reply Message
                  </label>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Tip:</strong> You can use these placeholders that will be automatically filled in:
                    </p>
                    <ul className="mt-2 text-yellow-700 text-sm space-y-1">
                      <li>• <code className="bg-yellow-100 px-1 rounded">[NAME]</code> - Will show the person's name</li>
                      <li>• <code className="bg-yellow-100 px-1 rounded">[SUBJECT]</code> - Will show their message subject</li>
                      <li>• <code className="bg-yellow-100 px-1 rounded">[MESSAGE]</code> - Will show their message</li>
                    </ul>
                  </div>
                  <textarea
                    value={autoReplyMessage}
                    onChange={(e) => setAutoReplyMessage(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                    placeholder="Hi [NAME],&#10;&#10;Thank you for contacting us! We have received your message about '[SUBJECT]' and will get back to you within 24 hours.&#10;&#10;Your message:&#10;[MESSAGE]&#10;&#10;Best regards,&#10;The Othentica Team"
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm">
                    {autoReplyMessage ? (
                      <div className="whitespace-pre-wrap text-gray-700">
                        {autoReplyMessage
                          .replace(/\[NAME\]/g, 'John Doe')
                          .replace(/\[SUBJECT\]/g, 'Website Inquiry')
                          .replace(/\[MESSAGE\]/g, 'I would like to know more about your services.')
                        }
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Start typing to see a preview...</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveAutoReply}
                    disabled={isSaving}
                    className={`px-6 py-3 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                      isSaving 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Save Message
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                  >
                    <XCircleIcon className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {autoReplyMessage ? (
                        <div className="whitespace-pre-wrap text-gray-700 text-sm">
                          {autoReplyMessage
                            .replace(/\[NAME\]/g, 'John Doe')
                            .replace(/\[SUBJECT\]/g, 'Website Inquiry')
                            .replace(/\[MESSAGE\]/g, 'I would like to know more about your services.')
                          }
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <EnvelopeIcon className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">No auto-reply message set</p>
                          <p className="text-gray-400 text-sm mt-1">Click the button below to create one</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <PencilIcon className="w-5 h-5" />
                  {autoReplyMessage ? 'Edit Auto-Reply Message' : 'Create Auto-Reply Message'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    );
  }

  // Testimonial Email Configuration Section
  if (activeSection === 'testimonial-email') {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => setActiveSection('main')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Settings
          </button>
          <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-2">Testimonial Email</h2>
          <p className="text-gray-600">Configure the automatic response sent to testimonial submissions</p>
        </div>

        {/* Testimonial Email Message Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <EnvelopeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-poppins">Testimonial Email Message</h3>
                <p className="text-green-100 text-sm">Configure the automatic response sent to testimonial submissions</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Testimonial Email Message
              </label>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">How it works</h4>
                    <p className="text-green-800 text-sm">
                      When someone submits a testimonial, they will automatically receive this message. 
                      You can personalize it with their name and testimonial details.
                    </p>
                  </div>
                </div>
              </div>
              
              {isEditingTestimonial ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Testimonial Email Message
                    </label>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Tip:</strong> You can use these placeholders that will be automatically filled in:
                      </p>
                      <ul className="mt-2 text-yellow-700 text-sm space-y-1">
                        <li>• <code className="bg-yellow-100 px-1 rounded">[NAME]</code> - Will show the person's name</li>
                        <li>• <code className="bg-yellow-100 px-1 rounded">[CATEGORY]</code> - Will show the service category</li>
                        <li>• <code className="bg-yellow-100 px-1 rounded">[TESTIMONIAL]</code> - Will show their testimonial text</li>
                      </ul>
                    </div>
                    <textarea
                      value={testimonialEmailMessage}
                      onChange={(e) => setTestimonialEmailMessage(e.target.value)}
                      rows={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                      placeholder="Hi [NAME],&#10;&#10;Thank you for sharing your experience with [CATEGORY]! We've received your testimonial and our team is currently reviewing it.&#10;&#10;We'll notify you once your testimonial is approved and published on our website.&#10;&#10;Your testimonial:&#10;[TESTIMONIAL]&#10;&#10;Best regards,&#10;The Othentica Team"
                    />
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm">
                      {testimonialEmailMessage ? (
                        <div className="whitespace-pre-wrap text-gray-700">
                          {testimonialEmailMessage
                            .replace(/\[NAME\]/g, 'John Doe')
                            .replace(/\[CATEGORY\]/g, 'Tailored Programs')
                            .replace(/\[TESTIMONIAL\]/g, 'I had an amazing experience with Othentica. The program helped me improve my mental health significantly.')
                          }
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Start typing to see a preview...</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveTestimonialEmail}
                      disabled={isSaving}
                      className={`px-6 py-3 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                        isSaving 
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-5 h-5" />
                          Save Message
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleCancelTestimonialEdit}
                      disabled={isSaving}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {testimonialEmailMessage ? (
                          <div className="whitespace-pre-wrap text-gray-700 text-sm">
                            {testimonialEmailMessage
                              .replace(/\[NAME\]/g, 'John Doe')
                              .replace(/\[CATEGORY\]/g, 'Tailored Programs')
                              .replace(/\[TESTIMONIAL\]/g, 'I had an amazing experience with Othentica. The program helped me improve my mental health significantly.')
                            }
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <EnvelopeIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No testimonial email message set</p>
                            <p className="text-gray-400 text-sm mt-1">Click the button below to create one</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsEditingTestimonial(true)}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-5 h-5" />
                    {testimonialEmailMessage ? 'Edit Testimonial Email Message' : 'Create Testimonial Email Message'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Testimonial Approval Email Configuration Section
  if (activeSection === 'testimonial-approval-email') {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => setActiveSection('main')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Settings
          </button>
          <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-2">Testimonial Approval Email</h2>
          <p className="text-gray-600">Configure the notification sent when testimonials are approved</p>
        </div>

        {/* Testimonial Approval Email Message Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <EnvelopeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-poppins">Testimonial Approval Email Message</h3>
                <p className="text-purple-100 text-sm">Configure the notification sent when testimonials are approved</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Testimonial Approval Email Message
              </label>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">How it works</h4>
                    <p className="text-purple-800 text-sm">
                      When a testimonial is approved, the user will automatically receive this notification email. 
                      You can personalize it with their name and testimonial details.
                    </p>
                  </div>
                </div>
              </div>
              
              {isEditingTestimonialApproval ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Testimonial Approval Email Message
                    </label>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Tip:</strong> You can use these placeholders that will be automatically filled in:
                      </p>
                      <ul className="mt-2 text-yellow-700 text-sm space-y-1">
                        <li>• <code className="bg-yellow-100 px-1 rounded">[NAME]</code> - Will show the person's name</li>
                        <li>• <code className="bg-yellow-100 px-1 rounded">[CATEGORY]</code> - Will show the service category</li>
                        <li>• <code className="bg-yellow-100 px-1 rounded">[TESTIMONIAL]</code> - Will show their testimonial text</li>
                        <li>• <code className="bg-yellow-100 px-1 rounded">[WEBSITE_URL]</code> - Will show your website URL</li>
                      </ul>
                    </div>
                    <textarea
                      value={testimonialApprovalEmailMessage}
                      onChange={(e) => setTestimonialApprovalEmailMessage(e.target.value)}
                      rows={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                      placeholder={`Hi [NAME],\n\nGreat news! Your testimonial for [CATEGORY] has been approved and is now live on our website.\n\nWe truly appreciate you taking the time to share your experience with us. Your feedback helps other potential clients understand the value of our services.\n\nYour approved testimonial:\n"[TESTIMONIAL]"\n\nYou can view it on our website at: [WEBSITE_URL]\n\nThank you again for your support and for helping us grow!\n\nBest regards,\nThe Othentica Team`}
                    />
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm">
                      {testimonialApprovalEmailMessage ? (
                        <div className="whitespace-pre-wrap text-gray-700">
                          {testimonialApprovalEmailMessage
                            .replace(/\[NAME\]/g, 'John Doe')
                            .replace(/\[CATEGORY\]/g, 'Tailored Programs')
                            .replace(/\[TESTIMONIAL\]/g, 'I had an amazing experience with Othentica. The program helped me improve my mental health significantly.')
                            .replace(/\[WEBSITE_URL\]/g, 'https://othentica.com')
                          }
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Start typing to see a preview...</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveTestimonialApprovalEmail}
                      disabled={isSaving}
                      className={`px-6 py-3 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                        isSaving 
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-5 h-5" />
                          Save Message
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleCancelTestimonialApprovalEdit}
                      disabled={isSaving}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {testimonialApprovalEmailMessage ? (
                          <div className="whitespace-pre-wrap text-gray-700 text-sm">
                            {testimonialApprovalEmailMessage
                              .replace(/\[NAME\]/g, 'John Doe')
                              .replace(/\[CATEGORY\]/g, 'Tailored Programs')
                              .replace(/\[TESTIMONIAL\]/g, 'I had an amazing experience with Othentica. The program helped me improve my mental health significantly.')
                              .replace(/\[WEBSITE_URL\]/g, 'https://othentica.com')
                            }
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <EnvelopeIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No testimonial approval email message set</p>
                            <p className="text-gray-400 text-sm mt-1">Click the button below to create one</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsEditingTestimonialApproval(true)}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-5 h-5" />
                    {testimonialApprovalEmailMessage ? 'Edit Testimonial Approval Email Message' : 'Create Testimonial Approval Email Message'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default return (should not reach here)
  return null;
};

export default SettingsManager;
