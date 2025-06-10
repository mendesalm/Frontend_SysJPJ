/**
 * src/services/permissionService.js
 *
 * Este serviço lida com todas as chamadas de API para o endpoint de
 * gerenciamento de permissões de funcionalidades.
 */
import apiClient from './apiClient';

/**
 * Busca todas as configurações de permissão de funcionalidades.
 * A rota do backend já é protegida e só retorna dados para um Webmaster.
 * @returns {Promise<axios.AxiosResponse<any>>} A promessa com a resposta da API.
 */
export const getPermissoes = () => {
  return apiClient.get('/permissoes');
};

/**
 * Atualiza (ou cria) a configuração de permissão para uma funcionalidade específica.
 * @param {object} permissaoData - O objeto de permissão a ser salvo.
 * Ex: {
 * nomeFuncionalidade: 'GerirPatrimonio',
 * descricao: 'Acesso à página de patrimônio',
 * credenciaisPermitidas: ['Diretoria', 'Webmaster']
 * }
 * @returns {Promise<axios.AxiosResponse<any>>} A promessa com a resposta da API.
 */
export const updatePermissao = (permissaoData) => {
  // A rota do backend usa PUT para criar ou atualizar (upsert).
  return apiClient.put('/permissoes', permissaoData);
};

export const deletePermissao = (permissaoData) => {
  // A rota do backend usa DELETE para deletar uma permissão.
  return apiClient.delete('/permissoes', permissaoData);
};