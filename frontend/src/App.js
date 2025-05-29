import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { InitiativesProvider } from './context/InitiativesContext';
import { NotificationsProvider } from './context/NotificationsContext';
import Autenticador from './components/Autenticador';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './components/dashboard/Dashboard';
import InitiativeList from './components/initiatives/InitiativeList';
import InitiativeDetail from './components/initiatives/InitiativeDetail';
import InitiativeForm from './components/initiatives/InitiativeForm';
import NotificationList from './components/notifications/NotificationList';
import NotificationDetail from './components/notifications/NotificationDetail';
import ReportList from './components/reports/ReportList';
import ReportDetail from './components/reports/ReportDetail';
import ReportGenerator from './components/reports/ReportGenerator';
import UserManagement from './components/user-management/UserManagement';
import './App.css';

function App() {
  return (
<Router>
      <InitiativesProvider>
        <NotificationsProvider>
          <div className="App">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Autenticador>
                    <DashboardLayout />
                  </Autenticador>
                }
              >
                {/* Dashboard routes */}
                <Route index element={<Dashboard />} />
                
                {/* Initiative routes */}
                <Route path="initiatives" element={<InitiativeList />} />
                <Route path="initiatives/new" element={<InitiativeForm />} />
                <Route path="initiatives/:id" element={<InitiativeDetail />} />
                <Route path="initiatives/:id/edit" element={<InitiativeForm />} />
                
                {/* Notification routes */}
                <Route path="notifications" element={<NotificationList />} />
                <Route path="notifications/:id" element={<NotificationDetail />} />
                
                {/* Report routes */}
                <Route path="reports" element={<ReportList />} />
                <Route path="reports/new" element={<ReportGenerator />} />
                <Route path="reports/:id" element={<ReportDetail />} />
                
                {/* User Management routes */}
                <Route path="user-management/*" element={<UserManagement />} />
                
                {/* Other routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </div>
        </NotificationsProvider>
      </InitiativesProvider>
    </Router>
  );
}

export default App;
