import apiClient from "./apiClient";

export const getBalaustre = async (id) => {
  const response = await apiClient.get(`/balaustres/${id}`);
  return response.data;
};

export const updateBalaustre = async (id, data) => {
  const response = await apiClient.put(`/balaustres/${id}`, data);
  return response.data;
};

export const setNextBalaustreNumber = async (nextNumber) => {
  const response = await apiClient.post("/balaustres/settings/next-number", {
    nextNumber,
  });
  return response.data;
};

/**
 * Aprova um balaústre, registando a assinatura do cargo especificado.
 * Endpoint: PATCH /api/balaustres/:id/aprovar
 * @param {string} id - O ID do balaústre.
 * @param {string} cargo - O cargo do assinante (ex: 'Secretário', 'Orador').
 */
export const aprovarBalaustre = async (id, cargo) => {
  const response = await apiClient.patch(`/balaustres/${id}/aprovar`, { cargo });
  return response.data;
};

/**
 * Aprova um balaústre manualmente, sem assinaturas eletrônicas (bypass).
 * Endpoint: PATCH /api/balaustres/:id/aprovar-manualmente
 * @param {string} id - O ID do balaústre.
 */
export const aprovarManualmente = async (id) => {
  const response = await apiClient.patch(`/balaustres/${id}/aprovar-manualmente`);
  return response.data;
};

/**
 * Substitui o PDF da minuta do balaústre por um novo arquivo.
 * Endpoint: POST /api/balaustres/:id/substituir-minuta
 * @param {string} id - O ID do balaústre.
 * @param {File} pdfFile - O arquivo PDF a ser enviado.
 */
export const substituirMinuta = async (id, pdfFile) => {
  const formData = new FormData();
  formData.append("balaustrePdf", pdfFile);

  const response = await apiClient.post(
    `/balaustres/${id}/substituir-minuta`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
