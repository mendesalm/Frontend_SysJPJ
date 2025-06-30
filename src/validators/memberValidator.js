import * as yup from "yup";
import { SITUACAO_MEMBRO } from "../constants/userConstants";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_PHOTO_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const condecoracaoSchema = yup.object().shape({
  titulo: yup.string().nullable(),
  dataRecebimento: yup.date().nullable().transform((curr, orig) => orig === '' ? null : curr).typeError('Forneça uma data válida se preenchida.'),
  observacoes: yup.string().nullable(),
});;

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
  falecido: yup.boolean().default(false),
});

export const memberValidationSchema = yup.object().shape({
  Email: yup
    .string()
    .email("Por favor, insira um formato de email válido (ex: nome@email.com).")
    .required("O email é obrigatório."),

  // Validação para o novo campo de foto
  FotoPessoal: yup
    .mixed()
    .test("fileSize", "A foto não pode exceder 5MB.", (value) => {
      if (!value || value.length === 0) return true; // Permite o campo vazio (opcional)
      return value[0].size <= MAX_PHOTO_SIZE;
    })
    .test("fileType", "Formato de foto não suportado.", (value) => {
      if (!value || value.length === 0) return true;
      return SUPPORTED_PHOTO_FORMATS.includes(value[0].type);
    }),

  NomeCompleto: yup
    .string()
    .required("O nome completo é obrigatório.")
    .min(3, "O nome deve ter pelo menos 3 caracteres."),

  CPF: yup
    .string()
    .transform((value) => (value ? value.replace(/[^\d]/g, "") : value))
    .test(
      "len",
      "Se informado, o CPF deve conter exatamente 11 dígitos.",
      (val) => !val || val.length === 11
    )
    .nullable(),

  // ... (resto do esquema de validação)
  familiares: yup.array().of(familiarSchema),
  condecoracoes: yup.array().of(condecoracaoSchema),

  SenhaHash: yup.string().when("$isCreating", {
    is: true,
    then: (schema) =>
      schema
        .required("A senha é obrigatória para novos membros.")
        .min(6, "A senha deve ter pelo menos 6 caracteres."),
    otherwise: (schema) => schema.notRequired(),
  }),
});
