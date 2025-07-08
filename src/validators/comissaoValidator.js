import * as yup from "yup";

export const comissaoValidationSchema = yup.object().shape({
  nome: yup
    .string()
    .required("O nome da comissão é obrigatório.")
    .min(5, "O nome deve ter pelo menos 5 caracteres."),

  descricao: yup.string().optional(),

  tipo: yup
    .string()
    .oneOf(
      ["Permanente", "Temporária"],
      "O tipo deve ser Permanente ou Temporária."
    )
    .required("O tipo da comissão é obrigatório."),

  dataInicio: yup
    .date()
    .required("A data de início é obrigatória.")
    .typeError("Forneça uma data de início válida."),

  dataFim: yup
    .date()
    .required("A data de término é obrigatória.")
    .typeError("Forneça uma data de término válida.")
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
