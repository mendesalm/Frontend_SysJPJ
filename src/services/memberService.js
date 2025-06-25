// src/services/memberService.js
import apiClient from "./apiClient";

export const getAllMembers = (params) => {
  return apiClient.get("/lodgemembers", { params });
};

export const getMemberById = (id) => {
  return apiClient.get(`/lodgemembers/${id}`);
};

// ATUALIZADO: Espera FormData e envia com o cabeçalho correto.
export const createMember = (formData) => {
  return apiClient.post("/lodgemembers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateMember = (id, formData) => {
  return apiClient.put(`/lodgemembers/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCargosMembro = (memberId) => {
  return apiClient.get(`/lodgemembers/${memberId}/cargos`);
};

export const addCargoMembro = (memberId, data) => {
  return apiClient.post(`/lodgemembers/${memberId}/cargos`, data);
};

export const updateCargoMembro = (memberId, cargoId, data) => {
  return apiClient.put(`/lodgemembers/${memberId}/cargos/${cargoId}`, data);
};

export const deleteCargoMembro = (memberId, cargoId) => {
  return apiClient.delete(`/lodgemembers/${memberId}/cargos/${cargoId}`);
};
