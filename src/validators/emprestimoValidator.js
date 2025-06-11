import * as yup from "yup";

export const emprestimoValidationSchema = yup.object().shape({
  membroId: yup
    .number()
    .required("É obrigatório selecionar um membro.")
    .typeError("Seleção de membro inválida."),

  dataDevolucaoPrevista: yup
    .date()
    .required("A data de devolução prevista é obrigatória.")
    .min(
      new Date(Date.now() + 86400000),
      "A data de devolução deve ser no futuro."
    ) // Pelo menos amanhã
    .typeError("Forneça uma data válida."),

  // O livroId não precisa de ser validado aqui, pois já vem do contexto da página.
});
