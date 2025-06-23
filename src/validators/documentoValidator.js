// src/validators/documentoValidator.js
import * as yup from "yup";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_FORMATS = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const documentoValidationSchema = (isEditing = false) =>
  yup.object().shape({
    titulo: yup
      .string()
      .required("O título é obrigatório.")
      .min(5, "O título deve ter pelo menos 5 caracteres."),
    descricao: yup.string().optional(),
    dataPublicacao: yup
      .date()
      .required("A data de publicação é obrigatória.")
      .typeError("Forneça uma data válida."),
    documento: yup
      .mixed()
      .test("required", "É obrigatório selecionar um ficheiro.", (value) => {
        if (isEditing) return true; // Ficheiro não é obrigatório na edição
        return value && value.length > 0;
      })
      .test(
        "fileSize",
        "O ficheiro excede o tamanho máximo de 10MB.",
        (value) => {
          if (!value || value.length === 0) return true; // Passa se não houver ficheiro
          return value[0].size <= MAX_FILE_SIZE;
        }
      )
      .test("fileType", "Formato de ficheiro não suportado.", (value) => {
        if (!value || value.length === 0) return true;
        return SUPPORTED_FORMATS.includes(value[0].type);
      }),
  });
