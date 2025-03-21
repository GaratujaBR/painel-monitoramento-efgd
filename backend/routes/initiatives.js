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

// Get all objectives
router.get('/objectives', async (req, res, next) => {
  try {
    // Extract unique objectives from initiatives
    const initiatives = await dataService.getSpreadsheetData();
    const objectives = [...new Set(initiatives.map(i => i.objectiveId))]
      .filter(o => o)
      .map(o => ({ id: o, name: o }));
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
