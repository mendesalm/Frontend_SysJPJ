// src/validators/memberValidator.js
import * as yup from "yup";

// --- INÍCIO DA MUDANÇA ---
// Esquema para um familiar individual
const familiarSchema = yup.object().shape({
  // ANTES: nomeCompleto: yup.string().required("O nome do familiar é obrigatório."),
  Nome: yup.string().required("O nome do familiar é obrigatório."), // DEPOIS

  // ANTES: parentesco: yup.string()...
  Parentesco: yup // DEPOIS
    .string()
    .oneOf(
      ["Cônjuge", "Esposa", "Filho", "Filha"],
      "O parentesco selecionado é inválido."
    )
    .required("O parentesco é obrigatório."),

  // ANTES: dataNascimento: yup.date()...
  DataNascimento: yup // DEPOIS
    .date()
    .required("A data de nascimento do familiar é obrigatória.")
    .max(new Date(), "A data de nascimento não pode ser no futuro.")
    .typeError("Forneça uma data válida para o familiar (DD/MM/AAAA)."),
});
// --- FIM DA MUDANÇA ---

// Esquema principal para o formulário de membros com mensagens e transformações melhoradas
export const memberValidationSchema = yup.object().shape({
  // ... O resto do arquivo permanece exatamente igual ...
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

  // --- Dados Maçônicos ---
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
