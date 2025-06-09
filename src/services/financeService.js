import apiClient from './apiClient';

// --- Plano de Contas (Accounts) ---


// Busca todas as contas
export const getContas = () => {
  return apiClient.get('/financeiro/contas');
};

// Cria uma nova conta
export const createConta = (contaData) => {
  return apiClient.post('/financeiro/contas', contaData);
};

// Atualiza uma conta existente
export const updateConta = (id, contaData) => {
  return apiClient.put(`/financeiro/contas/${id}`, contaData);
};

// Apaga uma conta
export const deleteConta = (id) => {
  return apiClient.delete(`/financeiro/contas/${id}`);
};

export const getLancamentos = (params) => {
  // `params` pode ser um objeto como { mes: 6, ano: 2024 }
  return apiClient.get('/financeiro/lancamentos', { params });
};

export const createLancamento = (lancamentoData) => {
  return apiClient.post('/financeiro/lancamentos', lancamentoData);
};
// Futuramente, adicionaremos aqui funções para Lançamentos e Orçamentos.

export const getRelatorioOrcamentario = (ano) => {
  return apiClient.get('/financeiro/relatorios/orcamentario', { params: { ano } });
};

export const setOrcamento = (orcamentoData) => {
  // orcamentoData deve ser um objeto como { ano, contaId, valorOrcado }
  return apiClient.post('/financeiro/orcamentos', orcamentoData);
};