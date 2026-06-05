// URL base da API - usa variável de ambiente em produção, localhost em desenvolvimento
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
