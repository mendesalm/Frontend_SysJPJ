import React, { useState, useEffect } from 'react';
import { getContas } from '../../../services/financeService';
import { getAllMembers } from '../../../services/memberService';
import '../../styles/FormStyles.css';


const LancamentoForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    dataLancamento: new Date().toISOString().split('T')[0], // Data de hoje como padrão
    contaId: '',
    membroId: '',
  });
  const [contas, setContas] = useState([]);
  const [membros, setMembros] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Busca contas e membros para preencher os dropdowns
    const fetchData = async () => {
      try {
        const [contasRes, membrosRes] = await Promise.all([getContas(), getAllMembers()]);
        setContas(contasRes.data);
        setMembros(membrosRes.data);
      } catch (err) {
        setError('Erro ao carregar dados para o formulário.');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      valor: parseFloat(formData.valor),
      contaId: parseInt(formData.contaId, 10),
      membroId: formData.membroId ? parseInt(formData.membroId, 10) : null,
    });
  };

  if(error) return <p className="error-message">{error}</p>;

  return (
    <form onSubmit={handleSubmit} className="aviso-form">
      <div className="form-group">
        <label htmlFor="descricao">Descrição</label>
        <input type="text" id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="valor">Valor (R$)</label>
        <input type="number" step="0.01" id="valor" name="valor" value={formData.valor} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="dataLancamento">Data do Lançamento</label>
        <input type="date" id="dataLancamento" name="dataLancamento" value={formData.dataLancamento} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="contaId">Conta</label>
        <select id="contaId" name="contaId" value={formData.contaId} onChange={handleChange} required>
          <option value="">Selecione uma conta</option>
          {contas.map(conta => <option key={conta.id} value={conta.id}>{conta.nome} ({conta.tipo})</option>)}
        </select>
      </div>
       <div className="form-group">
        <label htmlFor="membroId">Membro Associado (opcional)</label>
        <select id="membroId" name="membroId" value={formData.membroId} onChange={handleChange}>
          <option value="">Nenhum</option>
          {membros.map(membro => <option key={membro.id} value={membro.id}>{membro.NomeCompleto}</option>)}
        </select>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Lançamento</button>
      </div>
    </form>
  );
};

export default LancamentoForm;
