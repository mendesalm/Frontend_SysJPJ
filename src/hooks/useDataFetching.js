// src/hooks/useDataFetching.js (VERSÃO FINAL E UNIVERSAL)

import { useState, useEffect, useCallback } from "react";

/**
 * Hook customizado e universal para buscar dados.
 * Lida com respostas paginadas (formato { data: [], pagination: {} }) e
 * respostas não paginadas (formato []), retornando sempre um objeto
 * consistente para o componente.
 */
export const useDataFetching = (serviceFunction, params = []) => {
  // O estado inicial já reflete a estrutura de retorno final
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

      // Verifica se a resposta JÁ é paginada
      if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        "pagination" in response
      ) {
        // Se sim, usa a resposta paginada diretamente
        setState(response);
      } else {
        // Se não, é um array simples (ou outro dado). Nós o envolvemos na estrutura padrão.
        const dataArray = Array.isArray(response)
          ? response
          : response
          ? [response]
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
      // Em caso de erro, retorna a estrutura zerada
      setState({ data: [], pagination: null });
    } finally {
      setIsLoading(false);
    }
  }, [serviceFunction, stringifiedParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Espalha o estado (que contém 'data' e 'pagination') e adiciona o resto
  return { ...state, isLoading, error, refetch: fetchData };
};
