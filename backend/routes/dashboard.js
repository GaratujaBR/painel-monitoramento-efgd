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
    console.log('Iniciando busca de dados do dashboard...');
    
    // Get initiatives data from Google Sheets
    const [initiatives, principles, objectives] = await Promise.all([
      dataService.getSpreadsheetData(),
      dataService.getPrinciples(),
      dataService.getObjectives()
    ]);
    
    console.log(`Dados carregados:
    - Princípios: ${principles.length}
    - Objetivos: ${objectives.length}
    - Iniciativas: ${initiatives.length}`);
    
    // Log sample data for debugging
    if (principles.length > 0) {
      console.log('Amostra de princípios:', principles.slice(0, 2));
    } else {
      console.warn('Nenhum princípio encontrado!');
    }
    
    if (objectives.length > 0) {
      console.log('Amostra de objetivos:', objectives.slice(0, 2));
    } else {
      console.warn('Nenhum objetivo encontrado!');
    }

    if (initiatives.length > 0) {
      console.log('Amostra de iniciativas:', initiatives.slice(0, 2));
      
      // Verificar quais iniciativas têm principleId e objectiveId
      const withPrincipleId = initiatives.filter(i => i.principleId && i.principleId.trim() !== '').length;
      const withObjectiveId = initiatives.filter(i => i.objectiveId && i.objectiveId.trim() !== '').length;
      
      console.log(`Backend - Iniciativas com principleId: ${withPrincipleId}/${initiatives.length} (${(withPrincipleId/initiatives.length*100).toFixed(1)}%)`);
      console.log(`Backend - Iniciativas com objectiveId: ${withObjectiveId}/${initiatives.length} (${(withObjectiveId/initiatives.length*100).toFixed(1)}%)`);
      
      // Verificar distribuição de iniciativas por princípio
      const principleDistribution = {};
      initiatives.forEach(initiative => {
        if (initiative.principleId && initiative.principleId.trim() !== '') {
          principleDistribution[initiative.principleId] = (principleDistribution[initiative.principleId] || 0) + 1;
        }
      });
      
      if (Object.keys(principleDistribution).length > 0) {
        console.log('Backend - Distribuição de iniciativas por princípio:', principleDistribution);
      } else {
        console.warn('Backend - Nenhuma iniciativa com principleId válido!');
      }
      
      // Verificar distribuição de iniciativas por objetivo
      const objectiveDistribution = {};
      initiatives.forEach(initiative => {
        if (initiative.objectiveId && initiative.objectiveId.trim() !== '') {
          objectiveDistribution[initiative.objectiveId] = (objectiveDistribution[initiative.objectiveId] || 0) + 1;
        }
      });
      
      if (Object.keys(objectiveDistribution).length > 0) {
        console.log('Backend - Distribuição de iniciativas por objetivo:', objectiveDistribution);
      } else {
        console.warn('Backend - Nenhuma iniciativa com objectiveId válido!');
      }
    }
    
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
    
    console.log('Métricas calculadas:', {
      totalInitiatives,
      statusCountsTotal: Object.values(statusCounts).reduce((a, b) => a + b, 0),
      averageProgress
    });
    
    // Return dashboard data
    res.json({
      initiatives,
      principles,
      objectives,
      metrics: {
        totalInitiatives,
        statusCounts,
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
