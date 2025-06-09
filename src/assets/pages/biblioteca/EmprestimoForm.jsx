import React, { useState, useEffect } from 'react';
import { getAllMembers } from '../../../services/memberService'; // Reutilizamos o serviço de membros
import '../avisos/AvisoForm.css';

const EmprestimoForm = ({ livro, onSave, onCancel }) => {
  const [membroId, setMembroId] = useState('');
  const [dataDevolucaoPrevista, setDataDevolucaoPrevista] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 15); // Sugere devolução em 15 dias
    return date.toISOString().split('T')[0];
  });
  const [membros, setMembros] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembros = async () => {
      try {
        const response = await getAllMembers();
        setMembros(response.data);
      } catch (err) {
        setError('Não foi possível carregar a lista de membros.');
      }
    };
    fetchMembros();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!membroId) {
      setError('Por favor, selecione um membro.');
      return;
    }
    onSave({
      livroId: livro.id,
      membroId: parseInt(membroId, 10),
      dataDevolucaoPrevista,
    });
  };
  
  if (error) return <p className="error-message">{error}</p>

  return (
    <form onSubmit={handleSubmit} className="aviso-form">
      <h4>Emprestar Livro: {livro.titulo}</h4>
      <div className="form-group">
        <label htmlFor="membroId">Emprestar para:</label>
        <select id="membroId" value={membroId} onChange={(e) => setMembroId(e.target.value)} required>
          <option value="">-- Selecione um Membro --</option>
          {membros.map(membro => (
            <option key={membro.id} value={membro.id}>{membro.NomeCompleto}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="dataDevolucaoPrevista">Data de Devolução Prevista:</label>
        <input type="date" id="dataDevolucaoPrevista" value={dataDevolucaoPrevista} onChange={(e) => setDataDevolucaoPrevista(e.target.value)} required />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Confirmar Empréstimo</button>
      </div>
    </form>
  );
};

export default EmprestimoForm;
