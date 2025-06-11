import * as yup from "yup";

// Esquema de validação para o formulário de Contas (Plano de Contas)
export const contaValidationSchema = yup.object().shape({
  nome: yup
    .string()
    .required("O nome da conta é obrigatório.")
    .min(3, "O nome da conta deve ter pelo menos 3 caracteres."),

  tipo: yup
    .string()
    .required("O tipo da conta (Receita ou Despesa) é obrigatório.")
    .oneOf(["Receita", "Despesa"], "O tipo deve ser Receita ou Despesa."),

  descricao: yup.string(),
});

// Esquema de validação para o formulário de Lançamentos
export const lancamentoValidationSchema = yup.object().shape({
  descricao: yup
    .string()
    .required("A descrição do lançamento é obrigatória.")
    .min(5, "A descrição deve ter pelo menos 5 caracteres."),

  valor: yup
    .number()
    .typeError("O valor deve ser um número.")
    .required("O valor é obrigatório.")
    .positive("O valor deve ser um número positivo."),

  dataLancamento: yup
    .date()
    .required("A data do lançamento é obrigatória.")
    .typeError("Forneça uma data válida."),

  contaId: yup
    .number()
    .required("É obrigatório selecionar uma conta.")
    .typeError("A conta selecionada é inválida."),
});
