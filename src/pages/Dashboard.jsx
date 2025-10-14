import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import apiService from '../services/api';
import TestimonialsManager from '../components/admin/TestimonialsManager';
import OptInManager from '../components/admin/OptInManager';
import BlogManager from '../components/admin/BlogManager';
import ContentManager from '../components/admin/ContentManager';
import HomepageSectionsManager from '../components/admin/HomepageSectionsManager';
import AboutManager from '../components/admin/AboutManager';
import ServicesManager from '../components/admin/ServicesManager';
import ServicesBannerManager from '../components/admin/ServicesBannerManager';
import LogoWhite from '../assets/img/logo_white.webp';
import { 
  Bars3Icon, 
  HomeIcon, 
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  BookmarkIcon,
  UserPlusIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [activePage, setActivePage] = useState('homepage');
  const [activeHomepageSection, setActiveHomepageSection] = useState('hero');
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);
  const [blogCount, setBlogCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    } else {
      // Fetch blog count for overview
      fetchBlogCount();
    }
  }, [isAuthenticated, navigate]);

  const fetchBlogCount = async () => {
    try {
      const response = await apiService.getAllBlogs();
      if (response.success) {
        setBlogCount(response.data.length);
      }
    } catch (error) {
      console.error('Error fetching blog count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  // Auto-close sidebar when not pinned and not hovering
  useEffect(() => {
    if (!sidebarPinned && sidebarOpen && !isHoveringSidebar) {
      const timer = setTimeout(() => {
        setSidebarOpen(false);
      }, 500); // 500ms delay before closing

      return () => clearTimeout(timer);
    }
  }, [sidebarPinned, sidebarOpen, isHoveringSidebar]);

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  // Website pages navigation
  const websitePages = [
    { id: 'homepage', name: 'Homepage', icon: HomeIcon, color: 'from-blue-500 to-blue-600', description: 'Main landing page' },
    { id: 'about', name: 'About', icon: UsersIcon, color: 'from-green-500 to-emerald-600', description: 'About us page' },
    { id: 'services', name: 'Services', icon: BookmarkIcon, color: 'from-purple-500 to-violet-600', description: 'Services page' },
    { id: 'contact', name: 'Contact', icon: ChatBubbleLeftRightIcon, color: 'from-secondary to-orange-500', description: 'Contact page' },
    { id: 'blog', name: 'Blog', icon: DocumentTextIcon, color: 'from-teal-500 to-cyan-600', description: 'Blog listing page' },
  ];

  // Homepage sections
  const homepageSections = [
    { id: 'hero', name: 'Hero Section', description: 'Main banner with call-to-action' },
    { id: 'philosophy', name: 'Philosophy', description: 'What is Othentica section' },
    { id: 'services', name: 'Services', description: 'Our Solutions section' },
    { id: 'clients', name: 'Clients', description: 'Our Clients section' },
    { id: 'features', name: 'Features', description: 'App Features & Benefits section' },
    { id: 'security', name: 'Security', description: 'Enterprise Security section' },
    { id: 'mobile_showcase', name: 'Mobile Showcase', description: 'Mobile Experience section' }
  ];

  // Admin sections
  const adminSections = [
    { id: 'overview', name: 'Overview', icon: HomeIcon, color: 'from-blue-500 to-blue-600' },
    { id: 'about_manager', name: 'About Page', icon: UsersIcon, color: 'from-green-500 to-emerald-600' },
    { id: 'testimonials', name: 'Testimonials', icon: ChatBubbleLeftRightIcon, color: 'from-secondary to-orange-500' },
    { id: 'blogs', name: 'Blog Posts', icon: DocumentTextIcon, color: 'from-teal-500 to-cyan-600' },
    { id: 'optin', name: 'Opt-in Users', icon: UserPlusIcon, color: 'from-green-500 to-emerald-600' },
    { id: 'users', name: 'Users', icon: UsersIcon, color: 'from-purple-500 to-violet-600' },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon, color: 'from-gray-500 to-gray-600' },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon, color: 'from-gray-500 to-gray-600' },
  ];

  const renderContent = () => {
    // Handle website pages
    if (activePage === 'homepage' && activeSection === 'homepage') {
      return <HomepageSectionsManager activeSection={activeHomepageSection} onSectionChange={setActiveHomepageSection} />;
    }
    if (activePage === 'about' && activeSection === 'about') {
      return <AboutManager />;
    }
    if (activePage === 'services' && activeSection === 'services') {
      return (
        <div className="space-y-8">
          <ServicesBannerManager />
          <ServicesManager />
        </div>
      );
    }
    
    // Handle admin sections
    switch (activeSection) {
      case 'about_manager':
        return <AboutManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'blogs':
        return <BlogManager />;
      case 'optin':
        return <OptInManager />;
      case 'users':
        return <div className="p-6"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h2><p className="text-gray-600 dark:text-gray-400">Coming soon...</p></div>;
      case 'analytics':
        return <div className="p-6"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2><p className="text-gray-600 dark:text-gray-400">Coming soon...</p></div>;
      case 'settings':
        return <div className="p-6"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2><p className="text-gray-600 dark:text-gray-400">Coming soon...</p></div>;
      default:
        return (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-primary font-poppins mb-2">Dashboard Overview</h2>
              <p className="text-gray-600 text-lg">Monitor your website's performance and manage content</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional p-6 border border-accent/20 hover:shadow-xl-professional transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-primary font-poppins">1,234</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional p-6 border border-accent/20 hover:shadow-xl-professional transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-secondary to-orange-500 rounded-xl shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Testimonials</p>
                    <p className="text-3xl font-bold text-primary font-poppins">14</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional p-6 border border-accent/20 hover:shadow-xl-professional transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Page Views</p>
                    <p className="text-3xl font-bold text-primary font-poppins">12,345</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional p-6 border border-accent/20 hover:shadow-xl-professional transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
                    <DocumentTextIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                    <p className="text-3xl font-bold text-primary font-poppins">{blogCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional border border-accent/20">
                <div className="px-8 py-6 border-b border-accent/20">
                  <h3 className="text-xl font-bold text-primary font-poppins">Quick Actions</h3>
                  <p className="text-gray-600 mt-1">Access frequently used features</p>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button 
                      onClick={() => setActiveSection('testimonials')}
                      className="group p-6 bg-gradient-to-br from-white to-accent/5 border border-accent/20 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-secondary to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-primary font-poppins">Manage Testimonials</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => setActiveSection('blogs')}
                      className="group p-6 bg-gradient-to-br from-white to-accent/5 border border-accent/20 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                          <DocumentTextIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-primary font-poppins">Manage Blogs</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => setActiveSection('optin')}
                      className="group p-6 bg-gradient-to-br from-white to-accent/5 border border-accent/20 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                          <UserPlusIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-primary font-poppins">Manage Opt-ins</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => setActiveSection('content')}
                      className="group p-6 bg-gradient-to-br from-white to-accent/5 border border-accent/20 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                          <BookmarkIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-primary font-poppins">Manage Content</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => setActiveSection('users')}
                      className="group p-6 bg-gradient-to-br from-white to-accent/5 border border-accent/20 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                          <UsersIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-primary font-poppins">Manage Users</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional border border-accent/20">
                <div className="px-8 py-6 border-b border-accent/20">
                  <h3 className="text-xl font-bold text-primary font-poppins">User Information</h3>
                  <p className="text-gray-600 mt-1">Your account details</p>
                </div>
                <div className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-800 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-primary font-poppins">{user?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-600">@{user?.username || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <p className="text-primary font-medium">{user?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                        <p className="text-primary font-medium">Administrator</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-neutral via-white to-accent/20 flex">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'w-80' : 'w-0'
      } overflow-hidden flex-shrink-0`}>
        <div 
          className="w-80 h-full bg-gradient-to-br from-primary via-primary to-blue-900 shadow-xl"
          onMouseEnter={() => setIsHoveringSidebar(true)}
          onMouseLeave={() => setIsHoveringSidebar(false)}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/20">
              <div className="flex items-center gap-3">
                <img 
                  src={LogoWhite} 
                  alt="Othentica Logo" 
                  className="h-7 w-auto"
                />
                {/* <span className="text-white font-semibold font-poppins text-sm">Admin Panel</span> */}
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white/5 to-transparent scrollbar-hide">
              <div className="p-5">
                {/* Website Pages Section */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 font-poppins">
                    Website Pages
                  </h3>
                  <nav className="space-y-1">
                    {websitePages.map((page) => {
                      const Icon = page.icon;
                      const isActive = activePage === page.id && activeSection === page.id;
                      return (
                        <div key={page.id}>
                          <button
                            onClick={() => {
                              setActivePage(page.id);
                              setActiveSection(page.id);
                              if (!sidebarPinned) setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-300 group ${
                              isActive
                                ? 'bg-white/20 text-white shadow-md backdrop-blur-sm'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className={`p-1.5 rounded-md transition-all duration-300 ${
                              isActive
                                ? `bg-gradient-to-r ${page.color} shadow-md`
                                : 'bg-white/20 group-hover:bg-white/30'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium font-poppins text-sm">{page.name}</div>
                              <div className="text-xs text-white/60">{page.description}</div>
                            </div>
                          </button>
                          
                        </div>
                      );
                    })}
                  </nav>
                </div>

                {/* Admin Sections */}
                <div>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 font-poppins">
                    Admin Tools
                  </h3>
                  <nav className="space-y-1">
                    {adminSections.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSection(item.id);
                            setActivePage('admin');
                            if (!sidebarPinned) setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-300 group ${
                            activeSection === item.id && activePage === 'admin'
                              ? 'bg-white/20 text-white shadow-md backdrop-blur-sm'
                              : 'text-white/80 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className={`p-1.5 rounded-md transition-all duration-300 ${
                            activeSection === item.id && activePage === 'admin'
                              ? `bg-gradient-to-r ${item.color} shadow-md`
                              : 'bg-white/20 group-hover:bg-white/30'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium font-poppins text-sm">{item.name}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>

            {/* Sidebar Footer with Pin Button */}
            <div className="p-6 border-t border-white/20">
              <div className="flex justify-end">
                <button
                  onClick={() => setSidebarPinned(!sidebarPinned)}
                  className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                  title={sidebarPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}
                >
                  {sidebarPinned ? (
                    <BookmarkIconSolid className="w-6 h-6 text-accent group-hover:scale-110 transition-transform duration-200" />
                  ) : (
                    <BookmarkIcon className="w-6 h-6 text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-accent/10">
          <div className="px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2.5 rounded-lg bg-gradient-to-r from-primary to-blue-800 text-white hover:from-blue-800 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Bars3Icon className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-primary font-poppins">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Welcome back, <span className="text-secondary font-medium">{user?.name || user?.username}</span>!
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium font-poppins text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
