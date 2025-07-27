import * as yup from "yup";

export const TIPOS_SESSAO = ["Ordinária", "Magna", "Especial", "Econômica"];
export const SUBTIPOS_SESSAO = [
  "Aprendiz",
  "Companheiro",
  "Mestre",
  "Exaltação",
  "Iniciação",
  "Elevação",
  "Pública",
];
export const SUBTIPOS_SESSAO_ESPECIAL = ["Administrativa", "Eleitoral"];

export const sessionValidationSchema = yup.object().shape({
  dataSessao: yup
    .string()
    .required("A data da sessão é obrigatória.")
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      "O formato da data deve ser YYYY-MM-DDTHH:mm."
    ),

  tipoSessao: yup
    .string()
    .oneOf(TIPOS_SESSAO, "Tipo de sessão inválido.")
    .required("O tipo da sessão é obrigatório."),

  subtipoSessao: yup
    .string()
    .required("O subtipo da sessão é obrigatório.")
    .when("tipoSessao", {
      is: "Especial",
      then: (schema) =>
        schema.oneOf(
          SUBTIPOS_SESSAO_ESPECIAL,
          "Para sessões especiais, o subtipo deve ser Administrativa ou Eleitoral."
        ),
      otherwise: (schema) =>
        schema.oneOf(
          SUBTIPOS_SESSAO,
          "Subtipo de sessão inválido para este tipo."
        ),
    }),

  objetivoSessao: yup.string().optional(),

  status: yup.string().optional(),

  ataSessao: yup
    .mixed()
    .optional()
    .test("fileSize", "O ficheiro é muito grande (máx. 5MB)", (value) => {
      if (!value || !value.length) return true;
      return value[0].size <= 5000000;
    }),
});