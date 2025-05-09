/**
 * PONTO CRÍTICO: Endpoints de API para iniciativas
 * 
 * Estes endpoints fornecem dados para o frontend e devem manter a estrutura de resposta
 * consistente. Os endpoints de principles, objectives e areas são especialmente importantes
 * para o funcionamento correto dos filtros no frontend.
 */
const express = require('express');
const router = express.Router();
const GoogleSheetsService = require('../services/googlesheets.service');

const dataService = new GoogleSheetsService();

// Initialize service
dataService.initialize().catch(error => {
  console.error('Erro ao inicializar serviço:', error);
});

// Get all initiatives with optional filters
router.get('/', async (req, res, next) => {
  try {
    const { area, status, principle, objective } = req.query;
    const filters = {
      area,
      status,
      principle,
      objective
    };
    const initiatives = await dataService.getInitiatives(filters);
    res.json(initiatives);
  } catch (error) {
    next(error);
  }
});

// Get all principles
router.get('/principles', async (req, res, next) => {
  try {
    // Extract unique principles from initiatives
    const initiatives = await dataService.getSpreadsheetData();
    const principles = [...new Set(initiatives.map(i => i.principleId))]
      .filter(p => p)
      .map(p => ({ id: p, name: p }));
    res.json(principles);
  } catch (error) {
    next(error);
  }
});

// Corrigir a rota para retornar objetivos completos
router.get('/objectives', async (req, res, next) => {
  try {
    const objectives = await dataService.getObjectives();
    res.json(objectives);
  } catch (error) {
    next(error);
  }
});

// Get all areas
router.get('/areas', async (req, res, next) => {
  try {
    // Extract unique areas from initiatives
    const initiatives = await dataService.getSpreadsheetData();
    const areas = [...new Set(initiatives.map(i => i.areaId))]
      .filter(a => a)
      .map(a => ({ id: a, name: a }));
    res.json(areas);
  } catch (error) {
    next(error);
  }
});

// Rota para obter performance das iniciativas prioritárias - Usando dataService
router.get('/priority-performance', async (req, res, next) => {
  try {
    const performanceData = await dataService.getPriorityPerformanceData();
    res.json(performanceData);
  } catch (error) {
    next(error);
  }
});

// Force refresh data
router.post('/refresh', async (req, res, next) => {
  try {
    await dataService.refreshData();
    res.json({ 
      message: 'Dados atualizados com sucesso',
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
