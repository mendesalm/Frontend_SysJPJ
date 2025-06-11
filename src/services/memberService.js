import apiClient from "./apiClient";

// --- Funções para o próprio utilizador ---

export const getMyProfile = () => {
  return apiClient.get("/lodgemembers/me");
};

export const updateMyProfile = (profileData) => {
  return apiClient.put("/lodgemembers/me", profileData);
};

// --- Funções para Administradores ---

export const getAllMembers = () => {
  return apiClient.get("/lodgemembers");
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
