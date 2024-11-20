import axios from "axios";

// Obtendo as variáveis de ambiente
const API_URL = import.meta.env.VITE_AUTH0_DOMAIN;
const API_TOKEN = import.meta.env.VITE_REACT_APP_API_TOKEN;

const userService = {
    getCustomers: async (page = 1) => {
        try {
            const response = await axios.get(
                `${API_URL}/get-token/customers?page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${API_TOKEN}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            throw new Error("Erro ao buscar clientes.");
        }
    },

    searchCustomer: async (customerId) => {
        try {
            const response = await axios.get(
                `${API_URL}/get-token/customers/${customerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${API_TOKEN}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
            throw new Error("Erro ao buscar cliente.");
        }
    },

    deactivateClient: async (customerId, date) => {
        try {
            const formData = new FormData();
            formData.append("entry_customer_id", customerId);
            formData.append("entry_date", date);

            await axios.delete(`${API_URL}/delete-client`, {
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data", // Define o tipo de conteúdo como form-data
                    Authorization: `Bearer ${API_TOKEN}`, // Token de autorização
                },
            });
        } catch (error) {
            console.error("Erro ao desativar cliente:", error);
            throw error;
        }
    },
    reactivateClient: async (customerId) => {
        try {
            const formData = new FormData();
            formData.append("entry_customer_id", customerId);

            await axios.put(`${API_URL}/reactivate-client`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Define o tipo de conteúdo como form-data
                    Authorization: `Bearer ${API_TOKEN}`, // Token de autorização
                },
            });
        } catch (error) {
            console.error("Erro ao reativar cliente:", error);
            throw error;
        }
    },
};

export default userService;