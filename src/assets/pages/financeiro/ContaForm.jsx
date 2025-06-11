import React, { useState, useEffect } from 'react';
// Reutilizaremos o CSS do formulário de avisos
import '../../styles/FormStyles.css';


const ContaForm = ({ contaToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Receita', // Valor padrão
    descricao: ''
  });

  useEffect(() => {
    if (contaToEdit) {
      setFormData(contaToEdit);
    } else {
      setFormData({ nome: '', tipo: 'Receita', descricao: '' });
    }
  }, [contaToEdit]);

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
        <label htmlFor="nome">Nome da Conta</label>
        <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="tipo">Tipo de Conta</label>
        <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} required>
          <option value="Receita">Receita</option>
          <option value="Despesa">Despesa</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="descricao">Descrição (opcional)</label>
        <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} rows="3" />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Conta</button>
      </div>
    </form>
  );
};

export default ContaForm;
