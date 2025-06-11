/**
 * src/services/cepService.js
 * Serviço para consultar um CEP na API pública ViaCEP.
 */

/**
 * Consulta um CEP e retorna os dados de endereço.
 * @param {string} cep - O CEP a ser consultado, contendo apenas os 8 dígitos.
 * @returns {Promise<object>} Os dados do endereço ou um objeto de erro.
 */
export const consultarCEP = async (cep) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    if (!response.ok) {
      throw new Error("Erro na resposta da API de CEP.");
    }

    const data = await response.json();

    if (data.erro) {
      throw new Error("CEP não encontrado.");
    }

    return data;
  } catch (error) {
    console.error("Erro ao consultar o CEP:", error);
    // Propaga o erro para que o componente possa lidar com ele.
    throw error;
  }
};
