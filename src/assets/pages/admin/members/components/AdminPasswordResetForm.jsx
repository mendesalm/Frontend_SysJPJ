// src/assets/pages/admin/members/components/AdminPasswordResetForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { adminPasswordResetSchema } from "../../../../../validators/passwordValidator";
import { adminResetUserPassword } from "../../../../../services/passwordService";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../../utils/notifications";
import "../../../../styles/FormStyles.css";

const AdminPasswordResetForm = ({ memberId, onFinished }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(adminPasswordResetSchema),
  });

  const onSubmit = async (data) => {
    try {
      await adminResetUserPassword(memberId, { novaSenha: data.novaSenha });
      showSuccessToast("Senha do membro redefinida com sucesso!");
      reset();
      onFinished(); // Fecha o modal
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Não foi possível redefinir a senha."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div className="form-group">
        <label>Nova Senha</label>
        <input
          type="password"
          {...register("novaSenha")}
          className={`form-input ${errors.novaSenha ? "is-invalid" : ""}`}
        />
        {errors.novaSenha && (
          <p className="form-error-message">{errors.novaSenha.message}</p>
        )}
      </div>
      <div className="form-group">
        <label>Confirmar Nova Senha</label>
        <input
          type="password"
          {...register("confirmarNovaSenha")}
          className={`form-input ${
            errors.confirmarNovaSenha ? "is-invalid" : ""
          }`}
        />
        {errors.confirmarNovaSenha && (
          <p className="form-error-message">
            {errors.confirmarNovaSenha.message}
          </p>
        )}
      </div>
      <div className="form-actions">
        <button
          type="button"
          onClick={onFinished}
          className="btn btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "A redefinir..." : "Redefinir Senha"}
        </button>
      </div>
    </form>
  );
};

export default AdminPasswordResetForm;
