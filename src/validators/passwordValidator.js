// src/validators/passwordValidator.js
import * as yup from "yup";

// Esquema para o utilizador a alterar a sua própria senha
export const userPasswordChangeSchema = yup.object().shape({
  senhaAntiga: yup.string().required("A senha atual é obrigatória."),
  novaSenha: yup
    .string()
    .required("A nova senha é obrigatória.")
    .min(8, "A nova senha deve ter pelo menos 8 caracteres."),
  confirmarNovaSenha: yup
    .string()
    .required("A confirmação da senha é obrigatória.")
    .oneOf([yup.ref("novaSenha")], "As senhas não coincidem."),
});

// Esquema para um administrador a redefinir a senha de um utilizador
export const adminPasswordResetSchema = yup.object().shape({
  novaSenha: yup
    .string()
    .required("A nova senha é obrigatória.")
    .min(8, "A nova senha deve ter pelo menos 8 caracteres."),
  confirmarNovaSenha: yup
    .string()
    .required("A confirmação da senha é obrigatória.")
    .oneOf([yup.ref("novaSenha")], "As senhas não coincidem."),
});
