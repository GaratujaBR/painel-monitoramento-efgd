require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('isomorphic-fetch');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
app.use('/api/initiatives', initiativesRouter);

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
