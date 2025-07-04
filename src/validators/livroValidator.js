import * as yup from "yup";

export const livroSchema = yup.object().shape({
  titulo: yup.string().required("O título é obrigatório."),
  autores: yup.string().required("O(s) autor(es) é/são obrigatório(s)."),
  editora: yup.string(),
  anoPublicacao: yup
    .number()
    .typeError("O ano deve ser um número.")
    .integer("O ano deve ser um número inteiro.")
    .min(1000, "Ano inválido.")
    .max(new Date().getFullYear(), "O ano não pode ser no futuro.")
    .nullable(),
  descricao: yup.string(),
  numeroPaginas: yup
    .number()
    .typeError("O número de páginas deve ser um número.")
    .integer("O número de páginas deve ser um número inteiro.")
    .min(1, "O número de páginas deve ser maior que zero.")
    .nullable(),
  classificacao: yup
    .string()
    .oneOf(
      ["Aprendiz", "Companheiro", "Mestre", null], // Inclui null para permitir que seja opcional
      "A classificação deve ser Aprendiz, Companheiro ou Mestre."
    )
    .nullable(), // Permite que o campo seja nulo ou vazio
  // NOVO: Campo ISBN adicionado como opcional.
  isbn: yup.string().trim().optional(),
});

export const emprestimoSchema = yup.object().shape({
  livroId: yup.number().required("É necessário selecionar um livro."),
  membroId: yup.number().required("É necessário selecionar um membro."),
  dataEmprestimo: yup.date().required("A data de empréstimo é obrigatória."),
});
