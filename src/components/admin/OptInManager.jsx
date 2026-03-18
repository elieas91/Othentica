import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { 
  UserPlusIcon, 
  TrashIcon, 
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  LinkIcon,
  CheckIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const OPTIN_COMPANY_STORAGE_KEY = 'othentica_optin_selected_company_id';

const OptInManager = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyPicker, setShowCompanyPicker] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  // Company settings form (counter + video)
  const [counterMax, setCounterMax] = useState(1000);
  const [videoUrl, setVideoUrl] = useState('');
  const [savingCompany, setSavingCompany] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  // New company form (in modal)
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyCounterMax, setNewCompanyCounterMax] = useState(1000);
  const [newCompanyVideoUrl, setNewCompanyVideoUrl] = useState('');
  const [creatingCompany, setCreatingCompany] = useState(false);

  const loadCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const data = await apiService.getAllOptinCompanies();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading companies:', err);
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // Once companies loaded, restore selection or show picker
  useEffect(() => {
    if (loadingCompanies || companies.length === 0) return;
    const storedId = localStorage.getItem(OPTIN_COMPANY_STORAGE_KEY);
    const id = storedId ? parseInt(storedId, 10) : null;
    const found = id ? companies.find(c => c.id === id) : null;
    if (found) {
      setSelectedCompany(found);
      setShowCompanyPicker(false);
      setCounterMax(found.counter_max ?? 1000);
      setVideoUrl(found.video_url || '');
    } else {
      setShowCompanyPicker(true);
    }
  }, [loadingCompanies, companies]);

  const selectCompany = (company) => {
    setSelectedCompany(company);
    setShowCompanyPicker(false);
    setCounterMax(company.counter_max ?? 1000);
    setVideoUrl(company.video_url || '');
    localStorage.setItem(OPTIN_COMPANY_STORAGE_KEY, String(company.id));
  };

  const loadUsers = async () => {
    if (!selectedCompany) return;
    try {
      setLoading(true);
      const data = await apiService.getAllOptinUsers(selectedCompany.id);
      setUsers(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to load opt-in users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      loadUsers();
      loadStats();
    }
  }, [selectedCompany?.id]);

  const loadStats = async () => {
    try {
      const data = await apiService.getOptinStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSaveCompanySettings = async () => {
    if (!selectedCompany) return;
    try {
      setSavingCompany(true);
      await apiService.updateOptinCompany(selectedCompany.id, {
        counter_max: counterMax,
        video_url: videoUrl || null,
      });
      setSelectedCompany(prev => ({ ...prev, counter_max: counterMax, video_url: videoUrl || null }));
    } catch (err) {
      console.error('Error saving company:', err);
      setError('Failed to save company settings');
    } finally {
      setSavingCompany(false);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    try {
      setCreatingCompany(true);
      const created = await apiService.createOptinCompany({
        name: newCompanyName.trim(),
        counter_max: newCompanyCounterMax,
        video_url: newCompanyVideoUrl || null,
      });
      await loadCompanies();
      selectCompany(created);
      setShowNewCompanyForm(false);
      setNewCompanyName('');
      setNewCompanyCounterMax(1000);
      setNewCompanyVideoUrl('');
    } catch (err) {
      console.error('Error creating company:', err);
      setError(err?.message || 'Failed to create company');
    } finally {
      setCreatingCompany(false);
    }
  };

  const optInLink = selectedCompany
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/opt-in#${selectedCompany.slug}`
    : '';

  const copyLink = () => {
    if (!optInLink) return;
    navigator.clipboard.writeText(optInLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const handleDelete = async (userId) => {
    try {
      await apiService.deleteOptinUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setShowDeleteModal(null);
      await loadStats(); // Refresh stats
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleUpdate = async (userId, userData) => {
    try {
      await apiService.updateOptinUser(userId, userData);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...userData } : user
      ));
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = !filterCountry || user.country === filterCountry;
      
      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Get unique countries for filter
  const countries = [...new Set(users.map(user => user.country))].filter(Boolean);

  // Company picker modal (shown on first load or when switching)
  if (showCompanyPicker && !loadingCompanies) {
    return (
      <div className="p-6">
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-primary dark:text-white">Choose company</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Select which company to manage, or add a new one.
              </p>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {showNewCompanyForm ? (
                <form onSubmit={handleCreateCompany} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company name</label>
                    <input
                      type="text"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="e.g. IGI"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Counter max (spots)</label>
                    <input
                      type="number"
                      min={1}
                      value={newCompanyCounterMax}
                      onChange={(e) => setNewCompanyCounterMax(parseInt(e.target.value, 10) || 1000)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL (optional)</label>
                    <input
                      type="url"
                      value={newCompanyVideoUrl}
                      onChange={(e) => setNewCompanyVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setShowNewCompanyForm(false); setError(''); }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingCompany}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
                    >
                      {creatingCompany ? 'Creating…' : 'Create'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {companies.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No companies yet. Create the first one.</p>
                  ) : (
                    <ul className="space-y-2">
                      {companies.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => selectCompany(c)}
                            className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                          >
                            <BuildingOfficeIcon className="w-5 h-5 text-primary" />
                            <span className="font-medium text-primary dark:text-white">{c.name}</span>
                            <span className="text-gray-500 text-sm">/{c.slug}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={() => { setShowNewCompanyForm(true); setError(''); }}
                    className="mt-4 w-full px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" /> Add new company
                  </button>
                </>
              )}
            </div>
            {error && (
              <div className="px-6 pb-4 text-red-600 dark:text-red-400 text-sm">{error}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading && selectedCompany) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header + company selector */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-primary font-poppins mb-2">
            Opt-in Management
          </h2>
          <p className="text-gray-600 text-lg">
            Manage early access registrations and user data
            {selectedCompany && (
              <span className="ml-2 text-primary font-medium">— {selectedCompany.name}</span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCompanyPicker(true)}
          className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 flex items-center gap-2"
        >
          <BuildingOfficeIcon className="w-5 h-5" /> Switch company
        </button>
      </div>

      {/* Company settings: counter + video + link */}
      {selectedCompany && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-professional border border-accent/20 p-6 mb-6">
          <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">Company settings & share link</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Counter max (spots left = this − registrations)</label>
              <input
                type="number"
                min={1}
                value={counterMax}
                onChange={(e) => setCounterMax(parseInt(e.target.value, 10) || 1000)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL (YouTube embed)</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleSaveCompanySettings}
              disabled={savingCompany}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              {savingCompany ? 'Saving…' : 'Save settings'}
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <LinkIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <code className="text-sm text-gray-600 dark:text-gray-400 truncate">{optInLink}</code>
              <button
                type="button"
                onClick={copyLink}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex-shrink-0"
              >
                {linkCopied ? <CheckIcon className="w-4 h-4 text-green-600" /> : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional p-6 border border-accent/20">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <UserPlusIcon className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <p className="text-3xl font-bold text-primary font-poppins">{stats.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional p-6 border border-accent/20">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <GlobeAltIcon className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Countries</p>
                <p className="text-3xl font-bold text-primary font-poppins">{stats.byCountry?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional p-6 border border-accent/20">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                <CalendarIcon className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-primary font-poppins">{stats.recent || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional p-6 border border-accent/20">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-secondary to-orange-500 rounded-xl shadow-lg">
                <ChartBarIcon className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-3xl font-bold text-primary font-poppins">
                  {stats.recent > 0 ? `+${Math.round((stats.recent / stats.total) * 100)}%` : '0%'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-professional border border-accent/20 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="created_at">Sort by Date</option>
            <option value="first_name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="country">Sort by Country</option>
            <option value="status">Sort by Status</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-professional border border-accent/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary to-blue-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Phone</th>
                <th className="px-6 py-4 text-left font-semibold">Company</th>
                <th className="px-6 py-4 text-left font-semibold">Country</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-primary">{user.first_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600">{user.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600">{user.country}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600">{user.status}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(user.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserPlusIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No opt-in users found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-primary mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-primary mb-4">Edit User</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const userData = {
                firstName: formData.get('firstName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company'),
                country: formData.get('country')
              };
              handleUpdate(editingUser.id, userData);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={editingUser.first_name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingUser.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingUser.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={editingUser.company}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    defaultValue={editingUser.country}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptInManager;
