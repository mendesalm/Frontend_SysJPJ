// src/validators/visitacaoValidator.js
import * as yup from "yup";

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
  lodgeMemberId: yup
    .number()
    .required("É obrigatório selecionar um membro.")
    .typeError("Seleção de membro inválida."),

  dataSessao: yup
    .date()
    .required("A data da visita é obrigatória.")
    .max(new Date(), "A data da visita não pode ser no futuro.")
    .typeError("Forneça uma data válida."),

  tipoSessao: yup
    .string()
    .oneOf(TIPO_SESSAO_OPTIONS, "Tipo de sessão inválido.")
    .required("O tipo de sessão é obrigatório."),

  dadosLoja: yup
    .object()
    .shape({
      nome: yup.string().required("O nome da loja é obrigatório."),
      // ATUALIZADO: O número agora é obrigatório.
      numero: yup
        .number()
        .required("O número da loja é obrigatório.")
        .typeError("O número da loja deve ser um valor numérico.")
        .nullable(),
      cidade: yup.string().required("A cidade da loja é obrigatória."),
      estado: yup.string().required("O estado da loja é obrigatório."),
      potencia: yup.string().required("A potência da loja é obrigatória."),
    })
    .required(),

  dataEntrega: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Forneça uma data válida."),
});
