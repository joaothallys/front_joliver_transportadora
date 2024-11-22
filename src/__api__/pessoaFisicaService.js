import axios from "axios";

const API_URL = "https://back-joliver-transportadora.onrender.com/api/pessoas-fisicas";

const pessoaFisicaService = {
    findAll: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    create: async (pessoaData) => {
        const response = await axios.post(API_URL, pessoaData);
        return response.data;
    },
    update: async (id, pessoaData) => {
        const response = await axios.put(`${API_URL}/${id}`, pessoaData);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },
};

export default pessoaFisicaService;
