import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ui/ScrollToTop';
import { Home, About, Services, SocialMedia, Contact, Login, Register, Dashboard } from './pages';
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import './App.css';

function App() {
  
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={
            <AdminLayout>
              <Login />
            </AdminLayout>
          } />
          <Route path="/dashboard" element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          } />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<SocialMedia />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
