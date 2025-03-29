import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InitiativesProvider } from './context/InitiativesContext';
import { NotificationsProvider } from './context/NotificationsContext';
import LoginForm from './components/LoginForm';
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
import DashboardPreview from './components/DashboardPreview';
import DashboardSimulator from './components/DashboardSimulator';
import InitiativeSimulator from './components/initiatives/InitiativeSimulator';
import NotificationSimulator from './components/notifications/NotificationSimulator';
import ReportSimulator from './components/reports/ReportSimulator';
import UserManagementSimulator from './components/users/UserManagementSimulator';
import './App.css';

// Protected Route component to ensure authenticated access
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Carregando...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <InitiativesProvider>
          <NotificationsProvider>
            <div className="App">
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/preview" element={<DashboardPreview />} />
                <Route path="/simulator" element={<DashboardSimulator />} />
                <Route path="/initiatives-simulator" element={<InitiativeSimulator />} />
                <Route path="/notifications-simulator" element={<NotificationSimulator />} />
                <Route path="/reports-simulator" element={<ReportSimulator />} />
                <Route path="/user-management-simulator" element={<UserManagementSimulator />} />
                
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
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
      </AuthProvider>
    </Router>
  );
}

export default App;
