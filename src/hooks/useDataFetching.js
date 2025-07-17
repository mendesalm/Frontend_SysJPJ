import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Hook customizado e universal para buscar dados.
 * Lida com respostas paginadas e não paginadas, retornando sempre um objeto consistente.
 * Esta versão foi corrigida para lidar corretamente com as dependências do useCallback.
 */
export const useDataFetching = (serviceFunction, params = []) => {
  const [state, setState] = useState({ data: [], pagination: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Serializa o array de parâmetros numa string JSON estável.
  // Esta string só mudará se o conteúdo dos parâmetros mudar.
  const stringifiedParams = JSON.stringify(params);

  const fetchData = useCallback(async () => {
    // Converte a string de volta para um array para uso na função.
    const parsedParams = JSON.parse(stringifiedParams);

    // Evita a busca se algum dos parâmetros for nulo ou indefinido.
    if (parsedParams.some((p) => p === undefined || p === null)) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await serviceFunction(...parsedParams);
      const apiData = response.data;

      if (
        apiData &&
        typeof apiData === "object" &&
        !Array.isArray(apiData) &&
        "totalPages" in apiData &&
        "data" in apiData
      ) {
        setState({
          data: apiData.data,
          pagination: {
            currentPage: apiData.currentPage,
            totalPages: apiData.totalPages,
            totalItems: apiData.totalItems,
          },
        });
      } else if (
        apiData &&
        typeof apiData === "object" &&
        !Array.isArray(apiData) &&
        "data" in apiData &&
        "pagination" in apiData
      ) {
        setState({ data: apiData.data, pagination: apiData.pagination });
      } else {
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
  }, [serviceFunction, stringifiedParams]); // Agora, o hook depende apenas de valores estáveis.

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const memoizedValue = useMemo(() => {
    return { ...state, isLoading, error, refetch: fetchData, setState };
  }, [state, isLoading, error, fetchData]);

  return memoizedValue;
};
