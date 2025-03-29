import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

/**
 * Componente para gerenciar papéis e permissões de usuários
 */
const RoleManagement = () => {
  // Estado para armazenar a lista de papéis
  const [roles, setRoles] = useState([]);
  
  // Estado para controlar o papel selecionado para edição
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Estado para controlar o modo de edição
  const [editMode, setEditMode] = useState(false);
  
  // Estado para armazenar o papel em edição
  const [editingRole, setEditingRole] = useState({
    id: '',
    name: '',
    description: '',
    permissions: []
  });
  
  // Dados de exemplo para papéis
  const mockRoles = [
    {
      id: 1,
      name: 'Administrador',
      description: 'Acesso completo ao sistema',
      permissions: [
        'view_all',
        'edit_all',
        'manage_users',
        'manage_roles',
        'create_reports',
        'approve_reports'
      ]
    },
    {
      id: 2,
      name: 'Gerente',
      description: 'Acesso para gerenciar departamentos e aprovar relatórios',
      permissions: [
        'view_all',
        'edit_department',
        'approve_reports',
        'create_reports'
      ]
    },
    {
      id: 3,
      name: 'Usuário',
      description: 'Acesso básico para visualização e criação de relatórios',
      permissions: [
        'view_department',
        'create_reports'
      ]
    }
  ];
  
  // Dados de exemplo para permissões disponíveis
  const availablePermissions = [
    {
      id: 'view_all',
      name: 'Visualizar todos os dados',
      description: 'Permite visualizar dados de todos os departamentos',
      group: 'Visualização'
    },
    {
      id: 'view_department',
      name: 'Visualizar dados do departamento',
      description: 'Permite visualizar dados apenas do próprio departamento',
      group: 'Visualização'
    },
    {
      id: 'edit_all',
      name: 'Editar todos os dados',
      description: 'Permite editar dados de todos os departamentos',
      group: 'Edição'
    },
    {
      id: 'edit_department',
      name: 'Editar dados do departamento',
      description: 'Permite editar dados apenas do próprio departamento',
      group: 'Edição'
    },
    {
      id: 'create_reports',
      name: 'Criar relatórios',
      description: 'Permite criar novos relatórios',
      group: 'Relatórios'
    },
    {
      id: 'approve_reports',
      name: 'Aprovar relatórios',
      description: 'Permite aprovar relatórios criados por outros usuários',
      group: 'Relatórios'
    },
    {
      id: 'manage_users',
      name: 'Gerenciar usuários',
      description: 'Permite criar, editar e excluir usuários',
      group: 'Administração'
    },
    {
      id: 'manage_roles',
      name: 'Gerenciar papéis',
      description: 'Permite criar, editar e excluir papéis',
      group: 'Administração'
    }
  ];

  // Efeito para carregar os papéis (simulado com dados de exemplo)
  useEffect(() => {
    // Em uma implementação real, aqui seria feita uma chamada à API
    setRoles(mockRoles);
  }, []);

  // Função para selecionar um papel para edição
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setEditMode(false);
  };

  // Função para iniciar a edição de um papel
  const handleEditRole = () => {
    if (selectedRole) {
      setEditingRole({
        ...selectedRole
      });
      setEditMode(true);
    }
  };

  // Função para iniciar a criação de um novo papel
  const handleNewRole = () => {
    setSelectedRole(null);
    setEditingRole({
      id: '',
      name: '',
      description: '',
      permissions: []
    });
    setEditMode(true);
  };

  // Função para lidar com alterações nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingRole({
      ...editingRole,
      [name]: value
    });
  };

  // Função para lidar com alterações nas permissões
  const handlePermissionChange = (permissionId) => {
    const updatedPermissions = [...editingRole.permissions];
    
    if (updatedPermissions.includes(permissionId)) {
      // Remover permissão
      const index = updatedPermissions.indexOf(permissionId);
      updatedPermissions.splice(index, 1);
    } else {
      // Adicionar permissão
      updatedPermissions.push(permissionId);
    }
    
    setEditingRole({
      ...editingRole,
      permissions: updatedPermissions
    });
  };

  // Função para salvar o papel
  const handleSave = () => {
    // Validar campos obrigatórios
    if (!editingRole.name.trim()) {
      alert('O nome do papel é obrigatório');
      return;
    }
    
    // Em uma implementação real, aqui seria feita uma chamada à API
    
    // Simular salvamento
    if (editingRole.id) {
      // Atualizar papel existente
      const updatedRoles = roles.map(role => 
        role.id === editingRole.id ? { ...editingRole } : role
      );
      setRoles(updatedRoles);
      setSelectedRole(editingRole);
    } else {
      // Criar novo papel
      const newRole = {
        ...editingRole,
        id: Math.max(...roles.map(r => r.id), 0) + 1
      };
      setRoles([...roles, newRole]);
      setSelectedRole(newRole);
    }
    
    setEditMode(false);
  };

  // Função para cancelar a edição
  const handleCancel = () => {
    setEditMode(false);
    
    if (selectedRole) {
      // Voltar para o papel selecionado
      setEditingRole(selectedRole);
    }
  };

  // Função para excluir um papel
  const handleDeleteRole = () => {
    if (!selectedRole) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o papel "${selectedRole.name}"?`)) {
      // Em uma implementação real, aqui seria feita uma chamada à API
      
      // Simular exclusão
      const updatedRoles = roles.filter(role => role.id !== selectedRole.id);
      setRoles(updatedRoles);
      setSelectedRole(null);
    }
  };

  // Agrupar permissões por grupo
  const permissionsByGroup = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.group]) {
      acc[permission.group] = [];
    }
    acc[permission.group].push(permission);
    return acc;
  }, {});

  return (
    <div className="role-management-container">
      <div className="role-management-header">
        <div className="role-management-title-container">
          <Link to="/user-management" className="user-detail-back-link">
            <FaArrowLeft /> Voltar para a lista de usuários
          </Link>
          <h2 className="role-management-title">Gerenciamento de Papéis</h2>
        </div>
        
        <div className="user-detail-actions">
          <button 
            className="user-detail-action-button primary"
            onClick={handleNewRole}
          >
            <FaPlus /> Novo Papel
          </button>
        </div>
      </div>
      
      <div className="role-management-content">
        <div className="role-management-sidebar">
          <h3>Papéis Disponíveis</h3>
          <div className="role-list">
            {roles.map(role => (
              <div 
                key={role.id} 
                className={`role-item ${selectedRole?.id === role.id ? 'active' : ''}`}
                onClick={() => handleSelectRole(role)}
              >
                <div className="role-name">{role.name}</div>
                <div className="role-description">{role.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="role-management-detail">
          {selectedRole && !editMode ? (
            // Modo de visualização
            <div className="role-detail">
              <div className="role-detail-header">
                <h3>{selectedRole.name}</h3>
                <div className="role-detail-actions">
                  <button 
                    className="user-detail-action-button primary"
                    onClick={handleEditRole}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button 
                    className="user-detail-action-button danger"
                    onClick={handleDeleteRole}
                  >
                    <FaTrash /> Excluir
                  </button>
                </div>
              </div>
              
              <div className="role-detail-description">
                <p>{selectedRole.description}</p>
              </div>
              
              <div className="role-permissions">
                <h4>Permissões</h4>
                
                {Object.entries(permissionsByGroup).map(([group, permissions]) => (
                  <div key={group} className="permission-group">
                    <h5 className="permission-group-title">{group}</h5>
                    
                    {permissions.map(permission => (
                      <div key={permission.id} className="permission-item">
                        <input
                          type="checkbox"
                          id={`view-${permission.id}`}
                          className="permission-checkbox"
                          checked={selectedRole.permissions.includes(permission.id)}
                          disabled
                        />
                        <label htmlFor={`view-${permission.id}`} className="permission-label">
                          {permission.name}
                        </label>
                        <div className="permission-description">
                          {permission.description}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : editMode ? (
            // Modo de edição
            <div className="role-edit">
              <div className="role-edit-header">
                <h3>{editingRole.id ? 'Editar Papel' : 'Novo Papel'}</h3>
                <div className="role-edit-actions">
                  <button 
                    className="user-detail-action-button primary"
                    onClick={handleSave}
                  >
                    <FaSave /> Salvar
                  </button>
                  <button 
                    className="user-detail-action-button secondary"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
              
              <div className="role-edit-form">
                <div className="user-detail-form-field">
                  <label className="user-detail-form-label">Nome do Papel *</label>
                  <input
                    type="text"
                    name="name"
                    className="user-detail-form-input"
                    value={editingRole.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="user-detail-form-field">
                  <label className="user-detail-form-label">Descrição</label>
                  <textarea
                    name="description"
                    className="user-detail-form-input"
                    value={editingRole.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                
                <div className="role-permissions">
                  <h4>Permissões</h4>
                  
                  {Object.entries(permissionsByGroup).map(([group, permissions]) => (
                    <div key={group} className="permission-group">
                      <h5 className="permission-group-title">{group}</h5>
                      
                      {permissions.map(permission => (
                        <div key={permission.id} className="permission-item">
                          <input
                            type="checkbox"
                            id={`edit-${permission.id}`}
                            className="permission-checkbox"
                            checked={editingRole.permissions.includes(permission.id)}
                            onChange={() => handlePermissionChange(permission.id)}
                          />
                          <label htmlFor={`edit-${permission.id}`} className="permission-label">
                            {permission.name}
                          </label>
                          <div className="permission-description">
                            {permission.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Nenhum papel selecionado
            <div className="role-empty-state">
              <p>Selecione um papel para visualizar seus detalhes ou clique em "Novo Papel" para criar um novo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
