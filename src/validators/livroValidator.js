import * as yup from "yup";

export const livroValidationSchema = yup.object().shape({
  titulo: yup
    .string()
    .required("O título do livro é obrigatório.")
    .min(3, "O título deve ter pelo menos 3 caracteres."),

  autores: yup.string().required("O nome do(s) autor(es) é obrigatório."),

  editora: yup.string(),

  anoPublicacao: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("O ano de publicação deve ser um número.")
    .integer("O ano deve ser um número inteiro.")
    .min(1500, "O ano de publicação parece muito antigo.")
    .max(
      new Date().getFullYear(),
      "O ano de publicação não pode ser no futuro."
    ),

  ISBN: yup.string(),

  numeroPaginas: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("O número de páginas deve ser um número.")
    .integer("O número de páginas deve ser um inteiro.")
    .positive("O número de páginas deve ser positivo."),

  classificacao: yup.string(),
  observacoes: yup.string(),
});
