  // Renderiza o badge de status com as cores padrão do governo
  const StatusBadge = ({ status }) => {
    let displayLabel = 'Em Execução'; // Padrão para todos não concluídos
    let displayStatusKey = 'EM_EXECUCAO'; // Chave para estilização

    if (status === 'CONCLUIDA') {
      displayLabel = 'Concluída';
      displayStatusKey = 'CONCLUIDA';
    }

    // Log para debug
    // console.log('Status recebido:', status, '-> Status Exibido:', displayLabel);

    return (
      <span 
        className=\
status-badge\
        data-status={displayStatusKey} // Usar a chave para consistência de estilo
        aria-label={Status: }
      >
        {displayLabel}
      </span>
    );
  };
