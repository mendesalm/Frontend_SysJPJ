import apiClient from './apiClient';

// Busca todas as sessões
export const getSessions = () => {
  return apiClient.get('/sessions');
};

// Busca uma sessão específica por ID
export const getSessionById = (id) => {
  return apiClient.get(`/sessions/${id}`);
};

// Cria uma nova sessão.
// O backend espera dados de formulário multipart/form-data por causa do upload da ata.
export const createSession = (formData) => {
  return apiClient.post('/sessions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Atualiza uma sessão existente
export const updateSession = (id, formData) => {
    return apiClient.put(`/sessions/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Apaga uma sessão
export const deleteSession = (id) => {
  return apiClient.delete(`/sessions/${id}`);
};
