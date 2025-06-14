// src/validators/visitacaoValidator.js
import * as yup from "yup";

// Lista de tipos de sessão para consistência
export const TIPO_SESSAO_OPTIONS = [
  "Ordinária no Grau de Aprendiz",
  "Ordinária no Grau de Companheiro",
  "Ordinária no Grau de Mestre",
  "Magna de Iniciação",
  "Magna de Elevação",
  "Magna de Exaltação",
  "Magna Pública",
  "Magna Grau 1",
  "Magna Grau 2",
  "Magna Grau 3",
];

export const visitacaoValidationSchema = yup.object().shape({
  membroId: yup
    .number()
    .required("É obrigatório selecionar um membro.")
    .typeError("Seleção de membro inválida."),

  dataVisita: yup
    .date()
    .required("A data da visita é obrigatória.")
    .max(new Date(), "A data da visita não pode ser no futuro.")
    .typeError("Forneça uma data válida."),

  nomeLojaVisitada: yup
    .string()
    .required("O nome da loja visitada é obrigatório.")
    .min(3, "O nome da loja deve ter pelo menos 3 caracteres."),

  potenciaLojaVisitada: yup.string(),

  orienteLojaVisitada: yup.string(),

  tipoSessao: yup
    .string()
    .oneOf(TIPO_SESSAO_OPTIONS, "Tipo de sessão inválido.")
    .required("O tipo de sessão é obrigatório."),
});
