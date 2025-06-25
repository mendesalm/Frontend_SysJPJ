// src/utils/dateUtils.js

/**
 * Formata uma data (string ISO ou objeto Date) para o formato 'AAAA-MM-DD',
 * corrigindo o problema de fuso horário para uso em inputs <input type="date">.
 * @param {string | Date | null} dateInput - A data a ser formatada.
 * @returns {string} A data formatada como 'AAAA-MM-DD' ou uma string vazia.
 */
export const formatDateForInput = (dateInput) => {
  if (!dateInput) {
    return "";
  }

  // Cria um objeto Date, que interpreta a string ISO em UTC
  const date = new Date(dateInput);

  // Pega o fuso horário do navegador em minutos
  const timezoneOffset = date.getTimezoneOffset();

  // Cria um novo objeto Date ajustado pelo fuso horário.
  // Isso efetivamente "move" a data para a meia-noite do fuso horário local.
  const adjustedDate = new Date(date.getTime() + timezoneOffset * 60 * 1000);

  // Converte para uma string no formato 'AAAA-MM-DD'
  const year = adjustedDate.getFullYear();
  const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
  const day = String(adjustedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
