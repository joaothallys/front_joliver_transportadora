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
};

export default dashboardService;
