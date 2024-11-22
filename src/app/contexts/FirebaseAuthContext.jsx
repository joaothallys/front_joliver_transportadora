import React, { createContext, useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "__api__/db/auth";

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
      };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  // Inicializa o estado de autenticação
  useEffect(() => {
    const initialize = () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

      console.log("Inicializando autenticação. Estado armazenado:", isAuthenticated);

      if (isAuthenticated) {
        dispatch({ type: "INITIALIZE", payload: { isAuthenticated: true } });
      } else {
        dispatch({ type: "INITIALIZE", payload: { isAuthenticated: false } });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Tentando login...");
      await authService.login(email, password);

      // Salvar estado no localStorage
      localStorage.setItem("isAuthenticated", "true");

      dispatch({ type: "LOGIN" });
      navigate("/material/customers");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Fazendo logout...");
      await authService.logout();

      // Remover estado do localStorage
      localStorage.removeItem("isAuthenticated");

      dispatch({ type: "LOGOUT" });
      navigate("/session/signin");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {state.isInitialized ? children : <div>Carregando...</div>}
    </AuthContext.Provider>
  );
};

export default AuthContext;
