import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserList from './UserList';
import UserDetail from './UserDetail';
import RoleManagement from './RoleManagement';
import './UserManagement.css';

/**
 * Componente principal para o módulo de gerenciamento de usuários
 * Gerencia as rotas internas para lista de usuários, detalhes e gerenciamento de papéis
 */
const UserManagement = () => {
  return (
    <div className="user-management-container">
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/detail/:userId" element={<UserDetail />} />
        <Route path="/new" element={<UserDetail isNew={true} />} />
        <Route path="/roles" element={<RoleManagement />} />
        <Route path="*" element={<Navigate to="/user-management" replace />} />
      </Routes>
    </div>
  );
};

export default UserManagement;
