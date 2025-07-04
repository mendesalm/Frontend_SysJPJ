import apiClient from "./apiClient";
import axios from "axios"; // Importa o axios diretamente para chamadas externas

// --- Livros (Acervo) ---
export const getLivros = (params) =>
  apiClient.get("/biblioteca", { params: { ...params, withHistorico: true } });
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
export const solicitarEmprestimo = (livroId) => {
  return apiClient.post("/biblioteca/solicitar-emprestimo", { livroId });
};

// 2. Rotas para Gestão (Admin)
export const getSolicitacoesPendentes = () => {
  return apiClient.get("/biblioteca/solicitacoes");
};

export const aprovarSolicitacao = (solicitacaoId) => {
  return apiClient.put(`/biblioteca/solicitacoes/${solicitacaoId}/aprovar`);
};

export const rejeitarSolicitacao = (solicitacaoId) => {
  return apiClient.put(`/biblioteca/solicitacoes/${solicitacaoId}/rejeitar`);
};
/**
 * Busca dados de um livro na Google Books API usando o ISBN.
 * @param {string} isbn - O ISBN do livro.
 * @returns {Promise<object>} Um objeto com os dados do livro encontrados.
 */
export const searchBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );

    if (response.data.totalItems > 0) {
      const bookData = response.data.items[0].volumeInfo;
      return {
        titulo: bookData.title || "",
        autores: bookData.authors ? bookData.authors.join(", ") : "",
        editora: bookData.publisher || "",
        anoPublicacao: bookData.publishedDate
          ? bookData.publishedDate.substring(0, 4)
          : "",
        descricao: bookData.description || "",
        // ATUALIZADO: Extrai a URL da capa do livro.
        capaUrl: bookData.imageLinks?.thumbnail || null,
      };
    } else {
      throw new Error("Nenhum livro encontrado para este ISBN.");
    }
  } catch (error) {
    console.error("Erro ao buscar dados do livro:", error);
    throw new Error(
      "Falha ao comunicar com a API de livros. Verifique o ISBN e a sua ligação."
    );
  }
};

// --- Funções de validação (se existirem, devem ser movidas para um arquivo de validação) ---
// Exemplo:
// export const validateLivro = (livro) => { ... };
// export const validateEmprestimo = (emprestimo) => { ... };
