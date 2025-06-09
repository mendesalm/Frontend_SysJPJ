import React, { useState, useEffect } from 'react';
import './AvisoForm.css';

const AvisoForm = ({ avisoToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    fixado: false,
    dataExpiracao: '',
  });

  useEffect(() => {
    if (avisoToEdit) {
      setFormData({
        titulo: avisoToEdit.titulo || '',
        conteudo: avisoToEdit.conteudo || '',
        fixado: avisoToEdit.fixado || false,
        // Formata a data para o input type="date" (AAAA-MM-DD)
        dataExpiracao: avisoToEdit.dataExpiracao ? new Date(avisoToEdit.dataExpiracao).toISOString().split('T')[0] : '',
      });
    } else {
      // Reseta o formulário para criação
      setFormData({ titulo: '', conteudo: '', fixado: false, dataExpiracao: '' });
    }
  }, [avisoToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="aviso-form">
      <div className="form-group">
        <label htmlFor="titulo">Título</label>
        <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="conteudo">Conteúdo</label>
        <textarea id="conteudo" name="conteudo" value={formData.conteudo} onChange={handleChange} rows="6" required />
      </div>
      <div className="form-group">
        <label htmlFor="dataExpiracao">Data de Expiração (opcional)</label>
        <input type="date" id="dataExpiracao" name="dataExpiracao" value={formData.dataExpiracao} onChange={handleChange} />
      </div>
      <div className="form-group-inline">
        <input type="checkbox" id="fixado" name="fixado" checked={formData.fixado} onChange={handleChange} />
        <label htmlFor="fixado">Fixar este aviso no topo</label>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Aviso</button>
      </div>
    </form>
  );
};

export default AvisoForm;
