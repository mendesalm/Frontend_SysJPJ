import React from "react";
import {
  GRAU_OPTIONS,
  SITUACAO_MEMBRO,
} from "../../../../../constants/userConstants";

const MasonicDataFields = ({ register, errors, isReadOnly = false }) => {
  return (
    <fieldset className="form-fieldset">
      <legend>Dados Maçônicos</legend>
      <div className="form-grid">
        <div className="form-group">
          <label>CIM</label>
          <input
            type="text"
            {...register("CIM")}
            disabled={isReadOnly}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Situação</label>
          {/* CORREÇÃO: Campo alterado de input para select */}
          <select
            {...register("Situacao")}
            disabled={isReadOnly}
            className={`form-select ${errors.Situacao ? "is-invalid" : ""}`}
          >
            {SITUACAO_MEMBRO.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.Situacao && (
            <p className="form-error-message">{errors.Situacao.message}</p>
          )}
        </div>
        <div className="form-group">
          <label>Grau</label>
          <select
            {...register("Graduacao")}
            className={`form-select ${errors.Graduacao ? "is-invalid" : ""}`}
            disabled={isReadOnly}
          >
            {GRAU_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.Graduacao && (
            <p className="form-error-message">{errors.Graduacao.message}</p>
          )}
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Data de Iniciação</label>
          <input
            type="date"
            {...register("DataIniciacao")}
            disabled={isReadOnly}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Data de Elevação</label>
          <input
            type="date"
            {...register("DataElevacao")}
            disabled={isReadOnly}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Data de Exaltação</label>
          <input
            type="date"
            {...register("DataExaltacao")}
            disabled={isReadOnly}
            className="form-input"
          />
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Data de Filiação</label>
          <input
            type="date"
            {...register("DataFiliacao")}
            disabled={isReadOnly}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Data de Regularização</label>
          <input
            type="date"
            {...register("DataRegularizacao")}
            disabled={isReadOnly}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Grau Filosófico</label>
          <input
            type="text"
            {...register("grauFilosofico")}
            className="form-input"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default MasonicDataFields;
