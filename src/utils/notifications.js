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


/**
 * Exibe uma notificação de informação.
 * @param {string} message A mensagem a ser exibida.
 */
export const showInfoToast = (message) => {
  toast.info(message);
};

/**
 * Exibe uma notificação de aviso.
 * @param {string} message A mensagem a ser exibida.
 */
export const showWarningToast = (message) => {
  toast.warn(message);
};

const notifications = {
  success: showSuccessToast,
  error: showErrorToast,
  info: showInfoToast,
  warn: showWarningToast,
};

export default notifications;