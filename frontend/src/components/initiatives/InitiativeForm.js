import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaTrash, FaSave, FaTimes, FaUpload, FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage } from 'react-icons/fa';
import './Initiatives.css';
import { useInitiatives } from '../../context/InitiativesContext';

const InitiativeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { initiatives, addInitiative, updateInitiative } = useInitiatives();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);

  // Estado inicial do formulário
  const initialFormState = {
    name: '',
    description: '',
    status: 'not-started',
    owner: '',
    department: '',
    startDate: '',
    deadline: '',
    priority: 'medium',
    progress: 0,
    milestones: [],
    attachments: []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [milestoneInput, setMilestoneInput] = useState({ name: '', dueDate: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [touched, setTouched] = useState({});

  // Carregar dados da iniciativa se estiver no modo de edição
  useEffect(() => {
    if (isEditMode) {
      const initiativeToEdit = initiatives.find(item => item.id === id);
      if (initiativeToEdit) {
        // Formatar datas para o formato esperado pelo input type="date"
        const formatDateForInput = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        setFormData({
          ...initiativeToEdit,
          startDate: formatDateForInput(initiativeToEdit.startDate),
          deadline: formatDateForInput(initiativeToEdit.deadline),
          milestones: initiativeToEdit.milestones || [],
          attachments: initiativeToEdit.attachments || []
        });
      }
      setLoading(false);
    }
  }, [id, initiatives, isEditMode]);

  // Manipular mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Marcar campo como tocado
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
    
    // Validar campo em tempo real
    validateField(name, value);
  };

  // Validar um campo específico
  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Nome da iniciativa é obrigatório';
        } else if (value.trim().length < 5) {
          error = 'Nome deve ter pelo menos 5 caracteres';
        }
        break;
        
      case 'description':
        if (!value.trim()) {
          error = 'Descrição é obrigatória';
        } else if (value.trim().length < 10) {
          error = 'Descrição deve ter pelo menos 10 caracteres';
        }
        break;
        
      case 'owner':
        if (!value.trim()) {
          error = 'Responsável é obrigatório';
        }
        break;
        
      case 'department':
        if (!value.trim()) {
          error = 'Departamento é obrigatório';
        }
        break;
        
      case 'startDate':
        if (!value) {
          error = 'Data de início é obrigatória';
        } else if (new Date(value) < new Date()) {
          error = 'Data de início não pode ser no passado';
        }
        break;
        
      case 'deadline':
        if (!value) {
          error = 'Prazo é obrigatório';
        } else if (formData.startDate && new Date(value) < new Date(formData.startDate)) {
          error = 'Prazo deve ser posterior à data de início';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return error === null;
  };

  // Manipular perda de foco nos campos
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  // Manipular mudanças nos campos do marco
  const handleMilestoneInputChange = (e) => {
    const { name, value } = e.target;
    setMilestoneInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Adicionar um novo marco
  const handleAddMilestone = () => {
    if (!milestoneInput.name || !milestoneInput.dueDate) {
      setErrors(prev => ({
        ...prev,
        milestone: 'Nome e data são obrigatórios para o marco'
      }));
      return;
    }
    
    // Validar data do marco
    if (new Date(milestoneInput.dueDate) < new Date(formData.startDate)) {
      setErrors(prev => ({
        ...prev,
        milestone: 'Data do marco deve ser posterior à data de início da iniciativa'
      }));
      return;
    }
    
    if (new Date(milestoneInput.dueDate) > new Date(formData.deadline)) {
      setErrors(prev => ({
        ...prev,
        milestone: 'Data do marco deve ser anterior ao prazo da iniciativa'
      }));
      return;
    }

    const newMilestone = {
      id: Date.now().toString(), // ID temporário
      name: milestoneInput.name,
      dueDate: milestoneInput.dueDate,
      status: 'not-started'
    };

    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));

    // Limpar campos de entrada do marco
    setMilestoneInput({ name: '', dueDate: '' });
    setErrors(prev => ({ ...prev, milestone: null }));
  };

  // Remover um marco
  const handleRemoveMilestone = (milestoneId) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== milestoneId)
    }));
  };

  // Manipular upload de arquivos
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar tamanho e tipo de arquivo
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                          'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    const invalidFiles = files.filter(file => 
      file.size > maxSize || !allowedTypes.includes(file.type)
    );
    
    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        attachments: 'Arquivos inválidos. Apenas imagens, PDFs e documentos Office até 5MB são permitidos.'
      }));
      return;
    }
    
    // Processar arquivos válidos
    const newAttachments = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      // Em uma implementação real, aqui seria feito o upload para um servidor
      // e armazenado o URL do arquivo. Para este exemplo, vamos simular isso
      // convertendo o arquivo para uma URL de dados (apenas para imagens pequenas)
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      file: file // Armazenar o arquivo para upload posterior
    }));
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
    
    setErrors(prev => ({ ...prev, attachments: null }));
    
    // Limpar o input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remover um anexo
  const handleRemoveAttachment = (attachmentId) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== attachmentId)
    }));
  };

  // Obter ícone para tipo de arquivo
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FaFileImage />;
    if (fileType.includes('pdf')) return <FaFilePdf />;
    if (fileType.includes('word')) return <FaFileWord />;
    if (fileType.includes('excel') || fileType.includes('sheet')) return <FaFileExcel />;
    return <FaFile />;
  };

  // Formatar tamanho de arquivo
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Validar formulário
  const validateForm = () => {
    // Marcar todos os campos como tocados
    const allFields = ['name', 'description', 'owner', 'department', 'startDate', 'deadline'];
    const newTouched = {};
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    // Validar todos os campos
    const newErrors = {};
    let isValid = true;
    
    allFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });
    
    // Validar milestones
    if (formData.milestones.length === 0) {
      newErrors.milestones = 'Adicione pelo menos um marco para a iniciativa';
      isValid = false;
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  // Enviar formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Rolar até o primeiro erro
      const firstErrorElement = document.querySelector('.error-message');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    if (isEditMode) {
      // Atualizar iniciativa existente
      updateInitiative({
        ...formData,
        id: id
      });
    } else {
      // Adicionar nova iniciativa
      addInitiative({
        ...formData,
        id: Date.now().toString(), // ID temporário
        progress: 0,
        createdAt: new Date().toISOString()
      });
    }
    
    // Redirecionar para a lista de iniciativas
    navigate('/initiatives');
  };

  // Cancelar e voltar para a lista
  const handleCancel = () => {
    navigate('/initiatives');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="initiative-form-container">
      <div className="initiative-form-header">
        <h1>{isEditMode ? 'Editar Iniciativa' : 'Nova Iniciativa'}</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="initiative-form">
        <div className="form-section">
          <h2>Informações Básicas</h2>
          
          <div className="form-group">
            <label htmlFor="name">Nome da Iniciativa *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.name && errors.name ? 'error' : ''}
            />
            {touched.name && errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descrição *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="4"
              className={touched.description && errors.description ? 'error' : ''}
            ></textarea>
            {touched.description && errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="not-started">Não Iniciado</option>
                <option value="in-progress">Em Andamento</option>
                <option value="on-track">No Prazo</option>
                <option value="at-risk">Em Risco</option>
                <option value="delayed">Atrasado</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="priority">Prioridade</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Responsabilidade</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="owner">Responsável *</label>
              <input
                type="text"
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.owner && errors.owner ? 'error' : ''}
              />
              {touched.owner && errors.owner && <div className="error-message">{errors.owner}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="department">Departamento *</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.department && errors.department ? 'error' : ''}
              />
              {touched.department && errors.department && <div className="error-message">{errors.department}</div>}
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Cronograma</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Data de Início *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.startDate && errors.startDate ? 'error' : ''}
              />
              {touched.startDate && errors.startDate && <div className="error-message">{errors.startDate}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="deadline">Prazo *</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.deadline && errors.deadline ? 'error' : ''}
              />
              {touched.deadline && errors.deadline && <div className="error-message">{errors.deadline}</div>}
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Marcos</h2>
          
          <div className="milestone-input-container">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="milestoneName">Nome do Marco</label>
                <input
                  type="text"
                  id="milestoneName"
                  name="name"
                  value={milestoneInput.name}
                  onChange={handleMilestoneInputChange}
                  className={errors.milestone ? 'error' : ''}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="milestoneDueDate">Data</label>
                <input
                  type="date"
                  id="milestoneDueDate"
                  name="dueDate"
                  value={milestoneInput.dueDate}
                  onChange={handleMilestoneInputChange}
                  className={errors.milestone ? 'error' : ''}
                />
              </div>
              
              <button 
                type="button" 
                className="btn-add-milestone"
                onClick={handleAddMilestone}
              >
                <FaPlus /> Adicionar Marco
              </button>
            </div>
            {errors.milestone && <div className="error-message">{errors.milestone}</div>}
          </div>
          
          <div className="milestone-list">
            {formData.milestones.length > 0 ? (
              formData.milestones.map(milestone => (
                <div key={milestone.id} className="milestone-item">
                  <div className="milestone-info">
                    <div className="milestone-name">{milestone.name}</div>
                    <div className="milestone-date">
                      {new Date(milestone.dueDate).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-remove-milestone"
                    onClick={() => handleRemoveMilestone(milestone.id)}
                  >
                    <FaTrash /> Remover
                  </button>
                </div>
              ))
            ) : (
              <p>Nenhum marco adicionado.</p>
            )}
          </div>
          {errors.milestones && <div className="error-message">{errors.milestones}</div>}
        </div>
        
        <div className="form-section">
          <h2>Anexos</h2>
          
          <div className="attachment-input-container">
            <div className="form-row">
              <div className="form-group file-upload">
                <label htmlFor="attachments">
                  <div className="file-upload-button">
                    <FaUpload /> Selecionar Arquivos
                  </div>
                </label>
                <input
                  type="file"
                  id="attachments"
                  name="attachments"
                  multiple
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <div className="file-upload-info">
                  Formatos aceitos: imagens, PDFs, documentos Office. Tamanho máximo: 5MB.
                </div>
              </div>
            </div>
            {errors.attachments && <div className="error-message">{errors.attachments}</div>}
          </div>
          
          <div className="attachment-list">
            {formData.attachments.length > 0 ? (
              formData.attachments.map(attachment => (
                <div key={attachment.id} className="attachment-item">
                  <div className="attachment-info">
                    <div className="attachment-icon">
                      {getFileIcon(attachment.type)}
                    </div>
                    <div className="attachment-details">
                      <div className="attachment-name">{attachment.name}</div>
                      <div className="attachment-size">{formatFileSize(attachment.size)}</div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-remove-attachment"
                    onClick={() => handleRemoveAttachment(attachment.id)}
                  >
                    <FaTrash /> Remover
                  </button>
                </div>
              ))
            ) : (
              <p>Nenhum anexo adicionado.</p>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={handleCancel}
          >
            <FaTimes /> Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-save"
          >
            <FaSave /> {isEditMode ? 'Salvar Alterações' : 'Criar Iniciativa'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InitiativeForm;
