import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

// O contexto é criado aqui, mas não precisa ser exportado se o hook for o único ponto de acesso.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserStatus = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await apiClient.get('/lodgemembers/me');
        setUser(response.data);
      } catch (error) {
        console.error("Sessão inválida, limpando...", error);
        localStorage.removeItem('authToken');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { Email: email, password: password });
    const { token, user: userData } = response.data;
    localStorage.setItem('authToken', token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = { user, login, logout, isAuthenticated: !!user, loading, checkUserStatus };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// A função do hook useAuth foi movida para o seu próprio ficheiro para corrigir o erro de Fast Refresh.
// Adicionamos uma exportação nomeada para o AuthContext para que o hook possa acedê-lo.
export { AuthContext };

