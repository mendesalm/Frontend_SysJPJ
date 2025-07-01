import React, { createContext, useState, useEffect, useCallback } from "react";
import apiClient from "../services/apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserStatus = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await apiClient.get("/lodgemembers/me");
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao verificar o status do usuário:", error);
        logout();
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

    const { accessToken, refreshToken, user: userData } = response.data;

    if (!accessToken) {
      throw new Error(
        "Login bem-sucedido, mas nenhum accessToken foi recebido."
      );
    }

    localStorage.setItem("authToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;

    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    delete apiClient.defaults.headers.common["Authorization"];
  };

  const hasPermission = useCallback((permissionKey) => {
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permissionKey);
  }, [user]);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    checkUserStatus,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
