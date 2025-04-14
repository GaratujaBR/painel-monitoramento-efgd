// Dados mockados para demonstração do painel de iniciativas

// Mock data para princípios da EFGD
export const mockPrinciples = [
  { id: 'P1', name: 'Governo Centrado no Cidadão e Inclusivo' },
  { id: 'P2', name: 'Governo Integrado e Colaborativo' },
  { id: 'P3', name: 'Governo Inteligente e Inovador' },
  { id: 'P4', name: 'Governo Confiável e Seguro' },
  { id: 'P5', name: 'Governo Transparente, Aberto e Participativo' },
  { id: 'P6', name: 'Governo Eficiente e Sustentável' }
];

// Mock data para objetivos da EFGD
export const mockObjectives = [
  { id: 'O1', name: 'Prover serviços públicos digitais personalizados, simples, de forma pró-ativa e centrados no cidadão' },
  { id: 'O2', name: 'Ofertar serviços digitais inclusivos' },
  { id: 'O3', name: 'Aperfeiçoar a governança de dados e a interoperabilidade' },
  { id: 'O4', name: 'Estimular o uso e a integração de plataformas e serviços de governo digital no governo federal' },
  { id: 'O5', name: 'Estimular o uso e a integração de plataformas e serviços de governo digital com os entes e poderes da federação' },
  { id: 'O6', name: 'Fomentar o uso inteligente de dados pelos órgãos do governo ' },
  { id: 'O7', name: 'Fomentar o ecossistema de inovação aberta' },
  { id: 'O8', name: 'Desenvolver habilidades digitais dos servidores' },
  { id: 'O9', name: 'Elevar a maturidade e a resiliência dos órgãos e das entidades em termos de privacidade e segurança da informação' },
  { id: 'O10', name: 'Fortalecer a privacidade e a segurança dos dados dos cidadãos ' },
  { id: 'O11', name: 'Prover identificação única do cidadão ' },
  { id: 'O12', name: 'Fortalecer a cultura de governo aberto e transparente ' },
  { id: 'O13', name: 'Promover a participação digital nas políticas públicas e serviços digitais ' },
  { id: 'O14', name: 'Otimizar a oferta de infraestrutura compartilhada de tecnologia da informação e comunicação para o fortalecimento do governo digital ' },
  { id: 'O15', name: 'Otimizar processos de negócio da gestão pública ' }
];

// Mock data para áreas da EFGD
export const mockAreas = [
  { id: 'A1', name: 'SGD' },
  { id: 'A2', name: 'DELOG' },
  { id: 'A3', name: 'DEDAD' },
  { id: 'A4', name: 'DEGTI' },
  { id: 'A5', name: 'MS' },
  { id: 'A6', name: 'IFI' },
  { id: 'A7', name: 'ENAP' },
  { id: 'A8', name: 'PR' },
  { id: 'A9', name: 'DEDIF' }
];

// Mock data para iniciativas da EFGD
export const mockInitiatives = [
  // Objetivo 1
  {
    id: '1.1',
    name: 'Transformar 95% dos serviços digitalizáveis',
    principleId: 'P1',
    objectiveId: 'O1',
    areaId: 'A1',
    completionYear: 2026,
    status: 'No Cronograma',
    progress: 45
  },
  {
    id: '1.2',
    name: 'Criar sistema de avaliação para 80 serviços mais utilizados',
    principleId: 'P1',
    objectiveId: 'O1',
    areaId: 'A1',
    completionYear: 2026,
    status: 'Não Iniciada',
    progress: 0
  },
  {
    id: '1.7',
    name: 'Implementar prescrição eletrônica no app Meu SUS Digital',
    principleId: 'P1',
    objectiveId: 'O1',
    areaId: 'A1',
    completionYear: 2025,
    status: 'No Cronograma',
    progress: 60
  },

  // Objetivo 2
  {
    id: '2.1',
    name: 'Criar padrão de acessibilidade digital para serviços públicos',
    principleId: 'P1',
    objectiveId: 'O2',
    areaId: 'A2',
    completionYear: 2025,
    status: 'No Cronograma',
    progress: 75
  },
  {
    id: '2.4',
    name: 'Melhorar acessibilidade em 70% dos sites do GOV.BR',
    principleId: 'P1',
    objectiveId: 'O2',
    areaId: 'A2',
    completionYear: 2026,
    status: 'No Cronograma',
    progress: 35
  },

  // Objetivo 3
  {
    id: '3.1',
    name: 'Publicar a Política de Governança de Dados',
    principleId: 'P2',
    objectiveId: 'O3',
    areaId: 'A3',
    completionYear: 2024,
    status: 'Concluida',
    progress: 100
  },
  {
    id: '3.5',
    name: 'Aumentar a maturidade de dados do governo federal',
    principleId: 'P2',
    objectiveId: 'O3',
    areaId: 'A3',
    completionYear: 2026,
    status: 'No Cronograma',
    progress: 40
  },

  // Objetivo 4
  {
    id: '4.1',
    name: 'Implementar pagamentos digitais para 60% dos serviços',
    principleId: 'P3',
    objectiveId: 'O4',
    areaId: 'A4',
    completionYear: 2026,
    status: 'Atrasada',
    progress: 15
  },

  // Objetivo 5
  {
    id: '5.1',
    name: 'Criar infraestrutura para modelos de IA',
    principleId: 'P3',
    objectiveId: 'O5',
    areaId: 'A5',
    completionYear: 2026,
    status: 'Não Iniciada',
    progress: 5
  },
  {
    id: '5.2',
    name: 'Estruturar núcleo de IA para políticas públicas',
    principleId: 'P3',
    objectiveId: 'O5',
    areaId: 'A5',
    completionYear: 2025,
    status: 'No Cronograma',
    progress: 30
  },

  // Objetivo 6
  {
    id: '6.1',
    name: 'Aumentar índice de segurança da informação',
    principleId: 'P4',
    objectiveId: 'O6',
    areaId: 'A6',
    completionYear: 2027,
    status: 'No Cronograma',
    progress: 25
  },
  {
    id: '6.3',
    name: 'Criar sistema de consentimento de compartilhamento de dados',
    principleId: 'P4',
    objectiveId: 'O6',
    areaId: 'A6',
    completionYear: 2025,
    status: 'Atrasada',
    progress: 20
  },

  // Objetivo 7
  {
    id: '7.1',
    name: 'Vincular 100% dos cadastros ao CPF',
    principleId: 'P4',
    objectiveId: 'O7',
    areaId: 'A7',
    completionYear: 2025,
    status: 'No Cronograma',
    progress: 80
  },
  {
    id: '7.2',
    name: 'Expandir uso do app GOV.BR para 100 milhões de cidadãos',
    principleId: 'P4',
    objectiveId: 'O7',
    areaId: 'A7',
    completionYear: 2026,
    status: 'No Cronograma',
    progress: 55
  },

  // Objetivo 8
  {
    id: '8.1',
    name: 'Criar Plataforma Nacional de Dados da Educação',
    principleId: 'P5',
    objectiveId: 'O8',
    areaId: 'A8',
    completionYear: 2026,
    status: 'Não Iniciada',
    progress: 0
  },
  {
    id: '8.2',
    name: 'Ter 3 milhões de cidadãos no Brasil Participativo',
    principleId: 'P5',
    objectiveId: 'O8',
    areaId: 'A8',
    completionYear: 2027,
    status: 'No Cronograma',
    progress: 15
  },

  // Objetivo 9
  {
    id: '9.1',
    name: 'Garantir que 60% da demanda de software seja centralizada',
    principleId: 'P6',
    objectiveId: 'O9',
    areaId: 'A9',
    completionYear: 2026,
    status: 'No Cronograma',
    progress: 30
  },
  {
    id: '9.2',
    name: 'Criar sistema de monitoramento de impacto ambiental da transformação digital',
    principleId: 'P6',
    objectiveId: 'O9',
    areaId: 'A9',
    completionYear: 2025,
    status: 'Não Iniciada',
    progress: 10
  }
];
