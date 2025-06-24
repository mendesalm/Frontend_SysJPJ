// src/validators/locacaoValidator.js
import * as yup from "yup";

export const locacaoValidationSchema = yup.object().shape({
  dataInicio: yup
    .date()
    .required("A data e hora de início são obrigatórias.")
    .min(new Date(), "A data de início não pode ser no passado.")
    .typeError("Forneça uma data e hora de início válidas."),
  dataFim: yup
    .date()
    .required("A data e hora de término são obrigatórias.")
    .min(
      yup.ref("dataInicio"),
      "A data de término deve ser posterior à data de início."
    )
    .typeError("Forneça uma data e hora de término válidas."),
  finalidade: yup
    .string()
    .required("A finalidade da locação é obrigatória.")
    .min(10, "A finalidade deve ter pelo menos 10 caracteres."),
  tipoLocatario: yup.string().oneOf(["membro", "externo"]).required(),
  lodgeMemberId: yup.number().when("tipoLocatario", {
    is: "membro",
    then: (schema) =>
      schema
        .required("É obrigatório selecionar um membro.")
        .typeError("Selecione um membro válido."),
    otherwise: (schema) => schema.nullable(),
  }),
  nomeLocatarioExterno: yup.string().when("tipoLocatario", {
    is: "externo",
    then: (schema) =>
      schema.required("O nome do locatário externo é obrigatório."),
    otherwise: (schema) => schema.nullable(),
  }),
  contatoLocatarioExterno: yup.string().when("tipoLocatario", {
    is: "externo",
    then: (schema) =>
      schema.required("O contato do locatário externo é obrigatório."),
    otherwise: (schema) => schema.nullable(),
  }),
  ehNaoOneroso: yup.boolean(),
  valor: yup.number().when("ehNaoOneroso", {
    is: false,
    then: (schema) =>
      schema
        .required("O valor é obrigatório para locações onerosas.")
        .min(0, "O valor não pode ser negativo.")
        .typeError("Forneça um valor numérico."),
    otherwise: (schema) => schema.nullable().transform(() => null),
  }),
});
