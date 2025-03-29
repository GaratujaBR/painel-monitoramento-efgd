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
    console.log('Status de inicialização do serviço:', dataService.initialized ? 'Inicializado' : 'Não inicializado');
    
    // Get initiatives data from Google Sheets
    console.log('Buscando dados do Google Sheets...');
    
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
    
    // Log status and performance counts for debugging
    console.log('Status counts:', statusCounts);
    console.log('Iniciativas CONCLUIDA:', statusCounts['CONCLUIDA'] || 0);
    console.log('Iniciativas NO_CRONOGRAMA:', statusCounts['NO_CRONOGRAMA'] || 0);
    console.log('Iniciativas ATRASADA:', statusCounts['ATRASADA'] || 0);
    console.log('Iniciativas NAO_INICIADA:', statusCounts['NAO_INICIADA'] || 0);
    
    console.log('Performance counts:', performanceCounts);
    console.log('Iniciativas NO_CRONOGRAMA (performance):', performanceCounts['NO_CRONOGRAMA'] || 0);
    console.log('Iniciativas ATRASADA (performance):', performanceCounts['ATRASADA'] || 0);
    
    // Log a sample of initiatives with their status
    console.log('Amostra de iniciativas com status:');
    initiatives.slice(0, 5).forEach((initiative, index) => {
      console.log(`Iniciativa ${index + 1}: "${initiative.name.substring(0, 30)}..." - Status: ${initiative.status}`);
    });
    
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
        performanceCounts, // Add performanceCounts to the response
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
