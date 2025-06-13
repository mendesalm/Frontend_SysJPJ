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
            <input
              {...register(`familiares.${index}.nomeCompleto`)}
              className={`form-input ${
                errors.familiares?.[index]?.nomeCompleto ? "is-invalid" : ""
              }`}
            />
          </div>
          <div className="form-group">
            <label>Parentesco</label>
            <select
              {...register(`familiares.${index}.parentesco`)}
              className={`form-select ${
                errors.familiares?.[index]?.parentesco ? "is-invalid" : ""
              }`}
            >
              {PARENTESCO_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Data de Nasc.</label>
            <input
              type="date"
              {...register(`familiares.${index}.dataNascimento`)}
              className={`form-input ${
                errors.familiares?.[index]?.dataNascimento ? "is-invalid" : ""
              }`}
            />
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
        onClick={() =>
          append({ nomeCompleto: "", parentesco: "Filho", dataNascimento: "" })
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
