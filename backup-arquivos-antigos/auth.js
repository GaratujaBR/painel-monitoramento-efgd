const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware para CORS (configure conforme necessário)
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Endpoint para validar token da plataforma externa
router.post('/validate', async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ 
        error: 'userId e token são obrigatórios',
        valid: false 
      });
    }

    // Valida o token com a plataforma externa do seu amigo
    const externalValidation = await validateWithExternalPlatform(userId, token);
    
    if (externalValidation.valid) {
      // Gera um token interno para sua aplicação
      const internalToken = jwt.sign(
        { 
          userId: externalValidation.userId,
          name: externalValidation.name,
          email: externalValidation.email,
          permissions: externalValidation.permissions || [],
          platform: 'external'
        },
        process.env.JWT_SECRET || 'sua-chave-secreta-aqui',
        { expiresIn: '24h' }
      );

      res.json({
        valid: true,
        token: internalToken,
        user: {
          id: externalValidation.userId,
          name: externalValidation.name,
          email: externalValidation.email,
          permissions: externalValidation.permissions || []
        }
      });
    } else {
      res.status(401).json({ 
        error: 'Token inválido ou expirado',
        valid: false 
      });
    }
  } catch (error) {
    console.error('Erro na validação:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      valid: false 
    });
  }
});

// Função para validar com a plataforma externa
async function validateWithExternalPlatform(userId, token) {
  try {
    // URL da API da plataforma do seu amigo - substitua pela URL real
    const externalApiUrl = process.env.EXTERNAL_PLATFORM_API || 'https://plataforma-do-amigo.com/api';
    
    const response = await axios.post(`${externalApiUrl}/validate-token`, {
      userId,
      token
    }, {
      headers: {
        'Content-Type': 'application/json',
        // Adicione headers de autenticação se necessário
        'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`
      },
      timeout: 10000 // 10 segundos de timeout
    });

    if (response.status === 200 && response.data.valid) {
      return {
        valid: true,
        userId: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        permissions: response.data.user.permissions
      };
    }

    return { valid: false };
  } catch (error) {
    console.error('Erro ao validar com plataforma externa:', error.message);
    
    // Em caso de erro na comunicação, você pode implementar um fallback
    // ou cache temporário aqui, dependendo dos requisitos
    return { valid: false };
  }
}

// Endpoint para verificar se um token interno ainda é válido
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ valid: false, error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua-chave-secreta-aqui');
    
    res.json({
      valid: true,
      user: {
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        permissions: decoded.permissions
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Token inválido' });
  }
});

// Endpoint para logout (opcional)
router.post('/logout', (req, res) => {
  // Aqui você pode implementar blacklist de tokens se necessário
  res.json({ success: true, message: 'Logout realizado com sucesso' });
});

module.exports = router;