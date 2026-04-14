const isProd = window.location.hostname !== 'localhost';

export const environment = {
  production: isProd,
  endpoint: isProd
    ? 'https://pokemon-tcg-backend-xfbt.onrender.com'
    : 'http://localhost:8000'
};
