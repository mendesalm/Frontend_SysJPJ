import * as yup from "yup";

export const comissaoValidationSchema = yup.object().shape({
  nome: yup
    .string()
    .required("O nome da comissão é obrigatório.")
    .min(5, "O nome deve ter pelo menos 5 caracteres."),

  descricao: yup.string(),

  tipo: yup.string().required("O tipo da comissão é obrigatório."),

  dataInicio: yup
    .date()
    .required("A data de início é obrigatória.")
    .typeError("Forneça uma data válida."),

  dataFim: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    // Garante que a data final seja posterior à data inicial
    .min(
      yup.ref("dataInicio"),
      "A data final não pode ser anterior à data de início."
    ),

  membrosIds: yup
    .array()
    .of(yup.number())
    .min(3, "A comissão deve ter no mínimo 3 membros.")
    .required("É obrigatório selecionar os membros."),
});
