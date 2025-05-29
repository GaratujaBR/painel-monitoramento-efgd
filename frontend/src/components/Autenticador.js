import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Autenticador({ children }) {
  const [searchParams] = useSearchParams();
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for both 'id' and 'token' parameters
    const userId = searchParams.get("id") || searchParams.get("token");
    
    if (userId) {
      console.log("Usuário autenticado via URL com ID:", userId);
      setAutenticado(true);
    } else {
      console.log("Acesso negado: parâmetro 'id' ou 'token' não encontrado na URL");
    }

    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="auth-loading" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="auth-error" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <h2 style={{ color: '#d32f2f', marginBottom: '1rem' }}>Acesso não autorizado</h2>
          <p>Por favor, acesse este painel pela plataforma SISP.</p>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Se você acredita que isso é um erro, entre em contato com o suporte pelo email suporte.cggov@gestao.gov.br
          </p>
        </div>
      </div>
    );
  }

  // If authenticated, render the children
  return <>{children}</>;
}