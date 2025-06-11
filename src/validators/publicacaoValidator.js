import * as yup from "yup";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const publicacaoValidationSchema = yup.object().shape({
  nome: yup
    .string()
    .required("O nome do trabalho é obrigatório.")
    .min(5, "O nome do trabalho deve ter pelo menos 5 caracteres."),

  tema: yup.string().required("O tema é obrigatório."),

  grau: yup.string(),

  // Validação para o campo do ficheiro
  publicacaoFile: yup
    .mixed()
    .test("required", "É obrigatório selecionar um ficheiro.", (value) => {
      return value && value.length > 0;
    })
    .test("fileSize", "O ficheiro excede o tamanho máximo de 5MB.", (value) => {
      return value && value[0] && value[0].size <= MAX_FILE_SIZE;
    })
    .test(
      "fileType",
      "Formato de ficheiro não suportado (apenas PDF ou DOCX).",
      (value) => {
        return value && value[0] && SUPPORTED_FORMATS.includes(value[0].type);
      }
    ),
});
