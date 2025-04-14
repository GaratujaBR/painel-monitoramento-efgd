import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ReportList from './ReportList';
import ReportDetail from './ReportDetail';
import ReportGenerator from './ReportGenerator';
import './Reports.css';

/**
 * Componente principal do módulo de relatórios
 * Gerencia as rotas internas do módulo de relatórios
 */
const Reports = () => {
  return (
    <Routes>
      <Route path="/" element={<ReportList />} />
      <Route path="/new" element={<ReportGenerator />} />
      <Route path="/:id" element={<ReportDetail />} />
      <Route path="*" element={<Navigate to="/reports" replace />} />
    </Routes>
  );
};

export default Reports;
