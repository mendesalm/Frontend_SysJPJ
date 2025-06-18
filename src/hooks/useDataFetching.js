import { useState, useEffect, useCallback } from "react";

/**
 * Hook customizado e universal para buscar dados, corrigido para lidar com respostas do Axios.
 */
export const useDataFetching = (serviceFunction, params = []) => {
  const [state, setState] = useState({ data: [], pagination: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const stringifiedParams = JSON.stringify(params);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const parsedParams = JSON.parse(stringifiedParams);
      const response = await serviceFunction(...parsedParams); // A resposta completa do Axios

      // --- CORREÇÃO PRINCIPAL ---
      // Extraímos a carga útil da API da propriedade `data` da resposta do Axios.
      const apiData = response.data;

      // Agora, verificamos a estrutura dos dados da API.
      if (
        apiData &&
        typeof apiData === "object" &&
        "data" in apiData &&
        "pagination" in apiData
      ) {
        // Se a resposta JÁ é paginada, usa-a diretamente.
        setState({ data: apiData.data, pagination: apiData.pagination });
      } else {
        // Se não, é um array simples ou outro dado. Nós o envolvemos na estrutura padrão.
        const dataArray = Array.isArray(apiData)
          ? apiData
          : apiData
          ? [apiData]
          : [];
        setState({
          data: dataArray,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: dataArray.length,
          },
        });
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError(err.response?.data?.message || "Falha ao carregar os dados.");
      setState({ data: [], pagination: null });
    } finally {
      setIsLoading(false);
    }
  }, [serviceFunction, stringifiedParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Retornamos 'setState' para permitir atualizações otimistas da UI, se necessário.
  return { ...state, isLoading, error, refetch: fetchData, setState };
};
