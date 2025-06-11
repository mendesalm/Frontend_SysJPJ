import React, { useState } from 'react';
import '../../styles/FormStyles.css';



const EventoForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataHoraInicio: '',
    local: '',
    tipo: 'Evento Social' // Valor padrão
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="aviso-form">
      <div className="form-group">
        <label htmlFor="titulo">Título do Evento</label>
        <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
      </div>
       <div className="form-group">
        <label htmlFor="dataHoraInicio">Data e Hora de Início</label>
        <input type="datetime-local" id="dataHoraInicio" name="dataHoraInicio" value={formData.dataHoraInicio} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="local">Local</label>
        <input type="text" id="local" name="local" value={formData.local} onChange={handleChange} required />
      </div>
       <div className="form-group">
        <label htmlFor="tipo">Tipo de Evento</label>
        <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange}>
          <option value="Sessão Maçônica">Sessão Maçônica</option>
          <option value="Evento Social">Evento Social</option>
          <option value="Evento Filantrópico">Evento Filantrópico</option>
          <option value="Outro">Outro</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="descricao">Descrição (opcional)</label>
        <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} rows="4" />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Evento</button>
      </div>
    </form>
  );
};

export default EventoForm;
