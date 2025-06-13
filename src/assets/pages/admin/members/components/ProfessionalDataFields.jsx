import React from "react";

// Este componente recebe as funções `register` e o objeto `errors` do React Hook Form como props.
const ProfessionalDataFields = ({ register }) => {
  return (
    <fieldset className="form-fieldset">
      <legend>Dados Profissionais</legend>
      <div className="form-grid">
        <div className="form-group">
          <label>Formação Académica</label>
          <input
            type="text"
            {...register("FormacaoAcademica")}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Ocupação/Profissão</label>
          <input type="text" {...register("Ocupacao")} className="form-input" />
        </div>
        <div className="form-group">
          <label>Local de Trabalho</label>
          <input
            type="text"
            {...register("LocalTrabalho")}
            className="form-input"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default ProfessionalDataFields;
