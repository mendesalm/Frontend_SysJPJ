import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Hook customizado e universal para buscar dados.
 * Lida com respostas paginadas (formato { data: [], pagination: {} }) e
 * respostas não paginadas (um array simples), retornando sempre um objeto
 * consistente para o componente.
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
      const response = await serviceFunction(...parsedParams);

      // DEBUG: Inspeciona a resposta crua da API
      console.log(
        `[useDataFetching] Resposta da API para ${serviceFunction.name}:`,
        response
      );

      const apiData = response.data;

      if (
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
  }, [serviceFunction, stringifiedParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const memoizedValue = useMemo(() => {
    return { ...state, isLoading, error, refetch: fetchData, setState };
  }, [state, isLoading, error, fetchData]);

  return memoizedValue;
};
