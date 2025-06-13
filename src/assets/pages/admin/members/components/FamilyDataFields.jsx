// src/assets/pages/admin/members/components/FamilyDataFields.jsx
import React from "react";
import { PARENTESCO_OPTIONS } from "../../../../../constants/formConstants";

const FamilyDataFields = ({ fields, register, errors, remove, append }) => {
  return (
    <fieldset className="form-fieldset">
      <legend>Familiares</legend>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="form-grid"
          style={{
            alignItems: "flex-end",
            marginBottom: "1rem",
            borderBottom: "1px solid var(--cor-borda-input)",
            paddingBottom: "1rem",
          }}
        >
          <div className="form-group">
            <label>Nome do Familiar</label>
            {/* --- MUDANÇA AQUI --- */}
            <input
              {...register(`familiares.${index}.Nome`)}
              className={`form-input ${
                errors.familiares?.[index]?.Nome ? "is-invalid" : ""
              }`}
            />
            {errors.familiares?.[index]?.Nome && (
              <p className="form-error-message">
                {errors.familiares[index].Nome.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Parentesco</label>
            {/* --- MUDANÇA AQUI --- */}
            <select
              {...register(`familiares.${index}.Parentesco`)}
              className={`form-select ${
                errors.familiares?.[index]?.Parentesco ? "is-invalid" : ""
              }`}
            >
              {PARENTESCO_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.familiares?.[index]?.Parentesco && (
              <p className="form-error-message">
                {errors.familiares[index].Parentesco.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Data de Nasc.</label>
            {/* --- MUDANÇA AQUI --- */}
            <input
              type="date"
              {...register(`familiares.${index}.DataNascimento`)}
              className={`form-input ${
                errors.familiares?.[index]?.DataNascimento ? "is-invalid" : ""
              }`}
            />
            {errors.familiares?.[index]?.DataNascimento && (
              <p className="form-error-message">
                {errors.familiares[index].DataNascimento.message}
              </p>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="btn btn-secondary"
              style={{ backgroundColor: "#b91c1c" }}
            >
              Remover
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        // --- MUDANÇA AQUI ---
        onClick={() =>
          append({ Nome: "", Parentesco: "Filho", DataNascimento: "" })
        }
        className="btn btn-secondary"
        style={{ marginTop: "1rem" }}
      >
        + Adicionar Familiar
      </button>
    </fieldset>
  );
};

export default FamilyDataFields;
