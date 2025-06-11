import React, { useState, useEffect } from 'react';
// Reutiliza o CSS de outros formulários para manter a consistência
import '../../styles/FormStyles.css';



const LivroForm = ({ livroToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    autores: '',
    editora: '',
    anoPublicacao: '',
    ISBN: '',
    observacoes: ''
  });

  useEffect(() => {
    if (livroToEdit) {
      setFormData({
        titulo: livroToEdit.titulo || '',
        autores: livroToEdit.autores || '',
        editora: livroToEdit.editora || '',
        anoPublicacao: livroToEdit.anoPublicacao || '',
        ISBN: livroToEdit.ISBN || '',
        observacoes: livroToEdit.observacoes || ''
      });
    } else {
      // Reseta o formulário para criação
      setFormData({ titulo: '', autores: '', editora: '', anoPublicacao: '', ISBN: '', observacoes: '' });
    }
  }, [livroToEdit]);

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
        <label htmlFor="titulo">Título do Livro</label>
        <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="autores">Autor(es)</label>
        <input type="text" id="autores" name="autores" value={formData.autores} onChange={handleChange} />
      </div>
       <div className="form-group">
        <label htmlFor="editora">Editora</label>
        <input type="text" id="editora" name="editora" value={formData.editora} onChange={handleChange} />
      </div>
       <div className="form-group">
        <label htmlFor="anoPublicacao">Ano de Publicação</label>
        <input type="number" id="anoPublicacao" name="anoPublicacao" value={formData.anoPublicacao} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="ISBN">ISBN</label>
        <input type="text" id="ISBN" name="ISBN" value={formData.ISBN} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="observacoes">Observações</label>
        <textarea id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} rows="3" />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Livro</button>
      </div>
    </form>
  );
};

export default LivroForm;
