const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// IMPORTANTE: Importar as rotas de autenticação
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 10000;

// CORS SIMPLIFICADO PARA DEBUG - MOVIDO PARA O TOPO
app.use(cors({
  origin: true, // Permite qualquer origin temporariamente
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware para parsing JSON - ANTES do rate limiting
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy (importante para o Render)
app.set('trust proxy', 1);

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`${timestamp} - ${ip} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Rate limiting DEPOIS do CORS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // máximo 200 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Middleware de segurança (depois do CORS)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameSrc: ["'self'", process.env.EXTERNAL_PLATFORM_DOMAIN || "*"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// IMPORTANTE: Usar as rotas de autenticação
app.use('/api/auth', authRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor em execução',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    corsConfig: 'simplified'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API do Painel de Monitoramento EFGD',
    version: '1.0.0',
    status: 'Online',
    corsMode: 'debug',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*'
    }
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro no servidor:', error);
  
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({ 
    error: 'Erro interno do servidor',
    message: isDev ? error.message : 'Algo deu errado',
    ...(isDev && { stack: error.stack })
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor graciosamente...');
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔐 JWT Secret configurado: ${process.env.JWT_SECRET ? 'Sim' : 'Não'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🔗 External Platform: ${process.env.EXTERNAL_PLATFORM_API || 'Não configurado'}`);
  console.log(`🚨 CORS MODE: DEBUG (permite qualquer origin)`);
});