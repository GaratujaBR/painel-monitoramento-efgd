require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('isomorphic-fetch');

// Adicionar logs de inicialização
console.log("Iniciando servidor com configurações:", {
  port: process.env.PORT || 3003,
  environment: process.env.NODE_ENV,
  googleSheetsId: process.env.GOOGLE_SHEETS_ID ? "Configurado" : "Não configurado"
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para logar todas as requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo ao Painel de Monitoramento EFGD API' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor em execução',
    environment: process.env.NODE_ENV
  });
});

// Import and use routes
const initiativesRouter = require('./routes/initiatives');
const dashboardRouter = require('./routes/dashboard');
app.use('/api/initiatives', initiativesRouter);
app.use('/api/dashboard', dashboardRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Start server
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
  console.log(`Google Sheets ID: ${process.env.GOOGLE_SHEETS_ID}`);
});

module.exports = app;
