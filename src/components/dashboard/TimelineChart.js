import React, { useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Charts.css';

const TimelineChart = ({ initiatives }) => {
  // Create a ref for the chart container
  const chartContainerRef = useRef(null);

  // useEffect to log dimensions after component mounts
  useEffect(() => {
    // Log parent container dimensions
    const yearChartContainer = document.querySelector('.year-chart');
    if (yearChartContainer) {
      console.log('TimelineChart - Parent (.year-chart) Dimensions:', {
        width: yearChartContainer.clientWidth,
        height: yearChartContainer.clientHeight,
        offsetWidth: yearChartContainer.offsetWidth,
        offsetHeight: yearChartContainer.offsetHeight,
        boundingRect: yearChartContainer.getBoundingClientRect()
      });
    } else {
      console.log('TimelineChart - Parent (.year-chart) not found');
    }

    // Log initiatives-by-year container dimensions
    const initiativesByYearContainer = document.querySelector('.initiatives-by-year');
    if (initiativesByYearContainer) {
      console.log('TimelineChart - Parent (.initiatives-by-year) Dimensions:', {
        width: initiativesByYearContainer.clientWidth,
        height: initiativesByYearContainer.clientHeight,
        offsetWidth: initiativesByYearContainer.offsetWidth,
        offsetHeight: initiativesByYearContainer.offsetHeight,
        boundingRect: initiativesByYearContainer.getBoundingClientRect()
      });
    } else {
      console.log('TimelineChart - Parent (.initiatives-by-year) not found');
    }

    // Log chart container dimensions
    if (chartContainerRef.current) {
      console.log('TimelineChart - Chart Container Dimensions:', {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        offsetWidth: chartContainerRef.current.offsetWidth,
        offsetHeight: chartContainerRef.current.offsetHeight,
        boundingRect: chartContainerRef.current.getBoundingClientRect()
      });
    }
  }, []);
  // Define status colors according to government guidelines
  const performanceColors = {
    'No Cronograma': '#203ce2', // Blue
    'Atrasada': '#920a0a', // Red
    'Concluída': '#00b505', // Green
  };

  // Process data grouped by completionYear
  const processData = () => {
    const data = {};
    
    initiatives?.forEach(initiative => {
      const year = initiative.completionYear;
      const performance = initiative.performance;
      
      if (year) {
        if (!data[year]) {
          data[year] = {
            year: year,
            'Concluída': 0,
            'No Cronograma': 0,
            'Atrasada': 0
          };
        }
        
        // Count completed based on status
        if (initiative.status === 'CONCLUIDA') {
          data[year]['Concluída']++;
        }
        
        // Count performance status
        if (performance === 'No Cronograma') {
          data[year]['No Cronograma']++;
        } else if (performance === 'Atrasada') {
          data[year]['Atrasada']++;
        }
      }
    });

    // Adjust "No Cronograma" counts to exclude completed
    Object.values(data).forEach(yearData => {
      yearData['No Cronograma'] = Math.max(0, yearData['No Cronograma'] - yearData['Concluída']);
    });

    // Convert to array and sort by year
    return Object.values(data).sort((a, b) => a.year - b.year);
  };

  const chartData = processData();
  console.log('TimelineChart - Processed chartData:', chartData);
  console.log('TimelineChart - Number of years:', chartData.length);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const concluida = payload.find(p => p.dataKey === 'Concluída')?.value || 0;
      const noCronograma = payload.find(p => p.dataKey === 'No Cronograma')?.value || 0;
      const atrasada = payload.find(p => p.dataKey === 'Atrasada')?.value || 0;
      const total = concluida + noCronograma + atrasada;
      
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '14px',
          minWidth: '200px'
        }}>
          <p style={{ 
            fontWeight: 'bold', 
            margin: '0 0 10px 0',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px'
          }}>Ano: {label}</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
            <span style={{ color: '#00b505' }}>Concluída:</span>
            <span style={{ fontWeight: '500' }}>{concluida} ({Math.round((concluida/total)*100)}%)</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
            <span style={{ color: '#203ce2' }}>No Cronograma:</span>
            <span style={{ fontWeight: '500' }}>{noCronograma} ({Math.round((noCronograma/total)*100)}%)</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
            <span style={{ color: '#920a0a' }}>Atrasada:</span>
            <span style={{ fontWeight: '500' }}>{atrasada} ({Math.round((atrasada/total)*100)}%)</span>
          </div>
          
          <div style={{ 
            marginTop: '10px', 
            paddingTop: '5px', 
            borderTop: '1px solid #eee',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Total:</span>
            <span>{total} iniciativas</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Log rendering configuration and data
  console.log('TimelineChart - Rendering with props:', {
    height: 600,
    margin: { top: 20, right: 30, left: 30, bottom: 20 },
    yAxisWidth: 80,
    dataLength: chartData.length
  });
  
  // Log the actual data being rendered
  console.log('TimelineChart - Chart data at render time:', chartData);

  return (
    <div ref={chartContainerRef} className="chart-container" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>Status/Performance por Prazo</h3>
      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 5, left: 30, bottom: 20 }}
          barGap={5}
          barCategoryGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            type="category" 
            dataKey="year" 
            width={80}
            tick={{ fontSize: 20, fontWeight: 'bold' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            barSize={20}
            dataKey="Concluída" 
            name="Concluída" 
            fill="#00b505" 
            stackId="a"
          />
          <Bar 
            barSize={20}
            dataKey="No Cronograma" 
            name="No Cronograma" 
            fill="#203ce2" 
            stackId="a"
          />
          <Bar 
            barSize={20}
            dataKey="Atrasada" 
            name="Atrasada" 
            fill="#920a0a" 
            stackId="a"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;
