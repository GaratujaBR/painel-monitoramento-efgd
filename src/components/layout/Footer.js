import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Equipe Técnica</h4>
          <p>Departamento de Tecnologia da Informação</p>
        </div>
        
        <div className="footer-section">
          <h4>Equipe de Gestão</h4>
          <p>Secretaria de Governo Digital</p>
        </div>
        
        <div className="footer-logo">
          <div className="ministry-logo">
            <span>EFGD</span>
          </div>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>&copy; {currentYear} Estratégia Federal de Governo Digital. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
