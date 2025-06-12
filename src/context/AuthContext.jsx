import React, { createContext, useState, useEffect, useCallback } from "react";
import apiClient from "../services/apiClient";

// Função auxiliar para descodificar o payload de um JWT
const decodeToken = (token) => {
  try {
    // Um JWT é dividido em 3 partes por pontos. A segunda parte é o payload.
    // Usamos atob() para descodificar de Base64.
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Erro ao descodificar o token:", e);
    return null;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiration, setTokenExpiration] = useState(null);

  const checkUserStatus = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await apiClient.get("/lodgemembers/me");
        const decodedToken = decodeToken(token);
        setUser(response.data);
        if (decodedToken) {
          setTokenExpiration(decodedToken.exp * 1000); // Converte para milissegundos
        }
      } catch (error) {
        logout(); // Limpa tudo se a verificação falhar
        console.error("Erro ao verificar o usuário:", error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  const login = async (email, password) => {
    const response = await apiClient.post("/auth/login", {
      Email: email,
      password: password,
    });
    const { token, user: userData } = response.data;

    localStorage.setItem("authToken", token);
    const decodedToken = decodeToken(token);
    setUser(userData);
    if (decodedToken) {
      setTokenExpiration(decodedToken.exp * 1000);
    }
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setTokenExpiration(null);
  };

  // Função para renovar o token
  const refreshToken = async () => {
    try {
      // Assume que você criará esta rota no backend
      const response = await apiClient.post("/auth/refresh-token");
      const { token } = response.data;
      localStorage.setItem("authToken", token);
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setTokenExpiration(decodedToken.exp * 1000);
      }
      return true;
    } catch (error) {
      console.error("Falha ao renovar o token, a deslogar...", error);
      logout();
      return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    checkUserStatus,
    tokenExpiration,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext }; // Exporta para o hook useAuth
