import axios from "axios";

// Cria a instância base do cliente Axios
const apiClient = axios.create({
  baseURL: "/api", // O proxy no vite.config.js vai tratar disto
});

// Interceptor de Requisição: Adiciona o token a cada chamada
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função para tentar renovar o token
const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.log("Nenhum refresh token disponível, deslogando.");
    throw new Error("No refresh token");
  }

  try {
    const response = await axios.post("/api/auth/refresh-token", {
      token: refreshToken,
    });
    const { token: newAuthToken } = response.data;

    localStorage.setItem("authToken", newAuthToken);

    return newAuthToken;
  } catch (error) {
    console.error("Falha ao renovar o token:", error);
    throw error;
  }
};

// Interceptor de Resposta: Lida com erros e tenta renovar o token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // CORREÇÃO: Adicionada uma verificação para garantir que 'error.response' existe.
    // Isso previne o crash em erros de rede onde não há resposta do servidor.
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.log("Token expirado. Tentando renovar...");

      try {
        const newAuthToken = await refreshAuthToken();
        console.log("Token renovado com sucesso.");

        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAuthToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAuthToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Logout forçado devido à falha na renovação do token.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login-teste";
        return Promise.reject(refreshError);
      }
    }

    // Se o erro não for 401 ou não tiver um 'response', ele é simplesmente rejeitado.
    return Promise.reject(error);
  }
);

export default apiClient;
