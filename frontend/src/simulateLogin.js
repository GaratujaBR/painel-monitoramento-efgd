const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

/**
 * Script para simular login e capturar uma imagem do dashboard principal
 */
(async () => {
  // Criar pasta para screenshots se não existir
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  // Iniciar o navegador
  console.log('Iniciando navegador...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1280,
      height: 720
    }
  });

  try {
    // Abrir nova página
    const page = await browser.newPage();
    console.log('Navegando para a página de login...');
    
    // Navegar para a página de login
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    // Simular login
    console.log('Preenchendo credenciais...');
    await page.type('input[name="email"]', 'admin@gov.br');
    await page.type('input[name="password"]', 'password123');
    
    // Clicar no botão de login
    console.log('Realizando login...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    
    // Aguardar carregamento do dashboard
    console.log('Aguardando carregamento do dashboard...');
    await page.waitForSelector('.dashboard-container', { timeout: 5000 });
    
    // Capturar screenshot do dashboard
    console.log('Capturando screenshot do dashboard...');
    const screenshotPath = path.join(screenshotsDir, 'dashboard.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Screenshot salvo em: ${screenshotPath}`);
    
    // Manter o navegador aberto para visualização
    console.log('Navegador mantido aberto para visualização do dashboard.');
    console.log('Pressione Ctrl+C para encerrar o script quando terminar.');
    
  } catch (error) {
    console.error('Erro durante a execução:', error);
    await browser.close();
  }
})();
