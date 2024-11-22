import axios from "axios";

const API_URL = "https://back-joliver-transportadora.onrender.com/api/pessoas-juridicas";

const pessoaJuridicaService = {
    findAll: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    create: async (pjData) => {
        const response = await axios.post(API_URL, pjData);
        return response.data;
    },
    update: async (id, pjData) => {
        const response = await axios.put(`${API_URL}/${id}`, pjData);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },
};

export default pessoaJuridicaService;
