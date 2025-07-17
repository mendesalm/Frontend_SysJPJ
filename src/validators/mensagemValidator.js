import * as yup from "yup";

// ENUMs baseados no relatório da API
export const TIPOS_MENSAGEM = [
  "ANIVERSARIO",
  "DIA_DOS_PAIS",
  "EVENTO_ESPECIAL",
  "OUTROS",
];
export const SUBTIPOS_MENSAGEM = [
  "IRMAO",
  "CONGUJE",
  "FAMILIAR",
  "CUNHADA",
  "SOBRINHO",
  "SOBRINHA",
];

export const mensagemValidationSchema = yup.object().shape({
  tipo: yup
    .string()
    .oneOf(TIPOS_MENSAGEM, "Tipo de mensagem inválido.")
    .required("O tipo é obrigatório."),
  subtipo: yup
    .string()
    .oneOf(SUBTIPOS_MENSAGEM, "Subtipo de mensagem inválido.")
    .required("O subtipo é obrigatório."),
  conteudo: yup
    .string()
    .required("O conteúdo da mensagem é obrigatório.")
    .min(10, "A mensagem deve ter pelo menos 10 caracteres."),
  ativo: yup.boolean(),
});
