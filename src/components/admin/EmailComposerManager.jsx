import React, { useState, useEffect, useCallback } from 'react';
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  TrashIcon,
  PlusIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ChevronLeftIcon,
  InboxStackIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import apiService from '../../services/api';

const showSuccess = (title, text) =>
  Swal.fire({ icon: 'success', title, text, confirmButtonColor: '#3b82f6' });
const showError = (title, text) =>
  Swal.fire({ icon: 'error', title, text, confirmButtonColor: '#ef4444' });

const EmailComposerManager = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('compose'); // compose | scheduled | automations | sent

  // Compose state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientEmails, setRecipientEmails] = useState([]);
  const [manualEmail, setManualEmail] = useState('');
  const [scheduleAt, setScheduleAt] = useState('');
  const [sending, setSending] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [contactEmails, setContactEmails] = useState([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);

  // Scheduled state
  const [scheduledList, setScheduledList] = useState([]);
  const [loadingScheduled, setLoadingScheduled] = useState(false);

  // Automations state
  const [automations, setAutomations] = useState([]);
  const [loadingAutomations, setLoadingAutomations] = useState(false);
  const [showAutomationForm, setShowAutomationForm] = useState(false);
  const [automationForm, setAutomationForm] = useState({
    name: '',
    subject: '',
    body: '',
    recipientType: 'optin_company',
    companyId: '',
    recipientEmails: [],
    intervalDays: 14,
    firstSendAt: '',
  });
  const [automationManualEmail, setAutomationManualEmail] = useState('');

  // Sent / Inbox state
  const [sentList, setSentList] = useState([]);
  const [loadingSent, setLoadingSent] = useState(false);
  const [viewingSent, setViewingSent] = useState(null);

  const loadCompanies = useCallback(async () => {
    try {
      const data = await apiService.getAllOptinCompanies();
      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      setCompanies([]);
    }
  }, []);

  const loadContactEmails = useCallback(async () => {
    setLoadingRecipients(true);
    try {
      const res = await apiService.getAllEmails();
      const list = (res.emails || []).filter(Boolean);
      setContactEmails(list);
      return list;
    } catch {
      setContactEmails([]);
      return [];
    } finally {
      setLoadingRecipients(false);
    }
  }, []);

  const loadScheduled = useCallback(async () => {
    setLoadingScheduled(true);
    try {
      const res = await apiService.getScheduledEmails();
      setScheduledList(res.data || []);
    } catch {
      setScheduledList([]);
    } finally {
      setLoadingScheduled(false);
    }
  }, []);

  const loadAutomations = useCallback(async () => {
    setLoadingAutomations(true);
    try {
      const res = await apiService.getEmailAutomations();
      setAutomations(res.data || []);
    } catch {
      setAutomations([]);
    } finally {
      setLoadingAutomations(false);
    }
  }, []);

  const loadSent = useCallback(async () => {
    setLoadingSent(true);
    try {
      const res = await apiService.getSentEmails({ limit: 50 });
      setSentList(res.data || []);
    } catch {
      setSentList([]);
    } finally {
      setLoadingSent(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    if (activeTab === 'scheduled') loadScheduled();
  }, [activeTab, loadScheduled]);

  useEffect(() => {
    if (activeTab === 'automations') loadAutomations();
  }, [activeTab, loadAutomations]);

  useEffect(() => {
    if (activeTab === 'sent') loadSent();
  }, [activeTab, loadSent]);

  const addRecipients = (emails) => {
    const next = [...new Set([...recipientEmails, ...emails.map((e) => String(e).trim()).filter(Boolean)])];
    setRecipientEmails(next);
  };

  const removeRecipient = (email) => {
    setRecipientEmails((prev) => prev.filter((e) => e !== email));
  };

  const addAllContacts = async () => {
    const list = await loadContactEmails();
    addRecipients(list);
  };

  const addCompanyOptin = async (companyId) => {
    if (!companyId) return;
    setLoadingRecipients(true);
    try {
      const data = await apiService.getAllOptinUsers(companyId);
      const list = (Array.isArray(data) ? data : []).map((u) => u.email).filter(Boolean);
      addRecipients(list);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const addManualEmail = () => {
    const e = manualEmail.trim();
    if (e) {
      addRecipients([e]);
      setManualEmail('');
    }
  };

  const sendNow = async () => {
    if (!subject.trim() || !message.trim()) {
      await showError('Validation', 'Subject and message are required.');
      return;
    }
    if (recipientEmails.length === 0) {
      await showError('Validation', 'Add at least one recipient.');
      return;
    }
    setSending(true);
    try {
      const res = await apiService.sendComposedEmail({ subject, message, emails: recipientEmails });
      if (res.success) {
        await showSuccess('Sent', `Email sent to ${res.sentCount} recipient(s).${res.failedCount ? ` ${res.failedCount} failed.` : ''}`);
        setSubject('');
        setMessage('');
        setRecipientEmails([]);
      } else {
        throw new Error(res.error || 'Send failed');
      }
    } catch (err) {
      await showError('Error', err.message || 'Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  const scheduleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      await showError('Validation', 'Subject and message are required.');
      return;
    }
    if (recipientEmails.length === 0) {
      await showError('Validation', 'Add at least one recipient.');
      return;
    }
    if (!scheduleAt.trim()) {
      await showError('Validation', 'Please choose a date and time for the scheduled send.');
      return;
    }
    const at = new Date(scheduleAt);
    if (isNaN(at.getTime()) || at <= new Date()) {
      await showError('Validation', 'Scheduled time must be in the future.');
      return;
    }
    setSending(true);
    try {
      const res = await apiService.scheduleEmail({
        subject,
        message,
        emails: recipientEmails,
        scheduledAt: at.toISOString(),
      });
      if (res.success) {
        await showSuccess('Scheduled', 'Email scheduled successfully.');
        setSubject('');
        setMessage('');
        setRecipientEmails([]);
        setScheduleAt('');
        if (activeTab === 'scheduled') loadScheduled();
      } else {
        throw new Error(res.error || 'Schedule failed');
      }
    } catch (err) {
      await showError('Error', err.message || 'Failed to schedule email.');
    } finally {
      setSending(false);
    }
  };

  const deleteScheduled = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Cancel scheduled email?',
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
    });
    if (!isConfirmed) return;
    try {
      const res = await apiService.deleteScheduledEmail(id);
      if (res.success) {
        await showSuccess('Cancelled', 'Scheduled email removed.');
        loadScheduled();
      } else throw new Error(res.error);
    } catch (err) {
      await showError('Error', err.message || 'Failed to delete.');
    }
  };

  const addAutomationRecipient = (emails) => {
    const next = [...new Set([...(automationForm.recipientEmails || []), ...emails.map((e) => String(e).trim()).filter(Boolean)])];
    setAutomationForm((p) => ({ ...p, recipientEmails: next }));
  };

  const removeAutomationRecipient = (email) => {
    setAutomationForm((p) => ({ ...p, recipientEmails: (p.recipientEmails || []).filter((e) => e !== email) }));
  };

  const saveAutomation = async () => {
    const { name, subject: subj, body, recipientType, companyId, recipientEmails, intervalDays, firstSendAt } = automationForm;
    if (!name.trim() || !subj.trim() || !body.trim()) {
      await showError('Validation', 'Name, subject, and message are required.');
      return;
    }
    if (recipientType === 'optin_company' && !companyId) {
      await showError('Validation', 'Please select a company.');
      return;
    }
    if (recipientType === 'individual') {
      const list = (recipientEmails || []).filter(Boolean);
      if (list.length === 0) {
        await showError('Validation', 'Add at least one recipient email for individual users.');
        return;
      }
    }
    const days = Math.max(1, parseInt(intervalDays, 10) || 14);
    try {
      const res = await apiService.createEmailAutomation({
        name: name.trim(),
        subject: subj.trim(),
        body: body.trim(),
        recipientType,
        companyId: recipientType === 'optin_company' ? parseInt(companyId, 10) : null,
        recipientEmails: recipientType === 'individual' ? (recipientEmails || []) : undefined,
        intervalDays: days,
        firstSendAt: firstSendAt || undefined,
      });
      if (res.success) {
        await showSuccess('Created', 'Automation created. It will run at the next due time.');
        setShowAutomationForm(false);
        setAutomationForm({
          name: '',
          subject: '',
          body: '',
          recipientType: 'optin_company',
          companyId: '',
          recipientEmails: [],
          intervalDays: 14,
          firstSendAt: '',
        });
        setAutomationManualEmail('');
        loadAutomations();
      } else throw new Error(res.error);
    } catch (err) {
      await showError('Error', err.message || 'Failed to create automation.');
    }
  };

  const toggleAutomationActive = async (id, isActive) => {
    try {
      const res = await apiService.updateEmailAutomation(id, { is_active: !isActive });
      if (res.success) {
        await showSuccess('Updated', isActive ? 'Automation paused.' : 'Automation enabled.');
        loadAutomations();
      } else throw new Error(res.error);
    } catch (err) {
      await showError('Error', err.message || 'Failed to update.');
    }
  };

  const deleteAutomation = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Delete automation?',
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
    });
    if (!isConfirmed) return;
    try {
      const res = await apiService.deleteEmailAutomation(id);
      if (res.success) {
        await showSuccess('Deleted', 'Automation removed.');
        loadAutomations();
      } else throw new Error(res.error);
    } catch (err) {
      await showError('Error', err.message || 'Failed to delete.');
    }
  };

  const formatScheduledAt = (str) => {
    try {
      const d = new Date(str);
      return isNaN(d.getTime()) ? str : d.toLocaleString();
    } catch {
      return str;
    }
  };

  return (
    <div className="p-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Settings
        </button>
      )}

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-2">Compose & schedule emails</h2>
        <p className="text-gray-600">Send emails to contacts or opt-in users, schedule sends, and set up recurring automations.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: 'compose', label: 'Compose', icon: EnvelopeIcon },
          { id: 'sent', label: 'Inbox', icon: InboxStackIcon },
          { id: 'scheduled', label: 'Scheduled', icon: CalendarDaysIcon },
          { id: 'automations', label: 'Automations', icon: ArrowPathIcon },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === id
                ? 'bg-primary text-white border-b-2 border-primary'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      {/* Compose tab */}
      {activeTab === 'compose' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Email subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                placeholder="Write your email..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={addAllContacts}
                  disabled={loadingRecipients}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 disabled:opacity-50"
                >
                  <UserGroupIcon className="w-4 h-4" />
                  Add all contacts
                </button>
                {companies.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => addCompanyOptin(c.id)}
                    disabled={loadingRecipients}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium hover:bg-emerald-200 disabled:opacity-50"
                  >
                    <BuildingOfficeIcon className="w-4 h-4" />
                    {c.name} (opt-in)
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addManualEmail())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Add individual email"
                />
                <button
                  type="button"
                  onClick={addManualEmail}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  <PlusIcon className="w-5 h-5 inline" /> Add
                </button>
              </div>
              {recipientEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                  {recipientEmails.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-sm"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => removeRecipient(email)}
                        className="text-gray-400 hover:text-red-600"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <span className="text-gray-500 text-sm self-center">({recipientEmails.length} total)</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={sendNow}
                disabled={sending || recipientEmails.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                Send now
              </button>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-gray-500" />
                <input
                  type="datetime-local"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={scheduleSend}
                  disabled={sending || recipientEmails.length === 0 || !scheduleAt}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Schedule send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sent / Inbox tab */}
      {activeTab === 'sent' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            {loadingSent ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
              </div>
            ) : sentList.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sent emails yet. Emails you send from Compose, Scheduled, or Automations will appear here.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {sentList.map((item) => (
                  <li key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{item.subject}</p>
                      <p className="text-sm text-gray-500">
                        {formatScheduledAt(item.sent_at)} · {item.recipient_count || (item.recipient_emails || []).length} recipients
                        {item.source === 'automation' && item.automation_name && ` · ${item.automation_name}`}
                        {item.source === 'compose' && ' · Composed'}
                        {item.source === 'scheduled' && ' · Scheduled'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingSent(item)}
                      className="p-2 text-primary hover:bg-blue-50 rounded-lg shrink-0"
                      title="View"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* View sent email modal */}
      {viewingSent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setViewingSent(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 truncate pr-4">{viewingSent.subject}</h3>
              <button type="button" onClick={() => setViewingSent(null)} className="text-gray-500 hover:text-gray-700 p-1">×</button>
            </div>
            <div className="p-4 text-sm text-gray-500 border-b border-gray-100">
              {formatScheduledAt(viewingSent.sent_at)} · {viewingSent.recipient_count || (viewingSent.recipient_emails || []).length} recipients
              {viewingSent.source === 'automation' && viewingSent.automation_name && ` · ${viewingSent.automation_name}`}
              {viewingSent.source === 'compose' && ' · Composed'}
              {viewingSent.source === 'scheduled' && ' · Scheduled'}
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <p className="text-gray-700 whitespace-pre-wrap">{viewingSent.body}</p>
            </div>
            {(viewingSent.recipient_emails || []).length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-xs font-medium text-gray-500 mb-2">Recipients</p>
                <p className="text-sm text-gray-600 break-all">{ (viewingSent.recipient_emails || []).join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scheduled tab */}
      {activeTab === 'scheduled' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            {loadingScheduled ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
              </div>
            ) : scheduledList.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No scheduled emails.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {scheduledList.map((item) => (
                  <li key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.subject}</p>
                      <p className="text-sm text-gray-500">
                        {formatScheduledAt(item.scheduled_at)} · {(item.recipient_emails || []).length} recipients
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteScheduled(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Cancel scheduled"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Automations tab */}
      {activeTab === 'automations' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowAutomationForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700"
            >
              <PlusIcon className="w-5 h-5" />
              New automation
            </button>
          </div>

          {showAutomationForm && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Create recurring email</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (for your reference)</label>
                <input
                  type="text"
                  value={automationForm.name}
                  onChange={(e) => setAutomationForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Bi-weekly newsletter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={automationForm.subject}
                  onChange={(e) => setAutomationForm((p) => ({ ...p, subject: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={automationForm.body}
                  onChange={(e) => setAutomationForm((p) => ({ ...p, body: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Send to</label>
                <select
                  value={automationForm.recipientType}
                  onChange={(e) => setAutomationForm((p) => ({ ...p, recipientType: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="contacts">All contact form subscribers</option>
                  <option value="optin_company">Opt-in users of a company</option>
                  <option value="individual">Specific users (individual emails)</option>
                </select>
                {automationForm.recipientType === 'optin_company' && (
                  <select
                    value={automationForm.companyId}
                    onChange={(e) => setAutomationForm((p) => ({ ...p, companyId: e.target.value }))}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
                {automationForm.recipientType === 'individual' && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => loadContactEmails().then(addAutomationRecipient)}
                        disabled={loadingRecipients}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 disabled:opacity-50"
                      >
                        <UserGroupIcon className="w-4 h-4" />
                        Add all contacts
                      </button>
                      {companies.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={async () => {
                            setLoadingRecipients(true);
                            try {
                              const data = await apiService.getAllOptinUsers(c.id);
                              const list = (Array.isArray(data) ? data : []).map((u) => u.email).filter(Boolean);
                              addAutomationRecipient(list);
                            } finally {
                              setLoadingRecipients(false);
                            }
                          }}
                          disabled={loadingRecipients}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium hover:bg-emerald-200 disabled:opacity-50"
                        >
                          <BuildingOfficeIcon className="w-4 h-4" />
                          {c.name}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={automationManualEmail}
                        onChange={(e) => setAutomationManualEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAutomationRecipient([automationManualEmail]), setAutomationManualEmail(''))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="Add individual email"
                      />
                      <button
                        type="button"
                        onClick={() => { addAutomationRecipient([automationManualEmail]); setAutomationManualEmail(''); }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                      >
                        <PlusIcon className="w-5 h-5 inline" /> Add
                      </button>
                    </div>
                    {(automationForm.recipientEmails || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                        {(automationForm.recipientEmails || []).map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-sm"
                          >
                            {email}
                            <button
                              type="button"
                              onClick={() => removeAutomationRecipient(email)}
                              className="text-gray-400 hover:text-red-600"
                              aria-label="Remove"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <span className="text-gray-500 text-sm self-center">({(automationForm.recipientEmails || []).length} recipients)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Repeat every (days)</label>
                <input
                  type="number"
                  min={1}
                  value={automationForm.intervalDays}
                  onChange={(e) => setAutomationForm((p) => ({ ...p, intervalDays: e.target.value }))}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
                <p className="text-sm text-gray-500 mt-1">e.g. 14 = every 2 weeks</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First send at (optional)</label>
                <input
                  type="datetime-local"
                  value={automationForm.firstSendAt}
                  onChange={(e) => setAutomationForm((p) => ({ ...p, firstSendAt: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
                <p className="text-sm text-gray-500 mt-1">Leave empty to use next run time.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveAutomation}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Create automation
                </button>
                <button
                  type="button"
                  onClick={() => setShowAutomationForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              {loadingAutomations ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
              ) : automations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No automations yet. Create one to send emails on a schedule (e.g. every 2 weeks).</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {automations.map((a) => (
                    <li key={a.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">{a.name}</p>
                        <p className="text-sm text-gray-500">
                          {a.subject} · every {a.interval_days} day(s) · to{' '}
                          {a.recipient_type === 'contacts' && 'all contacts'}
                          {a.recipient_type === 'optin_company' && (a.company_name || `company ${a.company_id}`)}
                          {a.recipient_type === 'individual' && `${(a.recipient_emails || []).length} user(s)`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Next run: {formatScheduledAt(a.next_sent_at)}
                          {a.last_sent_at ? ` · Last sent: ${formatScheduledAt(a.last_sent_at)}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleAutomationActive(a.id, !!a.is_active)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            a.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {a.is_active ? 'On' : 'Paused'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAutomation(a.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailComposerManager;
