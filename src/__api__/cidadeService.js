import axios from 'axios';

const API_URL = 'https://back-joliver-transportadora.onrender.com/api/cidades';

const cidadeService = {
    findAll: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    create: async (cidadeData) => {
        const response = await axios.post(API_URL, cidadeData);
        return response.data;
    },
    update: async (id, cidadeData) => {
        const response = await axios.put(`${API_URL}/${id}`, cidadeData);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },
    findById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },
};

export default cidadeService;
