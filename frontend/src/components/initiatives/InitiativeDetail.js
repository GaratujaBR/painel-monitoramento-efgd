import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import './Initiatives.css';
import { useInitiatives } from '../../context/InitiativesContext';

const InitiativeDetail = () => {
  const { id } = useParams();
  const { initiatives, updateInitiative, deleteInitiative } = useInitiatives();
  const [initiative, setInitiative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  // Find the initiative by ID
  useEffect(() => {
    const foundInitiative = initiatives.find(item => item.id === id);
    if (foundInitiative) {
      setInitiative(foundInitiative);
    }
    setLoading(false);
  }, [id, initiatives]);

  // Handle milestone status toggle
  const handleMilestoneToggle = (milestoneId) => {
    if (!initiative) return;

    const updatedMilestones = initiative.milestones.map(milestone => {
      if (milestone.id === milestoneId) {
        const newStatus = milestone.status === 'completed' ? 'in-progress' : 'completed';
        return { ...milestone, status: newStatus };
      }
      return milestone;
    });

    // Calculate new progress based on completed milestones
    const totalMilestones = updatedMilestones.length;
    const completedMilestones = updatedMilestones.filter(m => m.status === 'completed').length;
    const newProgress = totalMilestones > 0 
      ? Math.round((completedMilestones / totalMilestones) * 100) 
      : 0;

    // Update initiative with new milestones and progress
    const updatedInitiative = {
      ...initiative,
      milestones: updatedMilestones,
      progress: newProgress
    };

    // Update in context
    updateInitiative(updatedInitiative);
    setInitiative(updatedInitiative);
  };

  // Handle initiative deletion
  const handleDelete = () => {
    deleteInitiative(id);
    navigate('/initiatives');
  };

  // Get status badge class based on status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'completed': return 'status-badge completed';
      case 'on-track': return 'status-badge on-track';
      case 'in-progress': return 'status-badge in-progress';
      case 'at-risk': return 'status-badge at-risk';
      case 'delayed': return 'status-badge delayed';
      case 'not-started': return 'status-badge not-started';
      default: return 'status-badge';
    }
  };

  // Get status label in Portuguese
  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'Concluído';
      case 'on-track': return 'No Prazo';
      case 'in-progress': return 'Em Andamento';
      case 'at-risk': return 'Em Risco';
      case 'delayed': return 'Atrasado';
      case 'not-started': return 'Não Iniciado';
      default: return 'Desconhecido';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não definida';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!initiative) {
    return (
      <div className="initiative-not-found">
        <h2>Iniciativa não encontrada</h2>
        <p>A iniciativa que você está procurando não existe ou foi removida.</p>
        <Link to="/initiatives" className="btn-back">Voltar para a lista</Link>
      </div>
    );
  }

  return (
    <div className="initiative-detail-container">
      <div className="initiative-detail-header">
        <div className="header-title">
          <Link to="/initiatives" className="btn-back">
            &larr; Voltar
          </Link>
          <h1>{initiative.name}</h1>
          <span className={getStatusBadgeClass(initiative.status)}>
            {getStatusLabel(initiative.status)}
          </span>
        </div>
        
        <div className="initiative-detail-actions">
          <Link to={`/initiatives/${id}/edit`} className="btn-edit">
            Editar
          </Link>
          <button 
            className="btn-delete" 
            onClick={() => setShowDeleteConfirm(true)}
          >
            Excluir
          </button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <div className="delete-confirmation-content">
            <h3>Confirmar exclusão</h3>
            <p>Tem certeza que deseja excluir esta iniciativa? Esta ação não pode ser desfeita.</p>
            <div className="delete-confirmation-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirm-delete" 
                onClick={handleDelete}
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="initiative-detail-content">
        <div className="initiative-detail-main">
          <div className="initiative-section">
            <h2>Descrição</h2>
            <p>{initiative.description}</p>
          </div>
          
          <div className="initiative-section">
            <h2>Marcos</h2>
            {initiative.milestones && initiative.milestones.length > 0 ? (
              <div className="milestone-list">
                {initiative.milestones.map(milestone => (
                  <div 
                    key={milestone.id} 
                    className={`milestone-item ${milestone.status}`}
                  >
                    <input 
                      type="checkbox" 
                      className="milestone-checkbox" 
                      checked={milestone.status === 'completed'}
                      onChange={() => handleMilestoneToggle(milestone.id)}
                    />
                    <div className="milestone-info">
                      <div className="milestone-name">{milestone.name}</div>
                      <div className="milestone-date">
                        Prazo: {formatDate(milestone.dueDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhum marco definido para esta iniciativa.</p>
            )}
          </div>
          
          <div className="initiative-section">
            <h2>Atualizações</h2>
            {initiative.updates && initiative.updates.length > 0 ? (
              <div className="update-list">
                {initiative.updates.map(update => (
                  <div key={update.id} className="update-item">
                    <div className="update-header">
                      <div className="update-date">
                        {formatDate(update.date)}
                      </div>
                      <div className="update-author">
                        {update.author}
                      </div>
                    </div>
                    <div className="update-content">
                      {update.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhuma atualização registrada.</p>
            )}
          </div>
        </div>
        
        <div className="initiative-detail-sidebar">
          <div className="initiative-section">
            <h2>Progresso</h2>
            <div className="initiative-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${initiative.progress || 0}%` }}
                ></div>
              </div>
              <span className="progress-text">{initiative.progress || 0}%</span>
            </div>
          </div>
          
          <div className="initiative-section">
            <h2>Informações</h2>
            <div className="initiative-info-list">
              <div className="info-item">
                <div className="info-label">Responsável:</div>
                <div className="info-value">{initiative.owner}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Departamento:</div>
                <div className="info-value">{initiative.department}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Data de Início:</div>
                <div className="info-value">{formatDate(initiative.startDate)}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Prazo:</div>
                <div className="info-value">{formatDate(initiative.deadline)}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Prioridade:</div>
                <div className="info-value">{initiative.priority}</div>
              </div>
            </div>
          </div>
          
          <div className="initiative-section">
            <h2>Equipe</h2>
            {initiative.team && initiative.team.length > 0 ? (
              <div className="team-list">
                {initiative.team.map(member => (
                  <div key={member.id} className="team-member">
                    <div className="member-name">{member.name}</div>
                    <div className="member-role">{member.role}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhum membro de equipe definido.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiativeDetail;
