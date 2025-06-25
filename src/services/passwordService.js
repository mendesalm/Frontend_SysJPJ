// src/services/passwordService.js
import apiClient from "./apiClient";

/**
 * Permite que o utilizador logado altere a sua própria senha.
 * @param {object} data - Contém a senha antiga e a nova senha. Ex: { senhaAntiga, novaSenha }
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateUserPassword = (data) => {
  return apiClient.put("/lodgemembers/me/password", data);
};

/**
 * Permite que um administrador redefina a senha de qualquer membro.
 * @param {number} memberId - O ID do membro.
 * @param {object} data - Contém a nova senha. Ex: { novaSenha }
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const adminResetUserPassword = (memberId, data) => {
  return apiClient.put(`/lodgemembers/${memberId}/admin-password-reset`, data);
};
