const express = require('express');
const router = express.Router();
const GoogleSheetsService = require('../services/googlesheets.service');

const dataService = new GoogleSheetsService();

// Initialize service if not already initialized
if (!dataService.initialized) {
  dataService.initialize().catch(error => {
    console.error('Erro ao inicializar serviço:', error);
  });
}

/**
 * @route   GET /api/dashboard
 * @desc    Get dashboard data
 * @access  Private
 */
router.get('/', async (req, res, next) => {
  try {
    // Get initiatives data from Google Sheets
    
    const [initiatives, principles, objectives] = await Promise.all([
      dataService.getSpreadsheetData(),
      dataService.getPrinciples(),
      dataService.getObjectives()
    ]);
    
    // Validate relationships
    const initiativesWithMissingPrinciple = initiatives.filter(i => !i.principleId).length;
    const initiativesWithMissingObjective = initiatives.filter(i => !i.objectiveId).length;
    
    if (initiativesWithMissingPrinciple > 0) {
      console.warn(`${initiativesWithMissingPrinciple} iniciativas sem princípio definido`);
    }
    
    if (initiativesWithMissingObjective > 0) {
      console.warn(`${initiativesWithMissingObjective} iniciativas sem objetivo definido`);
    }
    
    // Calculate dashboard metrics
    const totalInitiatives = initiatives.length;
    
    // Count initiatives by status
    const statusCounts = initiatives.reduce((counts, initiative) => {
      const status = initiative.status || 'NAO_INICIADA';
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
    
    // Count initiatives by performance
    const normalizePerformance = (performance) => {
      if (!performance) return 'DESCONHECIDO';
      
      const performanceLower = performance.toString().toLowerCase().trim();
      
      if (performanceLower.includes('atrasada') || performanceLower === 'atrasado' || performanceLower === 'em atraso') {
        return 'ATRASADA';
      }
      
      if (performanceLower.includes('cronograma') || performanceLower === 'no prazo') {
        return 'NO_CRONOGRAMA';
      }
      
      return 'DESCONHECIDO';
    };
    
    const performanceCounts = initiatives.reduce((counts, initiative) => {
      const performance = normalizePerformance(initiative.performance);
      counts[performance] = (counts[performance] || 0) + 1;
      return counts;
    }, {});
    
    // Calculate average progress
    const averageProgress = initiatives.length > 0 
      ? Math.round(initiatives.reduce((sum, i) => sum + i.progress, 0) / initiatives.length) 
      : 0;
    
    // Get initiatives by completion year
    const initiativesByYear = initiatives.reduce((byYear, initiative) => {
      const year = initiative.completionYear || 'Não definido';
      if (!byYear[year]) {
        byYear[year] = [];
      }
      byYear[year].push(initiative);
      return byYear;
    }, {});
    
    // Return dashboard data
    res.json({
      initiatives,
      principles,
      objectives,
      metrics: {
        totalInitiatives,
        statusCounts,
        performanceCounts, 
        averageProgress,
        initiativesByYear
      }
    });
  } catch (error) {
    console.error('Erro na rota do dashboard:', error);
    next(error);
  }
});

/**
 * @route   GET /api/v1/dashboard/metrics
 * @desc    Get specific dashboard metrics
 * @access  Private
 */
router.get('/metrics', (req, res) => {
  // This is a placeholder for getting specific dashboard metrics
  res.json({
    message: 'Get dashboard metrics - to be implemented',
    // In the future, this will return specific metrics
  });
});

module.exports = router;
