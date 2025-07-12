// src/validators/lojaValidator.js
import * as yup from "yup";

export const lojaValidationSchema = yup.object().shape({
  nome: yup
    .string()
    .required("O nome da loja é obrigatório.")
    .min(5, "O nome deve ter pelo menos 5 caracteres."),
  numero: yup
    .number()
    .nullable()
    .typeError("O número da loja deve ser um valor numérico."),
  cidade: yup.string().required("A cidade é obrigatória."),
  estado: yup.string().required("O estado é obrigatório."),
  potencia: yup.string().required("A potência é obrigatória."),
});
