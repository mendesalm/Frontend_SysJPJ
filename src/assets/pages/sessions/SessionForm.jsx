import React, { useState } from "react";
import "../../../assets/styles/FormStyles.css";

// Função auxiliar para sugerir a data da próxima sexta-feira.
const getNextFriday = () => {
  const date = new Date();
  const day = date.getDay();
  // Se hoje é sábado (6), a diferença é 6 dias. Se for domingo (0), são 5 dias.
  const diff = day <= 5 ? 5 - day : 6;
  date.setDate(date.getDate() + diff);
  return date.toISOString().split("T")[0];
};

// Formulário refatorado e simplificado para a criação de sessões.
const SessionForm = ({ onSave, onCancel }) => {
  const [sessionData, setSessionData] = useState({
    dataSessao: getNextFriday(),
    tipoSessao: "Ordinária",
    subtipoSessao: "Aprendiz",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // A hora é fixa (19h30), então não precisamos de um campo para ela.
    // O backend pode assumir este valor ou ele pode ser ignorado,
    // já que o campo no banco é DATEONLY.
    onSave(sessionData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <p
        style={{
          textAlign: "center",
          color: "#9ca3af",
          marginTop: "-1rem",
          marginBottom: "1.5rem",
        }}
      >
        Esta ação irá apenas agendar a sessão. Detalhes como presença,
        visitantes e valores serão preenchidos posteriormente.
      </p>

      <fieldset className="form-fieldset">
        <legend>Agendamento da Sessão</legend>
        <div className="form-grid">
          <div className="form-group">
            <label>Data da Sessão</label>
            <input
              type="date"
              name="dataSessao"
              value={sessionData.dataSessao}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Tipo de Sessão</label>
            <select
              name="tipoSessao"
              value={sessionData.tipoSessao}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Ordinária">Ordinária</option>
              <option value="Magna">Magna</option>
            </select>
          </div>
          <div className="form-group">
            <label>Grau da Sessão</label>
            <select
              name="subtipoSessao"
              value={sessionData.subtipoSessao}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Aprendiz">Aprendiz</option>
              <option value="Companheiro">Companheiro</option>
              <option value="Mestre">Mestre</option>
              <option value="Pública">Pública</option>
            </select>
          </div>
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Registar Sessão
        </button>
      </div>
    </form>
  );
};

export default SessionForm;
