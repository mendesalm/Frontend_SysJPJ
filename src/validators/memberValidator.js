import * as yup from "yup";

// Esquema para um familiar individual
const familiarSchema = yup.object().shape({
  nomeCompleto: yup.string().required("O nome do familiar é obrigatório."),

  // CORREÇÃO: Atualiza os valores permitidos para o campo 'parentesco'.
  parentesco: yup
    .string()
    .oneOf(
      ["Cônjuge", "Esposa", "Filho", "Filha"],
      "O parentesco selecionado é inválido."
    )
    .required("O parentesco é obrigatório."),

  dataNascimento: yup
    .date()
    .required("A data de nascimento do familiar é obrigatória.")
    .max(new Date(), "A data de nascimento não pode ser no futuro.")
    .typeError("Forneça uma data válida para o familiar."),
});

// Esquema principal para o formulário de membros
export const memberValidationSchema = yup.object().shape({
  // ... (outras regras de validação para o membro) ...

  familiares: yup.array().of(familiarSchema),
});
