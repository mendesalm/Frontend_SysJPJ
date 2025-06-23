import * as yup from "yup";
import { SITUACAO_MEMBRO } from "../constants/userConstants"; // Importa a nova constante

// Esquema para um familiar individual, padronizado para camelCase
const familiarSchema = yup.object().shape({
  nomeCompleto: yup.string().required("O nome do familiar é obrigatório."),
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
    .typeError("Forneça uma data válida para o familiar (DD/MM/AAAA)."),
  // NOVO: Adicionado campo para status de falecimento.
  falecido: yup.boolean().default(false),
});

// Esquema principal para o formulário de membros com mensagens e transformações melhoradas
export const memberValidationSchema = yup.object().shape({
  // --- Acesso ---
  Email: yup
    .string()
    .email("Por favor, insira um formato de email válido (ex: nome@email.com).")
    .required("O email é obrigatório."),

  SenhaHash: yup.string().when("$isCreating", (isCreating, schema) => {
    return isCreating
      ? schema
          .required("A senha inicial é obrigatória.")
          .min(8, "A senha deve ter no mínimo 8 caracteres.")
      : schema.nullable();
  }),
  credencialAcesso: yup
    .string()
    .oneOf(["Webmaster", "Diretoria", "Membro"])
    .required(),
  statusCadastro: yup
    .string()
    .oneOf(["Pendente", "Aprovado", "Rejeitado"])
    .required(),

  // --- Dados Pessoais ---
  NomeCompleto: yup
    .string()
    .required("O nome completo é obrigatório.")
    .min(3, "O nome deve ter pelo menos 3 caracteres."),

  CPF: yup
    .string()
    .transform((value) => (value ? value.replace(/[^\d]/g, "") : ""))
    .required("O CPF é obrigatório.")
    .matches(
      /^\d{11}$/,
      "O CPF deve conter exatamente 11 dígitos (apenas números)."
    ),

  Identidade: yup.string().nullable(),

  DataNascimento: yup
    .date()
    .required("A data de nascimento é obrigatória.")
    .max(new Date(), "A data não pode ser no futuro.")
    .typeError("Forneça uma data válida (DD/MM/AAAA)."),

  Telefone: yup
    .string()
    .transform((value) => (value ? value.replace(/[^\d]/g, "") : ""))
    .nullable(),

  DataCasamento: yup
    .date()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .max(new Date(), "A data de casamento não pode ser no futuro.")
    .typeError("Forneça uma data válida (DD/MM/AAAA)."),

  // --- Endereço ---
  Endereco_CEP: yup
    .string()
    .transform((value) => (value ? value.replace(/[^\d]/g, "") : null))
    .nullable()
    .matches(
      /^\d{8}$/,
      "O CEP deve ter 8 dígitos (apenas números), se informado."
    ),

  // --- Dados Maçónicos ---
  // NOVO: Adicionada validação para o campo de Situação
  Situacao: yup
    .string()
    .oneOf(SITUACAO_MEMBRO, "Situação inválida.")
    .required("A situação do membro é obrigatória."),

  DataIniciacao: yup
    .date()
    .required("A data de iniciação é obrigatória.")
    .max(new Date(), "A data de iniciação não pode ser no futuro.")
    .typeError("Forneça uma data válida (DD/MM/AAAA)."),

  DataElevacao: yup
    .date()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .typeError("Forneça uma data válida (DD/MM/AAAA).")
    .min(
      yup.ref("DataIniciacao"),
      "A data de elevação deve ser posterior à de iniciação."
    ),

  DataExaltacao: yup
    .date()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .typeError("Forneça uma data válida (DD/MM/AAAA).")
    .min(
      yup.ref("DataElevacao"),
      "A data de exaltação deve ser posterior à de elevação."
    ),

  DataFiliacao: yup
    .date()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .typeError("Forneça uma data válida (DD/MM/AAAA)."),
  DataRegularizacao: yup
    .date()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .typeError("Forneça uma data válida (DD/MM/AAAA)."),

  // --- Validação para o array de familiares ---
  familiares: yup.array().of(familiarSchema),
});
