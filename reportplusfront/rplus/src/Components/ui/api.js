import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7180/api', // Correspondente ao backend configurado com HTTPS e caminho base "/api"
});

export default api;
