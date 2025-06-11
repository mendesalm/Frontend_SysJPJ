import * as yup from "yup";

export const avisoValidationSchema = yup.object().shape({
  titulo: yup
    .string()
    .required("O título é obrigatório.")
    .min(5, "O título deve ter no mínimo 5 caracteres."),
  conteudo: yup
    .string()
    .required("O conteúdo é obrigatório.")
    .min(10, "O conteúdo deve ter no mínimo 10 caracteres."),
  dataExpiracao: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(new Date(), "A data de expiração não pode ser no passado."),
  fixado: yup.boolean(),
});
