// src/utils/notifications.js
import { toast } from "react-toastify";

/**
 * Exibe uma notificação de sucesso.
 * @param {string} message A mensagem a ser exibida.
 */
export const showSuccessToast = (message) => {
  toast.success(message);
};

/**
 * Exibe uma notificação de erro.
 * @param {string} message A mensagem a ser exibida.
 */
export const showErrorToast = (message) => {
  toast.error(message);
};
