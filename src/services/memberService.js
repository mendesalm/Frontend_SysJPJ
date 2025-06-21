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
// ---FUNÇÕES PARA HISTÓRICO DE CARGOS ---

/**
 * Busca o histórico de cargos de um membro.
 * @param {number} memberId - O ID do membro.
 */
export const getCargosMembro = (memberId) => {
  return apiClient.get(`/lodgemembers/${memberId}/cargos`);
};

/**
 * Adiciona um novo cargo (atual ou anterior) para um membro.
 * @param {number} memberId - O ID do membro.
 * @param {object} cargoData - Dados do cargo, como nomeCargo, dataInicio e opcionalmente dataTermino.
 */
export const addCargoMembro = (memberId, cargoData) => {
  return apiClient.post(`/lodgemembers/${memberId}/cargos`, cargoData);
};

/**
 * Atualiza um cargo existente (ex: para adicionar uma data de término).
 * @param {number} memberId - O ID do membro.
 * @param {number} cargoId - O ID do registro do cargo exercido.
 * @param {object} cargoData - Dados a serem atualizados, ex: { dataTermino: 'YYYY-MM-DD' }.
 */
export const updateCargoMembro = (memberId, cargoId, cargoData) => {
  return apiClient.put(
    `/lodgemembers/${memberId}/cargos/${cargoId}`,
    cargoData
  );
};

/**
 * Remove um registro de cargo do histórico de um membro.
 * @param {number} memberId - O ID do membro.
 * @param {number} cargoId - O ID do registro do cargo a ser removido.
 */
export const deleteCargoMembro = (memberId, cargoId) => {
  return apiClient.delete(`/lodgemembers/${memberId}/cargos/${cargoId}`);
};
