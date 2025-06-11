import React, { useState } from 'react';
import '../../styles/FormStyles.css';


const HarmoniaForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '', autor: '', categoria: '', audioFile: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="aviso-form">
      <div className="form-group">
        <label htmlFor="titulo">Título da Música/Áudio</label>
        <input type="text" id="titulo" name="titulo" onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="autor">Autor/Compositor</label>
        <input type="text" id="autor" name="autor" onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="categoria">Categoria (ex: Sessão de Aprendiz)</label>
        <input type="text" id="categoria" name="categoria" onChange={handleChange} />
      </div>
       <div className="form-group">
        <label htmlFor="subcategoria">Subcategoria (ex: Entrada do Cortejo)</label>
        <input type="text" id="subcategoria" name="subcategoria" onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="audioFile">Ficheiro de Áudio (MP3, WAV, etc.)</label>
        <input type="file" id="audioFile" name="audioFile" onChange={handleChange} accept="audio/*" required />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Áudio</button>
      </div>
    </form>
  );
};

export default HarmoniaForm;
