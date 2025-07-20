/**
 * Formata uma data para um formato compatível com inputs do tipo 'datetime-local'.
 * Esta versão é robusta e consciente do fuso horário.
 * Exemplo: '2025-07-20T19:30'
 * @param {Date | string} date - A data (geralmente uma string ISO UTC do backend).
 * @returns {string} A data formatada para o fuso horário de São Paulo.
 */
export const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  // Usa a API Intl.DateTimeFormat para obter as partes da data no fuso horário correto.
  // O locale 'sv-SE' (Suécia) é um truque para obter o formato YYYY-MM-DD.
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  };

  const formatter = new Intl.DateTimeFormat("sv-SE", options);
  const parts = formatter.formatToParts(d);

  // Constrói um mapa para aceder facilmente às partes da data
  const dateMap = new Map(parts.map((p) => [p.type, p.value]));

  // Retorna a string no formato que o input 'datetime-local' espera
  return `${dateMap.get("year")}-${dateMap.get("month")}-${dateMap.get(
    "day"
  )}T${dateMap.get("hour")}:${dateMap.get("minute")}`;
};

/**
 * Formata uma data para uma exibição completa e legível em português.
 * Exemplo: 'Terça-feira, 20 de julho de 2025, 19:30'
 * @param {Date | string} date - A data a ser formatada.
 * @returns {string} A data formatada por extenso no fuso horário de São Paulo.
 */
export const formatFullDate = (date) => {
  if (!date) return "Data não informada";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Data inválida";

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo", // Garante a conversão para o fuso horário correto
  };

  let formattedDate = new Intl.DateTimeFormat("pt-BR", options).format(d);

  // Capitaliza o dia da semana
  formattedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return formattedDate;
};
