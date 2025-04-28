import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const checkScreenWidth = () => {
      const isMobile = window.innerWidth <= 768;
      setSidebarOpen(!isMobile);
    };
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`dashboard-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="dashboard-main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
