import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaUserPlus, FaUserEdit, FaTrash, FaEllipsisV, FaUserCog, FaLock, FaEnvelope, FaPhone, FaIdCard } from 'react-icons/fa';
import './Users.css';
import '../DashboardSimulator.css';
import tituloMonitora from '../../images/titulo-monitora.png';

/**
 * Componente para simular a página de gerenciamento de usuários
 */
const UserManagementSimulator = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Dados fictícios de usuários
  const mockUsers = [
    {
      id: 1,
      name: 'Ana Silva',
      email: 'ana.silva@gov.br',
      role: 'admin',
      department: 'Tecnologia da Informação',
      status: 'active',
      lastLogin: '2025-03-12T10:30:00',
      phone: '(61) 3333-1111',
      document: '123.456.789-00'
    },
    {
      id: 2,
      name: 'Carlos Mendes',
      email: 'carlos.mendes@gov.br',
      role: 'manager',
      department: 'Planejamento Estratégico',
      status: 'active',
      lastLogin: '2025-03-11T15:45:00',
      phone: '(61) 3333-2222',
      document: '234.567.890-11'
    },
    {
      id: 3,
      name: 'Mariana Costa',
      email: 'mariana.costa@gov.br',
      role: 'editor',
      department: 'Comunicação',
      status: 'active',
      lastLogin: '2025-03-10T09:15:00',
      phone: '(61) 3333-3333',
      document: '345.678.901-22'
    },
    {
      id: 4,
      name: 'Paulo Rodrigues',
      email: 'paulo.rodrigues@gov.br',
      role: 'viewer',
      department: 'Monitoramento e Avaliação',
      status: 'inactive',
      lastLogin: '2025-02-28T11:20:00',
      phone: '(61) 3333-4444',
      document: '456.789.012-33'
    },
    {
      id: 5,
      name: 'Fernanda Lima',
      email: 'fernanda.lima@gov.br',
      role: 'editor',
      department: 'Gestão de Projetos',
      status: 'active',
      lastLogin: '2025-03-09T14:10:00',
      phone: '(61) 3333-5555',
      document: '567.890.123-44'
    },
    {
      id: 6,
      name: 'Roberto Alves',
      email: 'roberto.alves@gov.br',
      role: 'manager',
      department: 'Infraestrutura Digital',
      status: 'pending',
      lastLogin: null,
      phone: '(61) 3333-6666',
      document: '678.901.234-55'
    },
    {
      id: 7,
      name: 'Juliana Santos',
      email: 'juliana.santos@gov.br',
      role: 'admin',
      department: 'Tecnologia da Informação',
      status: 'active',
      lastLogin: '2025-03-12T08:30:00',
      phone: '(61) 3333-7777',
      document: '789.012.345-66'
    },
    {
      id: 8,
      name: 'Lucas Oliveira',
      email: 'lucas.oliveira@gov.br',
      role: 'viewer',
      department: 'Monitoramento e Avaliação',
      status: 'active',
      lastLogin: '2025-03-11T16:45:00',
      phone: '(61) 3333-8888',
      document: '890.123.456-77'
    },
    {
      id: 9,
      name: 'Camila Ferreira',
      email: 'camila.ferreira@gov.br',
      role: 'editor',
      department: 'Comunicação',
      status: 'inactive',
      lastLogin: '2025-02-20T10:15:00',
      phone: '(61) 3333-9999',
      document: '901.234.567-88'
    },
    {
      id: 10,
      name: 'Rafael Souza',
      email: 'rafael.souza@gov.br',
      role: 'manager',
      department: 'Planejamento Estratégico',
      status: 'active',
      lastLogin: '2025-03-10T13:20:00',
      phone: '(61) 3444-1111',
      document: '012.345.678-99'
    },
    {
      id: 11,
      name: 'Patrícia Gomes',
      email: 'patricia.gomes@gov.br',
      role: 'viewer',
      department: 'Gestão de Projetos',
      status: 'active',
      lastLogin: '2025-03-09T11:30:00',
      phone: '(61) 3444-2222',
      document: '123.456.789-10'
    },
    {
      id: 12,
      name: 'Daniel Castro',
      email: 'daniel.castro@gov.br',
      role: 'editor',
      department: 'Infraestrutura Digital',
      status: 'pending',
      lastLogin: null,
      phone: '(61) 3444-3333',
      document: '234.567.890-21'
    }
  ];

  // Função para filtrar usuários com base no termo de busca e filtros
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Paginação
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Função para obter o texto do papel do usuário
  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      case 'editor':
        return 'Editor';
      case 'viewer':
        return 'Visualizador';
      default:
        return role;
    }
  };

  // Função para obter o texto do status do usuário
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  // Função para obter a classe CSS do status do usuário
  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  // Função para selecionar/deselecionar um usuário
  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Função para selecionar/deselecionar todos os usuários
  const toggleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user.id));
    }
  };

  // Navegação para outras páginas
  const navigateToDashboardSimulator = () => {
    navigate('/simulator');
  };

  const navigateToInitiativesSimulator = () => {
    navigate('/initiatives-simulator');
  };

  const navigateToNotificationsSimulator = () => {
    navigate('/notifications-simulator');
  };

  const navigateToReportsSimulator = () => {
    navigate('/reports-simulator');
  };

  // Função para mudar de página
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="dashboard-simulator">
      <div className="dashboard-layout-container">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="logo">EFGD</div>
          </div>
          <div className="sidebar-menu">
            <div className="sidebar-menu-item" onClick={navigateToDashboardSimulator}>Dashboard</div>
            <div className="sidebar-menu-item" onClick={navigateToInitiativesSimulator}>Iniciativas</div>
            <div className="sidebar-menu-item" onClick={navigateToNotificationsSimulator}>Notificações</div>
            <div className="sidebar-menu-item" onClick={navigateToReportsSimulator}>Relatórios</div>
            <div className="sidebar-menu-item active">Usuários</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-title">
              <img src={tituloMonitora} alt="Estratégia Federal de Governo Digital" className="header-logo" />
            </div>
            <div className="header-user">
              <div className="user-info">
                <div className="user-name">João Silva</div>
                <div className="user-role">Administrador</div>
              </div>
              <div className="user-avatar">JS</div>
            </div>
          </div>

          {/* Content */}
          <div className="dashboard-content">
            <div className="users-container">
              <div className="users-header">
                <h1>Gerenciamento de Usuários</h1>
                <button className="new-user-button">
                  <FaUserPlus /> Novo Usuário
                </button>
              </div>

              <div className="users-filters">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="search-icon" />
                </div>

                <div className="filter-box">
                  <FaFilter className="filter-icon" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">Todos os Papéis</option>
                    <option value="admin">Administrador</option>
                    <option value="manager">Gerente</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Visualizador</option>
                  </select>
                </div>

                <div className="filter-box">
                  <FaUserCog className="filter-icon" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Todos os Status</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="pending">Pendente</option>
                  </select>
                </div>
              </div>

              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th className="checkbox-column">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Departamento</th>
                      <th>Papel</th>
                      <th>Status</th>
                      <th>Último Acesso</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="no-users">
                          <div className="no-users-message">
                            <FaUserCog className="no-users-icon" />
                            <p>Nenhum usuário encontrado</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user) => (
                        <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected' : ''}>
                          <td className="checkbox-column">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                            />
                          </td>
                          <td className="user-name-cell">
                            <div className="user-avatar-small">{user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</div>
                            <span>{user.name}</span>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.department}</td>
                          <td>
                            <span className={`role-badge role-${user.role}`}>
                              {getRoleText(user.role)}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${getStatusClass(user.status)}`}>
                              {getStatusText(user.status)}
                            </span>
                          </td>
                          <td>{formatDate(user.lastLogin)}</td>
                          <td className="actions-column">
                            <button className="action-button" title="Editar Usuário">
                              <FaUserEdit />
                            </button>
                            <button className="action-button" title="Redefinir Senha">
                              <FaLock />
                            </button>
                            <button className="action-button" title="Excluir Usuário">
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="users-pagination">
                <span className="pagination-info">Mostrando {currentUsers.length} de {filteredUsers.length} usuários</span>
                <div className="pagination-controls">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button
                      key={pageNumber}
                      className={`pagination-button ${pageNumber === currentPage ? 'active' : ''}`}
                      onClick={() => changePage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
              </div>

              {selectedUsers.length > 0 && (
                <div className="bulk-actions">
                  <span>{selectedUsers.length} usuários selecionados</span>
                  <div className="bulk-actions-buttons">
                    <button className="bulk-action-button">
                      <FaUserCog /> Alterar Papel
                    </button>
                    <button className="bulk-action-button">
                      <FaLock /> Redefinir Senhas
                    </button>
                    <button className="bulk-action-button danger">
                      <FaTrash /> Excluir Selecionados
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para detalhes do usuário (não implementado completamente) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="user-details-modal">
            <div className="modal-header">
              <h2>Detalhes do Usuário</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-content">
              {/* Conteúdo do modal seria preenchido com os detalhes do usuário selecionado */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementSimulator;
