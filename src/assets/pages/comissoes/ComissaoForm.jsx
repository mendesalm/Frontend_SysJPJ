import React, { useState, useEffect } from 'react';
import { getAllMembers } from '../../../services/memberService';
import '../../styles/FormStyles.css';


const ComissaoForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Permanente',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: '',
    membrosIds: []
  });
  const [allMembers, setAllMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllMembers()
      .then(response => setAllMembers(response.data))
      .catch(() => setError('Não foi possível carregar a lista de membros.'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberSelect = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, membrosIds: selectedIds }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  if (error) return <p className="error-message">{error}</p>

  return (
    <form onSubmit={handleSubmit} className="aviso-form">
      <div className="form-group">
        <label htmlFor="nome">Nome da Comissão</label>
        <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="tipo">Tipo</label>
        <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange}>
          <option value="Permanente">Permanente</option>
          <option value="Temporária">Temporária</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="dataInicio">Data de Início</label>
        <input type="date" id="dataInicio" name="dataInicio" value={formData.dataInicio} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="dataFim">Data de Fim</label>
        <input type="date" id="dataFim" name="dataFim" value={formData.dataFim} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="membrosIds">Membros (Ctrl+Click para selecionar vários)</label>
        <select id="membrosIds" name="membrosIds" multiple value={formData.membrosIds} onChange={handleMemberSelect} required size="8" style={{height: '150px'}}>
          {allMembers.map(member => (
            <option key={member.id} value={member.id}>{member.NomeCompleto}</option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Comissão</button>
      </div>
    </form>
  );
};

export default ComissaoForm;
