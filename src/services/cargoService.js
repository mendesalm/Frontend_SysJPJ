/**
 * src/services/cargoService.js
 *
 * Serviço para obter a lista de todos os cargos disponíveis no sistema.
 */
//import apiClient from './apiClient';

/**
 * Busca todos os cargos disponíveis no sistema.
 *
 * CORREÇÃO: Como não há um endpoint no backend para buscar a lista de cargos,
 * e essa lista está definida estaticamente no modelo 'CargoExercido',
 * estamos a replicar essa lista aqui. Isso evita uma chamada de API desnecessária
 * e resolve o erro que estava a ocorrer.
 *
 * @returns {Promise<object>} Uma promessa que resolve com um objeto no formato { data: [...] },
 * simulando uma resposta de API bem-sucedida.
 */
export const getAllCargos = () => {
  const cargosDisponiveis = [
    "Venerável Mestre", "Primeiro Vigilante", "Segundo Vigilante", "Orador", "Orador Adjunto",
    "Secretário", "Secretário Adjunto", "Chanceler", "Chanceler Adjunto", "Tesoureiro", "Tesoureiro Adjunto",
    "Mestre de Cerimônias", "Mestre de Harmonia", "Mestre de Harmonia Adjunto",
    "Arquiteto", "Arquiteto Adjunto", "Bibliotecário", "Bibliotecário Adjunto",
    "Primeiro Diácono", "Segundo Diácono", "Primeiro Experto", "Segundo Experto",
    "Cobridor Interno", "Cobridor Externo", "Hospitaleiro", "Porta Bandeira",
    "Porta Estandarte", "Deputado Estadual", "Deputado Federal", "Sem cargo definido"
  ];

  // Para manter a consistência com a forma como o `axios` retorna os dados,
  // envolvemos o nosso array num objeto { data: ... } e numa Promessa.
  const response = {
    data: cargosDisponiveis.map(nome => ({ NomeCargo: nome }))
  };
  
  return Promise.resolve(response);
};
