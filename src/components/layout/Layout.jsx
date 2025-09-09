import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const isOptInPage = location.pathname === '/opt-in';
  
  return (
    <div className="Layout">
      <Navigation />
      <main className="pt-20">
        {children}
      </main>
      <Footer minimal={isOptInPage} />
    </div>
  );
};

export default Layout;
