import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './DashboardLayout.css';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Verifica a largura da tela ao montar o componente
  useEffect(() => {
    const checkScreenWidth = () => {
      const isMobile = window.innerWidth <= 768;
      setSidebarOpen(!isMobile); // Fecha a sidebar em telas móveis
    };

    // Verifica inicialmente
    checkScreenWidth();

    // Adiciona listener para redimensionamento
    window.addEventListener('resize', checkScreenWidth);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

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
