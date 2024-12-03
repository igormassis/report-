import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7180/api", // Substitua pela URL do backend
});

export default api; // Exportação padrão
