// src/validators/classificadosValidator.js
import * as yup from "yup";

const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const classificadoValidationSchema = yup.object().shape({
  titulo: yup
    .string()
    .required("O título é obrigatório.")
    .min(5, "O título deve ter pelo menos 5 caracteres."),
  descricao: yup
    .string()
    .required("A descrição é obrigatória.")
    .min(10, "A descrição deve ter pelo menos 10 caracteres."),
  tipoAnuncio: yup
    .string()
    .oneOf(
      ["Venda", "Compra", "Aluguel", "Doação", "Serviço"],
      "Tipo de anúncio inválido."
    )
    .required("O tipo de anúncio é obrigatório."),
  valor: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable(),
  contato: yup.string().optional(),
  fotos: yup
    .mixed()
    .test("fileCount", "Pode enviar no máximo 5 fotos.", (value) => {
      return !value || value.length <= 5;
    })
    .test(
      "fileType",
      "Formato de ficheiro não suportado. Apenas imagens são permitidas.",
      (value) => {
        if (!value || value.length === 0) return true; // Permite o campo vazio
        for (let i = 0; i < value.length; i++) {
          if (!SUPPORTED_FORMATS.includes(value[i].type)) {
            return false;
          }
        }
        return true;
      }
    ),
});
