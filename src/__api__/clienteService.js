import axios from 'axios';

// Criação de uma instância do Axios para configurar o endpoint base
const api = axios.create({
    baseURL: 'https://back-joliver-transportadora.onrender.com/api', // Substitua pela URL base da sua API
});

const clienteService = {
    // Função para buscar todos os clientes
    async findAll() {
        try {
            const response = await api.get('/clientes');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            throw error; // Lança o erro para ser tratado no componente
        }
    },

    // Função para buscar um cliente por ID
    async findById(id) {
        try {
            const response = await api.get(`/clientes/${id}`);
            return response.data; // Retorna o cliente específico
        } catch (error) {
            console.error(`Erro ao buscar cliente com ID ${id}:`, error);
            throw error; // Lança o erro para ser tratado no componente
        }
    },


    // Função para criar um cliente
    async create(cliente) {
        try {
            const response = await api.post('/clientes', cliente);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    },

    // Função para atualizar um cliente
    async update(id, cliente) {
        try {
            const response = await api.put(`/clientes/${id}`, cliente);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    },

    // Função para excluir um cliente
    async delete(id) {
        try {
            const response = await api.delete(`/clientes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            throw error;
        }
    },
    // Função para buscar todas as cidades
    async findAllCidades() {
        const response = await api.get('/cidades');
        return response.data;
    },
};

export default clienteService;
