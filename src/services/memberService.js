import apiClient from './apiClient';

// Busca todos os membros
export const getAllMembers = () => {
  return apiClient.get('/lodgemembers');
};

// Busca um membro específico por ID
export const getMemberById = (id) => {
  return apiClient.get(`/lodgemembers/${id}`);
};

// Atualiza os dados de um membro
// A `memberData` pode conter qualquer campo que o backend permita atualizar
export const updateMember = (id, memberData) => {
  return apiClient.put(`/lodgemembers/${id}`, memberData);
};

// Apaga um membro
export const deleteMember = (id) => {
  return apiClient.delete(`/lodgemembers/${id}`);
};

// Atualiza o perfil do próprio utilizador logado
export const updateMyProfile = (profileData) => {
  return apiClient.put('/lodgemembers/me', profileData);
};