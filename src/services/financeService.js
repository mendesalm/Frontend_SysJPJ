import apiClient from "./apiClient";

// --- Plano de Contas (Accounts) ---

// Modificado para aceitar parâmetros
export const getContas = (params) => {
  return apiClient.get("/financeiro/contas", { params });
};

// Cria uma nova conta
export const createConta = (contaData) => {
  return apiClient.post("/financeiro/contas", contaData);
};

// Atualiza uma conta existente
export const updateConta = (id, contaData) => {
  return apiClient.put(`/financeiro/contas/${id}`, contaData);
};

// Apaga uma conta
export const deleteConta = (id) => {
  return apiClient.delete(`/financeiro/contas/${id}`);
};

// A função getLancamentos já estava correta, mas a incluímos para confirmação
export const getLancamentos = (params) => {
  // `params` pode ser um objeto como { mes: 6, ano: 2024, page: 1, limit: 10 }
  return apiClient.get("/financeiro/lancamentos", { params });
};

export const createLancamento = (lancamentoData) => {
  return apiClient.post("/financeiro/lancamentos", lancamentoData);
};

export const getRelatorioOrcamentario = (ano) => {
  return apiClient.get("/financeiro/relatorios/orcamentario", {
    params: { ano },
  });
};

export const setOrcamento = (orcamentoData) => {
  return apiClient.post("/financeiro/orcamentos", orcamentoData);
};
