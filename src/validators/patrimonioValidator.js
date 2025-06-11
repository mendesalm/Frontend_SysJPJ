import * as yup from "yup";

export const patrimonioValidationSchema = yup.object().shape({
  nome: yup
    .string()
    .required("O nome do item é obrigatório.")
    .min(3, "O nome deve ter pelo menos 3 caracteres."),

  descricao: yup.string(),

  dataAquisicao: yup
    .date()
    .required("A data de aquisição é obrigatória.")
    .max(new Date(), "A data de aquisição não pode ser no futuro.")
    .typeError("Forneça uma data válida."),

  valorAquisicao: yup
    .number()
    .typeError("O valor deve ser um número válido.")
    .required("O valor de aquisição é obrigatório.")
    .positive("O valor deve ser um número positivo."),

  estadoConservacao: yup
    .string()
    .required("O estado de conservação é obrigatório."),

  localizacao: yup.string(),
});
