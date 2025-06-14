import apiClient from "./apiClient";

export const getPublicacoes = (params) => {
  return apiClient.get("/publicacoes", { params });
};

export const createPublicacao = (formData) => {
  return apiClient.post("/publicacoes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deletePublicacao = (id) => {
  return apiClient.delete(`/publicacoes/${id}`);
};
