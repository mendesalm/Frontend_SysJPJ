import apiClient from "./apiClient";

// --- Livros (Acervo) ---
export const getLivros = (params) => apiClient.get("/biblioteca", { params });
export const createLivro = (livroData) =>
  apiClient.post("/biblioteca", livroData);
export const updateLivro = (id, livroData) =>
  apiClient.put(`/biblioteca/${id}`, livroData);
export const deleteLivro = (id) => apiClient.delete(`/biblioteca/${id}`);

// --- Empréstimos ---
export const registrarEmprestimo = (emprestimoData) => {
  // emprestimoData = { livroId, membroId, dataDevolucaoPrevista }
  return apiClient.post("/emprestimos", emprestimoData);
};

export const registrarDevolucao = (emprestimoId) => {
  return apiClient.put(`/emprestimos/${emprestimoId}/devolver`);
};

export const reservarLivro = (livroId) => {
  return apiClient.post(`/biblioteca/${livroId}/reservas`);
};
