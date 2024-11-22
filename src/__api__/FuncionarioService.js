import axios from "axios";

const api = axios.create({
    baseURL: "https://back-joliver-transportadora.onrender.com/api", // Substitua pela URL da sua API
});

const funcionarioService = {
    // Buscar todos os funcionários
    async findAll() {
        try {
            const response = await api.get("/funcionarios");
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
            throw error;
        }
    },

    // Criar um novo funcionário
    async create(funcionario) {
        try {
            const response = await api.post("/funcionarios", funcionario);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar funcionário:", error);
            throw error;
        }
    },

    // Atualizar um funcionário existente
    async update(id, funcionario) {
        try {
            const response = await api.put(`/funcionarios/${id}`, funcionario);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar funcionário:", error);
            throw error;
        }
    },

    // Excluir um funcionário
    async delete(id) {
        try {
            const response = await api.delete(`/funcionarios/${id}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir funcionário:", error);
            throw error;
        }
    },
};

export default funcionarioService;
