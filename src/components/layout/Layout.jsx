import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div className="Layout">
      <Navigation />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
};

export default Layout;
