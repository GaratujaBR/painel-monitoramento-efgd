import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaFilter, FaEye } from 'react-icons/fa';

/**
 * Componente para exibir a lista de usuários com opções de filtragem e busca
 */
const UserList = () => {
  const navigate = useNavigate();
  
  // Estado para armazenar a lista de usuários
  const [users, setUsers] = useState([]);
  // Estado para armazenar os filtros aplicados
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all'
  });
  // Estado para paginação
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10
  });

  // Dados de exemplo para usuários
  const mockUsers = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@gov.br',
      role: 'admin',
      department: 'Tecnologia da Informação',
      status: 'active',
      lastAccess: '2025-03-14T10:30:00'
    },
    {
      id: 2,
      name: 'Maria Oliveira',
      email: 'maria.oliveira@gov.br',
      role: 'manager',
      department: 'Recursos Humanos',
      status: 'active',
      lastAccess: '2025-03-13T14:45:00'
    },
    {
      id: 3,
      name: 'Pedro Santos',
      email: 'pedro.santos@gov.br',
      role: 'user',
      department: 'Finanças',
      status: 'inactive',
      lastAccess: '2025-02-28T09:15:00'
    },
    {
      id: 4,
      name: 'Ana Costa',
      email: 'ana.costa@gov.br',
      role: 'user',
      department: 'Atendimento',
      status: 'active',
      lastAccess: '2025-03-14T16:20:00'
    },
    {
      id: 5,
      name: 'Carlos Ferreira',
      email: 'carlos.ferreira@gov.br',
      role: 'manager',
      department: 'Operações',
      status: 'pending',
      lastAccess: null
    }
  ];

  // Efeito para carregar os usuários (simulado com dados de exemplo)
  useEffect(() => {
    // Em uma implementação real, aqui seria feita uma chamada à API
    setUsers(mockUsers);
    setPagination({
      ...pagination,
      totalPages: Math.ceil(mockUsers.length / pagination.itemsPerPage)
    });
  }, []);

  // Função para filtrar os usuários com base nos filtros aplicados
  const getFilteredUsers = () => {
    return users.filter(user => {
      // Filtro por termo de busca
      const matchesSearch = 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.department.toLowerCase().includes(filters.search.toLowerCase());
      
      // Filtro por papel
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      
      // Filtro por status
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  // Função para obter os usuários da página atual
  const getCurrentPageUsers = () => {
    const filteredUsers = getFilteredUsers();
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    
    return filteredUsers.slice(startIndex, endIndex);
  };

  // Função para atualizar os filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    // Resetar para a primeira página ao mudar os filtros
    setPagination({
      ...pagination,
      currentPage: 1
    });
  };

  // Função para navegar para uma página específica
  const goToPage = (page) => {
    setPagination({
      ...pagination,
      currentPage: page
    });
  };

  // Função para formatar a data de último acesso
  const formatLastAccess = (dateString) => {
    if (!dateString) return 'Nunca acessou';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para navegar para a página de detalhes do usuário
  const handleViewUser = (userId) => {
    navigate(`/user-management/detail/${userId}`);
  };

  // Função para navegar para a página de edição do usuário
  const handleEditUser = (userId) => {
    navigate(`/user-management/detail/${userId}`);
  };

  // Função para excluir um usuário (simulada)
  const handleDeleteUser = (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      // Em uma implementação real, aqui seria feita uma chamada à API
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      
      // Atualizar paginação se necessário
      const totalPages = Math.ceil(updatedUsers.length / pagination.itemsPerPage);
      if (pagination.currentPage > totalPages) {
        setPagination({
          ...pagination,
          currentPage: totalPages || 1,
          totalPages
        });
      } else {
        setPagination({
          ...pagination,
          totalPages
        });
      }
    }
  };

  // Renderizar a lista de usuários
  const filteredUsers = getFilteredUsers();
  const currentPageUsers = getCurrentPageUsers();
  const totalPages = Math.ceil(filteredUsers.length / pagination.itemsPerPage);

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2 className="user-list-title">Gerenciamento de Usuários</h2>
        <div className="user-management-actions">
          <Link to="/user-management/new" className="user-detail-action-button primary">
            <FaUserPlus /> Novo Usuário
          </Link>
          <Link to="/user-management/roles" className="user-detail-action-button secondary">
            Gerenciar Papéis
          </Link>
        </div>
      </div>
      
      <div className="user-list-filters">
        <div className="user-list-search">
          <FaSearch />
          <input
            type="text"
            name="search"
            placeholder="Buscar por nome, email ou departamento..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="user-list-filter">
          <select
            name="role"
            className="user-list-filter-select"
            value={filters.role}
            onChange={handleFilterChange}
          >
            <option value="all">Todos os papéis</option>
            <option value="admin">Administrador</option>
            <option value="manager">Gerente</option>
            <option value="user">Usuário</option>
          </select>
        </div>
        
        <div className="user-list-filter">
          <select
            name="status"
            className="user-list-filter-select"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="pending">Pendente</option>
          </select>
        </div>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="user-list-empty">
          <p>Nenhum usuário encontrado com os filtros aplicados.</p>
        </div>
      ) : (
        <>
          <table className="user-list-table">
            <thead>
              <tr>
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
              {currentPageUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td>
                    <span className={`user-role user-role-${user.role}`}>
                      {user.role === 'admin' && 'Administrador'}
                      {user.role === 'manager' && 'Gerente'}
                      {user.role === 'user' && 'Usuário'}
                    </span>
                  </td>
                  <td>
                    <span className={`user-status user-status-${user.status}`}>
                      {user.status === 'active' && 'Ativo'}
                      {user.status === 'inactive' && 'Inativo'}
                      {user.status === 'pending' && 'Pendente'}
                    </span>
                  </td>
                  <td>{formatLastAccess(user.lastAccess)}</td>
                  <td className="user-actions">
                    <button 
                      className="user-action-button"
                      onClick={() => handleViewUser(user.id)}
                      title="Visualizar"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="user-action-button"
                      onClick={() => handleEditUser(user.id)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="user-action-button delete"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Excluir"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="user-list-pagination">
              <button
                className="pagination-button"
                onClick={() => goToPage(1)}
                disabled={pagination.currentPage === 1}
              >
                &laquo;
              </button>
              
              <button
                className="pagination-button"
                onClick={() => goToPage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                &lt;
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Mostrar apenas 5 páginas por vez
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      className={`pagination-button ${pageNumber === pagination.currentPage ? 'active' : ''}`}
                      onClick={() => goToPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  (pageNumber === pagination.currentPage - 2 && pagination.currentPage > 3) ||
                  (pageNumber === pagination.currentPage + 2 && pagination.currentPage < totalPages - 2)
                ) {
                  return <span key={pageNumber}>...</span>;
                }
                return null;
              })}
              
              <button
                className="pagination-button"
                onClick={() => goToPage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === totalPages}
              >
                &gt;
              </button>
              
              <button
                className="pagination-button"
                onClick={() => goToPage(totalPages)}
                disabled={pagination.currentPage === totalPages}
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
