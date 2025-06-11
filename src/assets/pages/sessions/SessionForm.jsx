import React, { useState, useEffect } from 'react';
import { getAllMembers } from '../../../services/memberService';
import '../../../assets/styles/FormStyles.css';

// Função auxiliar para encontrar a próxima sexta-feira
const getNextFriday = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = day <= 5 ? 5 - day : 5 - day + 7; // Dias até a próxima sexta
  date.setDate(date.getDate() + diff);
  return date.toISOString().split('T')[0];
};

const SessionForm = ({ onSave, onCancel }) => {
  // Estado para os dados principais da sessão
  const [sessionData, setSessionData] = useState({
    dataSessao: getNextFriday(),
    tipoSessao: 'Ordinária',
    subtipoSessao: 'Aprendiz',
    troncoDeBeneficencia: '',
  });

  // Estados separados para listas e ficheiros
  const [presentesIds, setPresentesIds] = useState([]);
  const [visitantes, setVisitantes] = useState([]);
  const [ataFile, setAtaFile] = useState(null);
  const [ataDetails, setAtaDetails] = useState({ numeroAta: '', anoAta: new Date().getFullYear() });
  
  // Listas para preencher os selects
  const [allMembers, setAllMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllMembers()
      .then(response => setAllMembers(response.data))
      .catch(() => setError('Não foi possível carregar a lista de membros.'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAtaDetailsChange = (e) => {
    const { name, value } = e.target;
    setAtaDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberSelect = (e) => {
    const options = e.target.options;
    const selectedIds = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedIds.push(options[i].value);
      }
    }
    setPresentesIds(selectedIds);
  };
  
  const addVisitor = () => {
    setVisitantes([...visitantes, { nomeCompleto: '', graduacao: '', loja: '' }]);
  };
  
  const handleVisitorChange = (index, e) => {
    const updatedVisitantes = visitantes.map((visitor, i) => 
      i === index ? { ...visitor, [e.target.name]: e.target.value } : visitor
    );
    setVisitantes(updatedVisitantes);
  };

  const removeVisitor = (index) => {
    setVisitantes(visitantes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Como temos um ficheiro, precisamos de usar FormData
    const formData = new FormData();
    
    // Adiciona os dados da sessão
    Object.keys(sessionData).forEach(key => formData.append(key, sessionData[key]));
    
    // Adiciona o array de presentes
    presentesIds.forEach(id => formData.append('presentesLodgeMemberIds[]', id));
    
    // Adiciona o array de visitantes (como JSON string)
    formData.append('visitantes', JSON.stringify(visitantes));
    
    // Adiciona os detalhes e o ficheiro da ata, se existirem
    if (ataFile) {
      formData.append('ataFile', ataFile);
      formData.append('numeroAta', ataDetails.numeroAta);
      formData.append('anoAta', ataDetails.anoAta);
    }
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {error && <p className="error-message">{error}</p>}
      
      <div className="form-section">
        <h3>Detalhes da Sessão</h3>
        <div className="form-grid">
          <div className="form-group"><label>Data</label><input type="date" name="dataSessao" value={sessionData.dataSessao} onChange={handleChange} required /></div>
          <div className="form-group"><label>Tipo</label><select name="tipoSessao" value={sessionData.tipoSessao} onChange={handleChange}><option>Ordinária</option><option>Magna</option></select></div>
          <div className="form-group"><label>Grau</label><select name="subtipoSessao" value={sessionData.subtipoSessao} onChange={handleChange}><option>Aprendiz</option><option>Companheiro</option><option>Mestre</option><option>Pública</option></select></div>
          <div className="form-group"><label>Tronco de Benef.</label><input type="number" name="troncoDeBeneficencia" value={sessionData.troncoDeBeneficencia} onChange={handleChange} placeholder="0.00" /></div>
        </div>
      </div>

      <div className="form-section">
        <h3>Presença de Obreiros</h3>
        <div className="form-group"><label>Membros Presentes (Ctrl+Click para múltiplos)</label><select multiple size="8" onChange={handleMemberSelect} className="multi-select">{allMembers.map(m => <option key={m.id} value={m.id}>{m.NomeCompleto}</option>)}</select></div>
      </div>
      
      <div className="form-section">
        <h3>Visitantes</h3>
        {visitantes.map((visitor, index) => (
          <div key={index} className="visitor-row">
            <input name="nomeCompleto" placeholder="Nome do Visitante" value={visitor.nomeCompleto} onChange={e => handleVisitorChange(index, e)} />
            <input name="graduacao" placeholder="Grau" value={visitor.graduacao} onChange={e => handleVisitorChange(index, e)} />
            <input name="loja" placeholder="Loja" value={visitor.loja} onChange={e => handleVisitorChange(index, e)} />
            <button type="button" onClick={() => removeVisitor(index)} className="btn-remove-visitor">&times;</button>
          </div>
        ))}
        <button type="button" onClick={addVisitor} className="btn-add-visitor">+ Adicionar Visitante</button>
      </div>

      <div className="form-section">
        <h3>Ata da Sessão</h3>
        <div className="form-grid">
            <div className="form-group"><label>Nº da Ata</label><input type="text" name="numeroAta" value={ataDetails.numeroAta} onChange={handleAtaDetailsChange} /></div>
            <div className="form-group"><label>Ano da Ata</label><input type="number" name="anoAta" value={ataDetails.anoAta} onChange={handleAtaDetailsChange} /></div>
            <div className="form-group full-width"><label>Ficheiro da Ata (PDF)</label><input type="file" name="ataFile" onChange={(e) => setAtaFile(e.target.files[0])} accept=".pdf,.doc,.docx" /></div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Registar Sessão</button>
      </div>
    </form>
  );
};

export default SessionForm;
