import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Autenticador = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      // Verifica se há parâmetro de usuário na URL (vindo do iframe)
      const userId = searchParams.get('userId');
      const externalToken = searchParams.get('token');
      
      if (userId && externalToken) {
        // Valida o token externo e obtém token interno
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, token: externalToken })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.valid) {
            setUserInfo(data.user);
            setIsAuthenticated(true);
            
            // Armazena o token interno gerado pelo seu backend
            sessionStorage.setItem('internal_token', data.token);
            sessionStorage.setItem('user_data', JSON.stringify(data.user));
            
            // Remove parâmetros da URL para ficar limpa
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            throw new Error(data.error || 'Token inválido');
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro na validação');
        }
      } else {
        // Verifica se já existe uma sessão ativa com token interno
        const internalToken = sessionStorage.getItem('internal_token');
        const userData = sessionStorage.getItem('user_data');
        
        if (internalToken && userData) {
          // Verifica se o token interno ainda é válido
          await validateInternalToken(internalToken, JSON.parse(userData));
        } else {
          redirectToLogin();
        }
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  const validateInternalToken = async (token, userData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          setUserInfo(data.user);
          setIsAuthenticated(true);
        } else {
          throw new Error('Token interno inválido');
        }
      } else {
        throw new Error('Erro na verificação do token');
      }
    } catch (error) {
      console.error('Erro na validação da sessão:', error);
      redirectToLogin();
    }
  };

  const redirectToLogin = () => {
    // Remove dados de sessão
    sessionStorage.removeItem('internal_token');
    sessionStorage.removeItem('user_data');
    
    // Se estiver sendo usado dentro de iframe, comunica com a janela pai
    if (window.parent !== window) {
      window.parent.postMessage({ action: 'logout' }, '*');
    } else {
      // Se não estiver em iframe, redireciona para a plataforma de login
      window.location.href = process.env.REACT_APP_LOGIN_URL || '/login';
    }
  };

  const logout = async () => {
    try {
      // Chama endpoint de logout no backend
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('internal_token')}`
        }
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      sessionStorage.removeItem('internal_token');
      sessionStorage.removeItem('user_data');
      setIsAuthenticated(false);
      
      // Comunica logout para a janela pai se estiver em iframe
      if (window.parent !== window) {
        window.parent.postMessage({ action: 'logout' }, '*');
      } else {
        window.location.href = process.env.REACT_APP_LOGIN_URL || '/login';
      }
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Verdana, sans-serif'
      }}>
        <div>Verificando autenticação...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Verdana, sans-serif'
      }}>
        <div>
          <h2>Acesso não autorizado</h2>
          <p>Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Barra superior com info do usuário */}
      <header style={{
        background: '#183EFF',
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'Verdana, sans-serif'
      }}>
        <div>
          Bem-vindo, {userInfo?.name || 'Usuário'}
        </div>
        <button 
          onClick={logout}
          style={{
            background: '#FF0000',
            color: 'white',
            border: 'none',
            padding: '5px 15px',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Sair
        </button>
      </header>
      
      {/* Conteúdo protegido */}
      {children}
    </div>
  );
};

export default Autenticador;