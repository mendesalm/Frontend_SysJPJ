// src/hooks/useDataFetching.js (CORRIGIDO)

import { useState, useEffect, useCallback } from "react";

/**
 * Um hook customizado para buscar dados de um serviço de API.
 * Ele gerencia os estados de carregamento, erro e os próprios dados.
 * @param {Function} serviceFunction A função do serviço que retorna uma promessa (ex: getAllAvisos).
 * @param {Array} params Parâmetros opcionais para passar para a função de serviço.
 * @returns {{data: Array, isLoading: boolean, error: string, refetch: Function}}
 */
export const useDataFetching = (serviceFunction, params = []) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const stringifiedParams = JSON.stringify(params);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const parsedParams = JSON.parse(stringifiedParams);
      const response = await serviceFunction(...parsedParams);

      // --- CORREÇÃO APLICADA AQUI ---
      // A função de serviço já retorna os dados. Não precisamos mais acessar '.data'.
      setData(response);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError(err.response?.data?.message || "Falha ao carregar os dados.");
      setData([]); // Garante que data seja sempre um array em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, [serviceFunction, stringifiedParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};
