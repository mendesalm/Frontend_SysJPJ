import * as yup from "yup";

export const livroSchema = yup.object().shape({
  titulo: yup.string().required("O título é obrigatório."),
  autor: yup.string().required("O autor é obrigatório."),
  editora: yup.string(),
  anoPublicacao: yup
    .number()
    .typeError("O ano deve ser um número.")
    .integer("O ano deve ser um número inteiro.")
    .min(1000, "Ano inválido.")
    .max(new Date().getFullYear(), "O ano não pode ser no futuro.")
    .nullable(),
  descricao: yup.string(),
  // NOVO: Campo ISBN adicionado como opcional.
  isbn: yup.string().trim().optional(),
});

export const emprestimoSchema = yup.object().shape({
  livroId: yup.number().required("É necessário selecionar um livro."),
  membroId: yup.number().required("É necessário selecionar um membro."),
  dataEmprestimo: yup.date().required("A data de empréstimo é obrigatória."),
});
