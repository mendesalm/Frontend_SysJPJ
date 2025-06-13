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

  // Criamos uma versão stringificada e estável dos parâmetros.
  const stringifiedParams = JSON.stringify(params);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      // --- INÍCIO DA CORREÇÃO ---
      // Transformamos a string de volta em um array AQUI DENTRO.
      // Agora, esta função não depende mais da variável `params` externa,
      // apenas de `stringifiedParams`, que está no array de dependências.
      const parsedParams = JSON.parse(stringifiedParams);
      const response = await serviceFunction(...parsedParams);
      // --- FIM DA CORREÇÃO ---

      setData(response.data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError(err.response?.data?.message || "Falha ao carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  }, [serviceFunction, stringifiedParams]); // O array de dependências agora está correto.

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};
