import React from "react";

const PersonalDataFields = ({ register, errors, isReadOnly = false }) => {
  return (
    <fieldset className="form-fieldset">
      <legend>Dados Pessoais</legend>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Nome Completo</label>
          <input
            type="text"
            {...register("NomeCompleto")}
            className={`form-input ${errors.NomeCompleto ? "is-invalid" : ""}`}
          />
          {errors.NomeCompleto && (
            <p className="form-error-message">{errors.NomeCompleto.message}</p>
          )}
        </div>
        <div className="form-group">
          <label>CPF</label>
          <input
            type="text"
            {...register("CPF")}
            className="form-input"
            disabled={isReadOnly} // O CPF não pode ser editado pelo próprio usuário
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            {...register("Email")}
            className={`form-input ${errors.Email ? "is-invalid" : ""}`}
          />
          {errors.Email && (
            <p className="form-error-message">{errors.Email.message}</p>
          )}
        </div>
        <div className="form-group">
          <label>Identidade (RG)</label>
          <input
            type="text"
            {...register("Identidade")}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Data de Nasc.</label>
          <input
            type="date"
            {...register("DataNascimento")}
            className={`form-input ${
              errors.DataNascimento ? "is-invalid" : ""
            }`}
          />
          {errors.DataNascimento && (
            <p className="form-error-message">
              {errors.DataNascimento.message}
            </p>
          )}
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input type="tel" {...register("Telefone")} className="form-input" />
        </div>
      </div>
    </fieldset>
  );
};

export default PersonalDataFields;
