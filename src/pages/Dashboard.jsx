import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import TestimonialsManager from '../components/admin/TestimonialsManager';
import LogoWhite from '../assets/img/logo_white.webp';
import { 
  Bars3Icon, 
  HomeIcon, 
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

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

  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: HomeIcon, color: 'from-blue-500 to-blue-600' },
    { id: 'testimonials', name: 'Testimonials', icon: ChatBubbleLeftRightIcon, color: 'from-secondary to-orange-500' },
    { id: 'users', name: 'Users', icon: UsersIcon, color: 'from-green-500 to-emerald-600' },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon, color: 'from-purple-500 to-violet-600' },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon, color: 'from-gray-500 to-gray-600' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'testimonials':
        return <TestimonialsManager />;
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
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-3xl font-bold text-primary font-poppins">98.5%</p>
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
                  <div className="grid grid-cols-2 gap-6">
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
                      onClick={() => setActiveSection('users')}
                      className="group p-6 bg-gradient-to-br from-white to-accent/5 border border-accent/20 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
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
      } overflow-hidden`}>
        <div 
          className="w-80 h-full bg-gradient-to-br from-primary via-primary to-blue-900 shadow-xl"
          onMouseEnter={() => setIsHoveringSidebar(true)}
          onMouseLeave={() => setIsHoveringSidebar(false)}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center gap-3">
                <img 
                  src={LogoWhite} 
                  alt="Othentica Logo" 
                  className="h-8 w-auto"
                />
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white/5 to-transparent">
              <div className="p-6">
                <nav className="space-y-3">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          if (!sidebarPinned) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                          activeSection === item.id
                            ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                          activeSection === item.id
                            ? `bg-gradient-to-r ${item.color} shadow-lg`
                            : 'bg-white/20 group-hover:bg-white/30'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium font-poppins">{item.name}</span>
                      </button>
                    );
                  })}
                </nav>
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-accent/20">
          <div className="px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-6">
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-3 rounded-xl bg-gradient-to-r from-primary to-blue-800 text-white hover:from-blue-800 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Bars3Icon className="w-6 h-6" />
                  </button>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-primary font-poppins">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 font-medium">
                    Welcome back, <span className="text-secondary font-semibold">{user?.name || user?.username}</span>!
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
