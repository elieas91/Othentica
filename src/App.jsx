import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ui/ScrollToTop';
import Unsubscribe from './pages/Unsubscribe';
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import './App.css';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimers from './pages/Disclaimers';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const SocialMedia = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const OptIn = lazy(() => import('./pages/OptIn'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Login />
                  </Suspense>
                </AdminLayout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AdminLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Dashboard />
                  </Suspense>
                </AdminLayout>
              }
            />
            <Route path="/unsubscribe/:id" element={<Unsubscribe />} />
            <Route
              path="/*"
              element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/blog" element={<SocialMedia />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/opt-in" element={<OptIn />} />
                      <Route
                        path="/terms-conditions"
                        element={<TermsConditions />}
                      />
                      <Route
                        path="/privacy-policy"
                        element={<PrivacyPolicy />}
                      />
                      <Route path="/disclaimers" element={<Disclaimers />} />
                    </Routes>
                  </Suspense>
                </Layout>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
