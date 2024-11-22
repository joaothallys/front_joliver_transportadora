import axios from "axios";

const API_URL = "https://back-joliver-transportadora.onrender.com/api/fretes";

const freteService = {
    findAll: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar fretes:", error.message);
            throw error;
        }
    },

    create: async (freteData) => {
        try {
            const response = await axios.post(API_URL, freteData);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar frete:", error.message);
            throw error;
        }
    },

    update: async (id, freteData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, freteData);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar frete com ID ${id}:`, error.message);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao excluir frete com ID ${id}:`, error.message);
            throw error;
        }
    },
};

export default freteService;
