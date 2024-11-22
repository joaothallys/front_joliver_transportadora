import axios from 'axios';

const API_URL = 'https://back-joliver-transportadora.onrender.com/api/estados';

const estadoService = {
    // Função para buscar todos os estados
    findAll: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar estados:', error);
            throw error;
        }
    },

    // Função para buscar um estado por ID
    findById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar estado com ID ${id}:`, error);
            throw error;
        }
    },

    // Função para criar um novo estado
    create: async (estado) => {
        try {
            const response = await axios.post(API_URL, estado);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar estado:', error);
            throw error;
        }
    },

    // Função para atualizar um estado existente
    update: async (id, estado) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, estado);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar estado com ID ${id}:`, error);
            throw error;
        }
    },

    // Função para excluir um estado por ID
    delete: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao excluir estado com ID ${id}:`, error);
            throw error;
        }
    },
};

export default estadoService;
