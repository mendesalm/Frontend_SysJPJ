// src/services/memberService.js
import apiClient from "./apiClient";

// --- Funções para o próprio utilizador ---

export const getMyProfile = () => {
  return apiClient.get("/lodgemembers/me");
};

export const updateMyProfile = (profileData) => {
  return apiClient.put("/lodgemembers/me", profileData);
};

// --- Funções para Administradores ---

// ANTES:
// export const getAllMembers = () => {
//   return apiClient.get("/lodgemembers");
// };

// DEPOIS: A função agora aceita um objeto de parâmetros
export const getAllMembers = (params) => {
  // `params` pode ser, por exemplo, { page: 1, limit: 10, search: 'Fulano' }
  return apiClient.get("/lodgemembers", { params });
};

// --- NOVA FUNÇÃO ADICIONADA ---
// Busca os dados de um membro específico pelo ID.
export const getMemberById = (id) => {
  return apiClient.get(`/lodgemembers/${id}`);
};

export const createMember = (memberData) => {
  return apiClient.post("/lodgemembers", memberData);
};

export const updateMember = (id, memberData) => {
  return apiClient.put(`/lodgemembers/${id}`, memberData);
};
