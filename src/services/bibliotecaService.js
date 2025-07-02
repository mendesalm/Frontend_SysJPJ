import apiClient from "./apiClient";
import axios from "axios"; // Importa o axios diretamente para chamadas externas

// --- Funções existentes ---
export const getLivros = () => {
  return apiClient.get("/biblioteca/livros");
};

export const getEmprestimos = () => {
  return apiClient.get("/biblioteca/emprestimos");
};

export const createLivro = (data) => {
  return apiClient.post("/biblioteca/livros", data);
};

export const updateLivro = (id, data) => {
  return apiClient.put(`/biblioteca/livros/${id}`, data);
};

export const deleteLivro = (id) => {
  return apiClient.delete(`/biblioteca/livros/${id}`);
};

export const createEmprestimo = (data) => {
  return apiClient.post("/biblioteca/emprestimos", data);
};

export const devolverLivro = (emprestimoId) => {
  return apiClient.put(`/biblioteca/emprestimos/${emprestimoId}/devolver`);
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
        autor: bookData.authors ? bookData.authors.join(", ") : "",
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
