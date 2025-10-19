import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Button from '../ui/Button';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [, setHomepageSections] = useState([]);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [appFeatures, setAppFeatures] = useState([]);
  const [securityFeatures, setSecurityFeatures] = useState([]);
  const [mobileShowcase, setMobileShowcase] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({});

  // Helper function to map activeTab to API type
  const getApiType = (tab) => {
    const typeMapping = {
      'homepage': 'homepage',
      'services': 'service',
      'clients': 'client', 
      'features': 'feature',
      'security': 'security',
      'showcase': 'showcase'
    };
    return typeMapping[tab] || tab;
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [homepageRes, servicesRes, clientsRes, featuresRes, securityRes, showcaseRes] = await Promise.all([
        apiService.getHomepageSections(),
        apiService.getServices(),
        apiService.getClients(),
        apiService.getAppFeatures(),
        apiService.getSecurityFeatures(),
        apiService.getMobileShowcaseItems()
      ]);

      if (homepageRes.success) setHomepageSections(homepageRes.data);
      if (servicesRes.success) setServices(servicesRes.data);
      if (clientsRes.success) setClients(clientsRes.data);
      if (featuresRes.success) setAppFeatures(featuresRes.data);
      if (securityRes.success) setSecurityFeatures(securityRes.data);
      if (showcaseRes.success) setMobileShowcase(showcaseRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generic CRUD handlers
  const handleCreate = async (type, data) => {
    try {
      let response;
      switch (type) {
        case 'service':
          response = await apiService.createService(data);
          break;
        case 'client':
          response = await apiService.createClient(data);
          break;
        case 'feature':
          response = await apiService.createAppFeature(data);
          break;
        case 'security':
          response = await apiService.createSecurityFeature(data);
          break;
        case 'showcase':
          response = await apiService.createMobileShowcaseItem(data);
          break;
        default:
          throw new Error('Invalid type');
      }
      
      if (response.success) {
        fetchAllData();
        setShowCreateForm(false);
        setFormData({});
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`);
      }
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      alert(`Error creating ${type}`);
    }
  };

  const handleUpdate = async (type, id, data) => {
    try {
      let response;
      switch (type) {
        case 'service':
          response = await apiService.updateService(id, data);
          break;
        case 'client':
          response = await apiService.updateClient(id, data);
          break;
        case 'feature':
          response = await apiService.updateAppFeature(id, data);
          break;
        case 'security':
          response = await apiService.updateSecurityFeature(id, data);
          break;
        case 'showcase':
          response = await apiService.updateMobileShowcaseItem(id, data);
          break;
        case 'homepage':
          response = await apiService.upsertHomepageSection({
            section_key: id,
            ...data
          });
          break;
        default:
          throw new Error('Invalid type');
      }
      
      if (response.success) {
        fetchAllData();
        setEditingItem(null);
        setFormData({});
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      alert(`Error updating ${type}`);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      let response;
      switch (type) {
        case 'service':
          response = await apiService.deleteService(id);
          break;
        case 'client':
          response = await apiService.deleteClient(id);
          break;
        case 'feature':
          response = await apiService.deleteAppFeature(id);
          break;
        case 'security':
          response = await apiService.deleteSecurityFeature(id);
          break;
        case 'showcase':
          response = await apiService.deleteMobileShowcaseItem(id);
          break;
        default:
          throw new Error('Invalid type');
      }
      
      if (response.success) {
        fetchAllData();
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Error deleting ${type}`);
    }
  };

  const startEdit = (item, type) => {
    setEditingItem({ ...item, type: getApiType(type) });
    setFormData(item);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setFormData({});
  };

  const startCreate = (type) => {
    setShowCreateForm(getApiType(type));
    setFormData({});
  };

  const cancelCreate = () => {
    setShowCreateForm(false);
    setFormData({});
  };

  // Enhanced Generic form component
  const GenericForm = ({ type, onSubmit, onCancel, initialData = {} }) => {
    const [data, setData] = useState(initialData);

    const getFormFields = () => {
      switch (type) {
        case 'homepage':
          return [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'subtitle', label: 'Subtitle', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'button_text', label: 'Button Text', type: 'text' },
            { key: 'button_link', label: 'Button Link', type: 'text' }
          ];
        case 'service':
          return [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'section_id', label: 'Section ID', type: 'select', options: [
              { value: 'app', label: 'App' },
              { value: 'programs', label: 'Programs' },
              { value: 'talks', label: 'Talks' },
              { value: 'one-to-one', label: 'One-to-One' }
            ]},
            { key: 'button_text', label: 'Button Text', type: 'text' },
            { key: 'icon_url', label: 'Icon URL', type: 'text' },
            { key: 'background_color', label: 'Background Color', type: 'text' }
          ];
        case 'client':
          return [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'logo_url', label: 'Logo URL', type: 'text' },
            { key: 'industry', label: 'Industry', type: 'text' },
            { key: 'website_url', label: 'Website URL', type: 'text' }
          ];
        case 'feature':
          return [
            { key: 'feature', label: 'Feature', type: 'textarea' },
            { key: 'category', label: 'Category', type: 'select', options: [
              { value: 'onboarding', label: 'Onboarding' },
              { value: 'gamification', label: 'Gamification' },
              { value: 'tracking', label: 'Tracking' },
              { value: 'content', label: 'Content' },
              { value: 'integration', label: 'Integration' },
              { value: 'security', label: 'Security' },
              { value: 'general', label: 'General' }
            ]}
          ];
        case 'security':
          return [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'icon', label: 'Icon', type: 'text' }
          ];
        case 'showcase':
          return [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'image_url', label: 'Image URL', type: 'text' },
            { key: 'video_url', label: 'Video URL', type: 'text' }
          ];
        default:
          return [];
      }
    };

    const fields = getFormFields();

    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-800 px-5 py-3">
          <h3 className="text-lg font-semibold text-white font-poppins">
            {editingItem ? `✏️ Edit ${type}` : `➕ Create New ${type}`}
          </h3>
          <p className="text-white/80 text-xs mt-1">
            {editingItem ? `Update the ${type} information` : `Add a new ${type} to your content`}
          </p>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(field => (
              <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-primary mb-1.5 font-poppins">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={data[field.key] || ''}
                    onChange={(e) => setData({...data, [field.key]: e.target.value})}
                    className="w-full p-3 border border-accent/30 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 font-montserrat text-sm resize-none"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    rows={3}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={data[field.key] || ''}
                    onChange={(e) => setData({...data, [field.key]: e.target.value})}
                    className="w-full p-3 border border-accent/30 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 font-montserrat text-sm"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={data[field.key] || ''}
                    onChange={(e) => setData({...data, [field.key]: e.target.value})}
                    className="w-full p-3 border border-accent/30 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 font-montserrat text-sm"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => onSubmit(data)}
              className="flex-1 bg-gradient-to-r from-primary to-blue-800 hover:from-blue-800 hover:to-primary text-white px-4 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium font-poppins flex items-center justify-center gap-2 text-sm"
            >
              <CheckIcon className="w-4 h-4" />
              {editingItem ? 'Update' : 'Create'}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-white/90 backdrop-blur-sm border border-accent/30 text-primary hover:bg-accent/10 px-4 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md font-medium font-poppins flex items-center justify-center gap-2 text-sm"
            >
              <XMarkIcon className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Generic list component
  const GenericList = ({ items, type, onEdit, onDelete }) => {
    if (!items || items.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8 border border-accent/20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-primary font-poppins mb-2">No {type}s found</h3>
            <p className="text-gray-600 mb-6">Create your first {type} to get started!</p>
            <Button
              onClick={() => startCreate(activeTab)}
              className="bg-gradient-to-r from-primary to-blue-800 hover:from-blue-800 hover:to-primary text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create First {type}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="group bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-accent/20 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-base text-primary font-poppins mb-1 line-clamp-2">
                    {item.title || item.name || item.feature?.substring(0, 40) + '...'}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2 font-montserrat">
                    {item.description || item.subtitle || item.feature}
                  </p>
                </div>
                <div className="flex gap-1 ml-3">
                  <button
                    onClick={() => onEdit(item, type)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-md transition-all duration-200 hover:scale-105"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(type, item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 hover:scale-105"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {item.industry && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-medium">
                    🏢 {item.industry}
                  </span>
                )}
                {item.category && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-medium">
                    🏷️ {item.category}
                  </span>
                )}
                {item.section_id && (
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-md font-medium">
                    📂 {item.section_id}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral via-white to-accent/20">
      <div className="w-full p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-primary font-poppins mb-2">Content Manager</h1>
              <p className="text-gray-600 text-lg">Manage your website content and sections</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => startCreate(activeTab)}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-800 hover:from-blue-800 hover:to-primary text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
              >
                <PlusIcon className="w-5 h-5" />
                Add New
              </Button>
              <Button
                variant="secondary"
                onClick={fetchAllData}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-accent/20 text-primary hover:bg-accent/10 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
              >
                <EyeIcon className="w-5 h-5" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'services', label: 'Services', icon: '⚙️', description: 'Service offerings' },
              { key: 'clients', label: 'Clients', icon: '👥', description: 'Client information' },
              { key: 'features', label: 'App Features', icon: '✨', description: 'App features' },
              { key: 'security', label: 'Security', icon: '🔒', description: 'Security features' },
              { key: 'showcase', label: 'Mobile', icon: '📱', description: 'Mobile showcase' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group relative px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.key 
                    ? 'bg-gradient-to-r from-primary to-blue-800 text-white shadow-lg' 
                    : 'bg-white/90 backdrop-blur-sm border border-accent/20 text-gray-700 hover:bg-accent/10 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tab.icon}</span>
                  <div className="text-left">
                    <div className="font-medium font-poppins text-sm">{tab.label}</div>
                    <div className={`text-xs ${activeTab === tab.key ? 'text-white/80' : 'text-gray-500'}`}>
                      {tab.description}
                    </div>
                  </div>
                </div>
                {activeTab === tab.key && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Create/Edit Form */}
          {(showCreateForm === getApiType(activeTab) || editingItem) && (
            <div className="animate-fadeInUpSmooth">
              <GenericForm
                type={activeTab}
                initialData={editingItem || formData}
                onSubmit={(data) => {
                  if (editingItem) {
                    handleUpdate(editingItem.type, editingItem.id || editingItem.section_key, data);
                  } else {
                    handleCreate(getApiType(activeTab), data);
                  }
                }}
                onCancel={() => {
                  if (editingItem) {
                    cancelEdit();
                  } else {
                    cancelCreate();
                  }
                }}
              />
            </div>
          )}

          {/* Enhanced List View */}
          <div className="animate-fadeInUpSmooth">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-professional border border-accent/20 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-blue-800 px-6 py-4">
                  <h3 className="text-xl font-bold text-white font-poppins">
                    {activeTab === 'services' && '⚙️ Services Management'}
                    {activeTab === 'clients' && '👥 Clients Management'}
                    {activeTab === 'features' && '✨ App Features Management'}
                    {activeTab === 'security' && '🔒 Security Features Management'}
                    {activeTab === 'showcase' && '📱 Mobile Showcase Management'}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    {activeTab === 'services' && 'Manage your service offerings and descriptions'}
                    {activeTab === 'clients' && 'Manage client information and testimonials'}
                    {activeTab === 'features' && 'Manage app features and benefits'}
                    {activeTab === 'security' && 'Manage security features and compliance'}
                    {activeTab === 'showcase' && 'Manage mobile showcase items and demos'}
                  </p>
                </div>
                
                <div className="p-6">
                  {activeTab === 'services' && (
                    <GenericList
                      items={services}
                      type="service"
                      onEdit={startEdit}
                      onDelete={handleDelete}
                    />
                  )}
                  
                  {activeTab === 'clients' && (
                    <GenericList
                      items={clients}
                      type="client"
                      onEdit={startEdit}
                      onDelete={handleDelete}
                    />
                  )}
                  
                  {activeTab === 'features' && (
                    <GenericList
                      items={appFeatures}
                      type="feature"
                      onEdit={startEdit}
                      onDelete={handleDelete}
                    />
                  )}
                  
                  {activeTab === 'security' && (
                    <GenericList
                      items={securityFeatures}
                      type="security"
                      onEdit={startEdit}
                      onDelete={handleDelete}
                    />
                  )}
                  
                  {activeTab === 'showcase' && (
                    <GenericList
                      items={mobileShowcase}
                      type="showcase"
                      onEdit={startEdit}
                      onDelete={handleDelete}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ContentManager;