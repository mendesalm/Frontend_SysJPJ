// src/assets/pages/profile/ChangePasswordForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userPasswordChangeSchema } from "../../../validators/passwordValidator";
import { updateUserPassword } from "../../../services/passwordService";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";
import "../../../assets/styles/FormStyles.css";

const ChangePasswordForm = ({ onFinished }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(userPasswordChangeSchema),
  });

  const onSubmit = async (data) => {
    try {
      await updateUserPassword({
        senhaAntiga: data.senhaAntiga,
        novaSenha: data.novaSenha,
      });
      showSuccessToast("Senha alterada com sucesso!");
      reset();
      onFinished(); // Fecha o modal
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Não foi possível alterar a senha."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div className="form-group">
        <label>Senha Atual</label>
        <input
          type="password"
          {...register("senhaAntiga")}
          className={`form-input ${errors.senhaAntiga ? "is-invalid" : ""}`}
        />
        {errors.senhaAntiga && (
          <p className="form-error-message">{errors.senhaAntiga.message}</p>
        )}
      </div>
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
          {isSubmitting ? "A alterar..." : "Alterar Senha"}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
