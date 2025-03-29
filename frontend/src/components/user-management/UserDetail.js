import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaUserEdit, FaLock, FaTrash } from 'react-icons/fa';

/**
 * Componente para visualizar e editar detalhes de um usuário
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isNew - Indica se é um novo usuário
 */
const UserDetail = ({ isNew = false }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  // Estado para armazenar os dados do usuário
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    role: 'user',
    department: '',
    status: 'active',
    phone: '',
    position: '',
    createdAt: '',
    lastAccess: null,
    permissions: []
  });
  
  // Estado para controlar o modo de edição
  const [editMode, setEditMode] = useState(isNew);
  
  // Estado para armazenar erros de validação
  const [errors, setErrors] = useState({});
  
  // Estado para controlar a alteração de senha
  const [passwordChange, setPasswordChange] = useState({
    newPassword: '',
    confirmPassword: ''
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
      phone: '(61) 3333-4444',
      position: 'Coordenador de TI',
      createdAt: '2025-01-15T08:30:00',
      lastAccess: '2025-03-14T10:30:00',
      permissions: ['view_all', 'edit_all', 'manage_users', 'manage_roles']
    },
    {
      id: 2,
      name: 'Maria Oliveira',
      email: 'maria.oliveira@gov.br',
      role: 'manager',
      department: 'Recursos Humanos',
      status: 'active',
      phone: '(61) 3333-5555',
      position: 'Gerente de RH',
      createdAt: '2025-01-20T09:45:00',
      lastAccess: '2025-03-13T14:45:00',
      permissions: ['view_all', 'edit_department', 'approve_reports']
    },
    {
      id: 3,
      name: 'Pedro Santos',
      email: 'pedro.santos@gov.br',
      role: 'user',
      department: 'Finanças',
      status: 'inactive',
      phone: '(61) 3333-6666',
      position: 'Analista Financeiro',
      createdAt: '2025-02-05T11:20:00',
      lastAccess: '2025-02-28T09:15:00',
      permissions: ['view_department', 'create_reports']
    },
    {
      id: 4,
      name: 'Ana Costa',
      email: 'ana.costa@gov.br',
      role: 'user',
      department: 'Atendimento',
      status: 'active',
      phone: '(61) 3333-7777',
      position: 'Atendente',
      createdAt: '2025-02-10T13:10:00',
      lastAccess: '2025-03-14T16:20:00',
      permissions: ['view_department', 'create_reports']
    },
    {
      id: 5,
      name: 'Carlos Ferreira',
      email: 'carlos.ferreira@gov.br',
      role: 'manager',
      department: 'Operações',
      status: 'pending',
      phone: '(61) 3333-8888',
      position: 'Gerente de Operações',
      createdAt: '2025-03-01T10:00:00',
      lastAccess: null,
      permissions: ['view_all', 'edit_department', 'approve_reports']
    }
  ];

  // Efeito para carregar os dados do usuário (simulado com dados de exemplo)
  useEffect(() => {
    if (!isNew) {
      // Em uma implementação real, aqui seria feita uma chamada à API
      const foundUser = mockUsers.find(u => u.id === parseInt(userId));
      
      if (foundUser) {
        setUser(foundUser);
      } else {
        // Usuário não encontrado, redirecionar para a lista
        navigate('/user-management');
      }
    }
  }, [userId, isNew, navigate]);

  // Função para lidar com alterações nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
    
    // Limpar erro do campo que foi alterado
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Função para lidar com alterações nos campos de senha
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordChange({
      ...passwordChange,
      [name]: value
    });
    
    // Limpar erro do campo que foi alterado
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Função para validar o formulário
  const validateForm = () => {
    const newErrors = {};
    
    // Validar nome
    if (!user.name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }
    
    // Validar email
    if (!user.email.trim()) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validar departamento
    if (!user.department.trim()) {
      newErrors.department = 'O departamento é obrigatório';
    }
    
    // Validar cargo
    if (!user.position.trim()) {
      newErrors.position = 'O cargo é obrigatório';
    }
    
    // Validar senha (apenas para novos usuários ou ao alterar senha)
    if (isNew || (passwordChange.newPassword || passwordChange.confirmPassword)) {
      if (!passwordChange.newPassword) {
        newErrors.newPassword = 'A senha é obrigatória';
      } else if (passwordChange.newPassword.length < 8) {
        newErrors.newPassword = 'A senha deve ter pelo menos 8 caracteres';
      }
      
      if (!passwordChange.confirmPassword) {
        newErrors.confirmPassword = 'A confirmação de senha é obrigatória';
      } else if (passwordChange.newPassword !== passwordChange.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para salvar o usuário
  const handleSave = () => {
    if (validateForm()) {
      // Em uma implementação real, aqui seria feita uma chamada à API
      
      // Simular salvamento
      alert(`Usuário ${isNew ? 'criado' : 'atualizado'} com sucesso!`);
      
      // Redirecionar para a lista de usuários
      navigate('/user-management');
    }
  };

  // Função para cancelar a edição
  const handleCancel = () => {
    if (isNew) {
      // Se for um novo usuário, voltar para a lista
      navigate('/user-management');
    } else {
      // Se estiver editando, voltar para o modo de visualização
      setEditMode(false);
      
      // Recarregar os dados originais
      const foundUser = mockUsers.find(u => u.id === parseInt(userId));
      if (foundUser) {
        setUser(foundUser);
      }
      
      // Limpar erros e campos de senha
      setErrors({});
      setPasswordChange({
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  // Função para excluir o usuário
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      // Em uma implementação real, aqui seria feita uma chamada à API
      
      // Simular exclusão
      alert('Usuário excluído com sucesso!');
      
      // Redirecionar para a lista de usuários
      navigate('/user-management');
    }
  };

  // Função para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderizar o componente
  return (
    <div className="user-detail-container">
      <div className="user-detail-header">
        <div className="user-detail-title-container">
          <Link to="/user-management" className="user-detail-back-link">
            <FaArrowLeft /> Voltar para a lista
          </Link>
          <h2 className="user-detail-title">
            {isNew ? 'Novo Usuário' : editMode ? 'Editar Usuário' : 'Detalhes do Usuário'}
          </h2>
        </div>
        
        <div className="user-detail-actions">
          {!isNew && !editMode && (
            <>
              <button 
                className="user-detail-action-button primary"
                onClick={() => setEditMode(true)}
              >
                <FaUserEdit /> Editar
              </button>
              <button 
                className="user-detail-action-button danger"
                onClick={handleDelete}
              >
                <FaTrash /> Excluir
              </button>
            </>
          )}
          
          {(isNew || editMode) && (
            <>
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
                <FaTimes /> Cancelar
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="user-detail-content">
        {/* Informações básicas */}
        <div className="user-detail-section">
          <h3 className="user-detail-section-title">Informações Básicas</h3>
          
          {editMode ? (
            <div className="user-detail-form">
              <div className="user-detail-info">
                <div className="user-detail-form-field">
                  <label className="user-detail-form-label">Nome *</label>
                  <input
                    type="text"
                    name="name"
                    className="user-detail-form-input"
                    value={user.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="user-detail-form-error">{errors.name}</div>}
                </div>
                
                <div className="user-detail-form-field">
                  <label className="user-detail-form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    className="user-detail-form-input"
                    value={user.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="user-detail-form-error">{errors.email}</div>}
                </div>
                
                <div className="user-detail-form-field">
                  <label className="user-detail-form-label">Departamento *</label>
                  <input
                    type="text"
                    name="department"
                    className="user-detail-form-input"
                    value={user.department}
                    onChange={handleChange}
                  />
                  {errors.department && <div className="user-detail-form-error">{errors.department}</div>}
                </div>
                
                <div className="user-detail-form-field">
                  <label className="user-detail-form-label">Cargo *</label>
                  <input
                    type="text"
                    name="position"
                    className="user-detail-form-input"
                    value={user.position}
                    onChange={handleChange}
                  />
                  {errors.position && <div className="user-detail-form-error">{errors.position}</div>}
                </div>
                
                <div className="user-detail-form-field">
                  <label className="user-detail-form-label">Telefone</label>
                  <input
                    type="text"
                    name="phone"
                    className="user-detail-form-input"
                    value={user.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="user-detail-form-field">
                  <label className="user-detail-form-label">Papel *</label>
                  <select
                    name="role"
                    className="user-detail-form-select"
                    value={user.role}
                    onChange={handleChange}
                  >
                    <option value="admin">Administrador</option>
                    <option value="manager">Gerente</option>
                    <option value="user">Usuário</option>
                  </select>
                </div>
                
                <div className="user-detail-form-field">
                  <label className="user-detail-form-label">Status *</label>
                  <select
                    name="status"
                    className="user-detail-form-select"
                    value={user.status}
                    onChange={handleChange}
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="pending">Pendente</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="user-detail-info">
              <div className="user-detail-field">
                <span className="user-detail-label">Nome:</span>
                <span className="user-detail-value">{user.name}</span>
              </div>
              
              <div className="user-detail-field">
                <span className="user-detail-label">Email:</span>
                <span className="user-detail-value">{user.email}</span>
              </div>
              
              <div className="user-detail-field">
                <span className="user-detail-label">Departamento:</span>
                <span className="user-detail-value">{user.department}</span>
              </div>
              
              <div className="user-detail-field">
                <span className="user-detail-label">Cargo:</span>
                <span className="user-detail-value">{user.position}</span>
              </div>
              
              <div className="user-detail-field">
                <span className="user-detail-label">Telefone:</span>
                <span className="user-detail-value">{user.phone || 'Não informado'}</span>
              </div>
              
              <div className="user-detail-field">
                <span className="user-detail-label">Papel:</span>
                <span className="user-detail-value">
                  <span className={`user-role user-role-${user.role}`}>
                    {user.role === 'admin' && 'Administrador'}
                    {user.role === 'manager' && 'Gerente'}
                    {user.role === 'user' && 'Usuário'}
                  </span>
                </span>
              </div>
              
              <div className="user-detail-field">
                <span className="user-detail-label">Status:</span>
                <span className="user-detail-value">
                  <span className={`user-status user-status-${user.status}`}>
                    {user.status === 'active' && 'Ativo'}
                    {user.status === 'inactive' && 'Inativo'}
                    {user.status === 'pending' && 'Pendente'}
                  </span>
                </span>
              </div>
              
              <div className="user-detail-field">
                <span className="user-detail-label">Criado em:</span>
                <span className="user-detail-value">{formatDate(user.createdAt)}</span>
              </div>
              
              <div className="user-detail-field">
                <span className="user-detail-label">Último acesso:</span>
                <span className="user-detail-value">
                  {user.lastAccess ? formatDate(user.lastAccess) : 'Nunca acessou'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Senha (apenas no modo de edição) */}
        {editMode && (
          <div className="user-detail-section">
            <h3 className="user-detail-section-title">
              {isNew ? 'Definir Senha' : 'Alterar Senha'}
              <small>{isNew ? ' (obrigatório)' : ' (deixe em branco para manter a senha atual)'}</small>
            </h3>
            
            <div className="user-detail-form">
              <div className="user-detail-info">
                <div className="user-detail-form-field">
                  <label className="user-detail-form-label">Nova Senha {isNew && '*'}</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="user-detail-form-input"
                    value={passwordChange.newPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.newPassword && <div className="user-detail-form-error">{errors.newPassword}</div>}
                </div>
                
                <div className="user-detail-form-field">
                  <label className="user-detail-form-label">Confirmar Senha {isNew && '*'}</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="user-detail-form-input"
                    value={passwordChange.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.confirmPassword && <div className="user-detail-form-error">{errors.confirmPassword}</div>}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Permissões (apenas no modo de visualização) */}
        {!editMode && !isNew && (
          <div className="user-detail-section">
            <h3 className="user-detail-section-title">Permissões</h3>
            
            <div className="user-detail-permissions">
              <ul className="user-detail-permissions-list">
                {user.permissions.map((permission, index) => (
                  <li key={index} className="user-detail-permission-item">
                    {permission === 'view_all' && 'Visualizar todos os dados'}
                    {permission === 'edit_all' && 'Editar todos os dados'}
                    {permission === 'view_department' && 'Visualizar dados do departamento'}
                    {permission === 'edit_department' && 'Editar dados do departamento'}
                    {permission === 'create_reports' && 'Criar relatórios'}
                    {permission === 'approve_reports' && 'Aprovar relatórios'}
                    {permission === 'manage_users' && 'Gerenciar usuários'}
                    {permission === 'manage_roles' && 'Gerenciar papéis'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
