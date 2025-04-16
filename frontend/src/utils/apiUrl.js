export const getApiUrl = () =>
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://painel-monitoramento-efgd.onrender.com'
    : '');
