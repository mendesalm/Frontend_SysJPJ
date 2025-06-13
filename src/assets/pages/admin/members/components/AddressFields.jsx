import React from "react";

const AddressFields = ({ register, handleCepBlur, cepStatus }) => {
  return (
    <fieldset className="form-fieldset">
      <legend>Endereço</legend>
      <div className="form-grid" style={{ gridTemplateColumns: "1fr 3fr" }}>
        <div className="form-group">
          <label>CEP</label>
          <div>
            <input
              type="text"
              {...register("Endereco_CEP")}
              className="form-input"
              onBlur={handleCepBlur}
            />
            {cepStatus && (
              <small
                style={{ color: "var(--cor-foco-input)", marginTop: "5px" }}
              >
                {cepStatus}
              </small>
            )}
          </div>
        </div>
        <div className="form-group">
          <label>Rua / Avenida</label>
          <input
            type="text"
            {...register("Endereco_Rua")}
            className="form-input"
          />
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Número</label>
          <input
            type="text"
            {...register("Endereco_Numero")}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Bairro</label>
          <input
            type="text"
            {...register("Endereco_Bairro")}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Cidade</label>
          <input
            type="text"
            {...register("Endereco_Cidade")}
            className="form-input"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default AddressFields;
