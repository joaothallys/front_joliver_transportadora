import axios from 'axios';

const API_URL = 'https://back-joliver-transportadora.onrender.com';

const dashboardService = {
    // Função para obter os dados de media-fretes
    getMediaFretes: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/media-fretes/${id}`);
            return response.data; // Retorna os dados da resposta
        } catch (error) {
            console.error('Erro ao buscar média de fretes:', error);
            throw error; // Lança erro caso a requisição falhe
        }
    },
    getArrecadacaoFretes: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/arrecadacao-fretes/${id}`);
            return response.data; // Retorna os dados da resposta
        } catch (error) {
            console.error('Erro ao buscar arrecadação de fretes:', error);
            throw error; // Lança erro caso a requisição falhe
        }
    },
    getFretesFuncionarios: async (mes, ano) => {
        try {
            const response = await axios.get(`${API_URL}/fretes-funcionarios/${mes}/${ano}`);
            return response.data; // Retorna os dados da resposta
        } catch (error) {
            console.error('Erro ao buscar fretes atendidos por funcionários:', error);
            throw error; // Lança erro caso a requisição falhe
        }
    },
};

export default dashboardService;
