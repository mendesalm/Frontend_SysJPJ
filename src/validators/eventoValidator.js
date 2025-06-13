import * as yup from "yup";

export const eventoValidationSchema = yup.object().shape({
  titulo: yup
    .string()
    .required("O título do evento é obrigatório.")
    .min(5, "O título deve ter pelo menos 5 caracteres."),

  descricao: yup
    .string()
    .required("A descrição é obrigatória.")
    .min(10, "A descrição deve ter pelo menos 10 caracteres."),

  local: yup.string().required("O local do evento é obrigatório."),

  tipo: yup
    .string()
    .required("O tipo de evento é obrigatório.")
    .oneOf(
      ["Sessão Maçônica", "Evento Social", "Evento Filantrópico", "Outro"],
      "Tipo de evento inválido."
    ),

  dataHoraInicio: yup
    .date()
    .required("A data e hora de início são obrigatórias.")
    .min(new Date(), "A data de início não pode ser no passado.")
    .typeError("Forneça uma data e hora válidas."),

  dataHoraFim: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(
      yup.ref("dataHoraInicio"),
      "A data final deve ser posterior à data de início."
    )
    .typeError("Forneça uma data e hora válidas."),
});
