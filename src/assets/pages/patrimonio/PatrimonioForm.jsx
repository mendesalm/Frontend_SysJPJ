import React, { useState, useEffect } from 'react';
import '../avisos/AvisoForm.css'; // Reutilizando estilos

const PatrimonioForm = ({ itemToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    dataAquisicao: new Date().toISOString().split('T')[0],
    valorAquisicao: '',
    estadoConservacao: 'Bom',
    localizacao: ''
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        ...itemToEdit,
        dataAquisicao: itemToEdit.dataAquisicao ? new Date(itemToEdit.dataAquisicao).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        nome: '', descricao: '', dataAquisicao: new Date().toISOString().split('T')[0],
        valorAquisicao: '', estadoConservacao: 'Bom', localizacao: ''
      });
    }
  }, [itemToEdit]);

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
        <label htmlFor="nome">Nome do Item</label>
        <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="descricao">Descrição</label>
        <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} rows="3" />
      </div>
      <div className="form-group">
        <label htmlFor="dataAquisicao">Data de Aquisição</label>
        <input type="date" id="dataAquisicao" name="dataAquisicao" value={formData.dataAquisicao} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="valorAquisicao">Valor de Aquisição (R$)</label>
        <input type="number" step="0.01" id="valorAquisicao" name="valorAquisicao" value={formData.valorAquisicao} onChange={handleChange} required />
      </div>
       <div className="form-group">
        <label htmlFor="localizacao">Localização</label>
        <input type="text" id="localizacao" name="localizacao" value={formData.localizacao} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="estadoConservacao">Estado de Conservação</label>
        <select id="estadoConservacao" name="estadoConservacao" value={formData.estadoConservacao} onChange={handleChange}>
          <option value="Novo">Novo</option>
          <option value="Bom">Bom</option>
          <option value="Regular">Regular</option>
          <option value="Necessita Reparo">Necessita Reparo</option>
          <option value="Inservível">Inservível</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Item</button>
      </div>
    </form>
  );
};

export default PatrimonioForm;
