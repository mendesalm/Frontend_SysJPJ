import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDateForInput = (date) => {
  if (!date) return "";
  return format(new Date(date), "yyyy-MM-dd'T'HH:mm");
};

export const formatFullDate = (date) => {
  if (!date) return "Data não informada";
  return format(new Date(date), "EEEE, dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
};
