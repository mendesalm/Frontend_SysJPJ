import React, { useState } from 'react';
import '../../styles/FormStyles.css';



const PublicacaoForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    tema: '',
    nome: '',
    grau: '',
    arquivoPublicacao: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'arquivoPublicacao') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="aviso-form">
      <div className="form-group">
        <label htmlFor="nome">Nome do Trabalho/Documento</label>
        <input type="text" id="nome" name="nome" onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="tema">Tema</label>
        <input type="text" id="tema" name="tema" onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="grau">Grau (opcional)</label>
        <input type="text" id="grau" name="grau" onChange={handleChange} placeholder="Ex: Aprendiz, Companheiro..." />
      </div>
      <div className="form-group">
        <label htmlFor="arquivoPublicacao">Ficheiro (PDF, DOC, DOCX)</label>
        <input type="file" id="arquivoPublicacao" name="arquivoPublicacao" onChange={handleChange} accept=".pdf,.doc,.docx" required />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Publicação</button>
      </div>
    </form>
  );
};

export default PublicacaoForm;
