// src/assets/pages/admin/members/MemberForm.jsx
import React, { useState, useEffect } from 'react';
import '../../../../assets/styles/FormStyles.css';

const MemberForm = ({ initialData = {}, onSave, isCreating = false }) => {
  const [formData, setFormData] = useState({ familiares: [], ...initialData });

  useEffect(() => {
    // Garante que o formulário é preenchido com os dados iniciais, incluindo familiares
    setFormData({ familiares: [], ...initialData });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Lógica para Familiares ---
  const handleFamilyChange = (index, e) => {
    const updatedFamiliares = formData.familiares.map((familiar, i) => {
        if (index === i) {
            return { ...familiar, [e.target.name]: e.target.value };
        }
        return familiar;
    });
    setFormData(prev => ({ ...prev, familiares: updatedFamiliares }));
  };

  const addFamilyMember = () => {
    setFormData(prev => ({
        ...prev,
        familiares: [...(prev.familiares || []), { nomeCompleto: '', parentesco: '', dataNascimento: '' }]
    }));
  };

  const removeFamilyMember = (index) => {
    setFormData(prev => ({
        ...prev,
        familiares: prev.familiares.filter((_, i) => i !== index)
    }));
  };
  // --- Fim da Lógica para Familiares ---

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envia o formData completo, incluindo o array de familiares
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* --- Informações de Acesso --- */}
      <fieldset className="form-fieldset">
        <legend>Informações de Acesso</legend>
        <div className="form-grid">
          <div className="form-group"><label>Email</label><input type="email" name="Email" value={formData.Email || ''} onChange={handleChange} required className="form-input"/></div>
          {isCreating && (
            <div className="form-group"><label>Senha Inicial</label><input type="password" name="SenhaHash" onChange={handleChange} required className="form-input"/></div>
          )}
          <div className="form-group"><label>Credencial</label><select name="credencialAcesso" value={formData.credencialAcesso || 'Membro'} onChange={handleChange} className="form-select"><option value="Membro">Membro</option><option value="Diretoria">Diretoria</option><option value="Webmaster">Webmaster</option></select></div>
          <div className="form-group"><label>Status do Cadastro</label><select name="statusCadastro" value={formData.statusCadastro || 'Aprovado'} onChange={handleChange} className="form-select"><option value="Pendente">Pendente</option><option value="Aprovado">Aprovado</option><option value="Rejeitado">Rejeitado</option></select></div>
        </div>
      </fieldset>

      {/* --- Dados Pessoais --- */}
      <fieldset className="form-fieldset">
        <legend>Dados Pessoais</legend>
        <div className="form-grid">
          <div className="form-group full-width"><label>Nome Completo</label><input type="text" name="NomeCompleto" value={formData.NomeCompleto || ''} onChange={handleChange} required className="form-input"/></div>
          <div className="form-group"><label>CPF</label><input type="text" name="CPF" value={formData.CPF || ''} onChange={handleChange} required className="form-input"/></div>
          <div className="form-group"><label>Identidade (RG)</label><input type="text" name="Identidade" value={formData.Identidade || ''} onChange={handleChange} className="form-input"/></div>
          <div className="form-group"><label>Data de Nascimento</label><input type="date" name="DataNascimento" value={formData.DataNascimento?.split('T')[0] || ''} onChange={handleChange} className="form-input"/></div>
          <div className="form-group"><label>Telefone</label><input type="tel" name="Telefone" value={formData.Telefone || ''} onChange={handleChange} className="form-input"/></div>
          <div className="form-group"><label>Naturalidade</label><input type="text" name="Naturalidade" value={formData.Naturalidade || ''} onChange={handleChange} className="form-input"/></div>
          <div className="form-group"><label>Nacionalidade</label><input type="text" name="Nacionalidade" value={formData.Nacionalidade || ''} onChange={handleChange} className="form-input"/></div>
        </div>
      </fieldset>
      
      {/* --- Dados Maçónicos --- */}
      <fieldset className="form-fieldset">
        <legend>Dados Maçónicos</legend>
        <div className="form-grid">
            <div className="form-group"><label>CIM</label><input type="text" name="CIM" value={formData.CIM || ''} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label>Situação</label><select name="Situacao" value={formData.Situacao || 'Ativo'} onChange={handleChange} className="form-select"><option value="Ativo">Ativo</option><option value="Licenciado">Licenciado</option><option value="Adormecido">Adormecido</option></select></div>
            <div className="form-group"><label>Grau</label><select name="Graduacao" value={formData.Graduacao || 'APRENDIZ'} onChange={handleChange} className="form-select"><option value="APRENDIZ">Aprendiz</option><option value="COMPANHEIRO">Companheiro</option><option value="MESTRE">Mestre</option></select></div>
            <div className="form-group"><label>Data de Iniciação</label><input type="date" name="DataIniciacao" value={formData.DataIniciacao?.split('T')[0] || ''} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label>Data de Elevação</label><input type="date" name="DataElevacao" value={formData.DataElevacao?.split('T')[0] || ''} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label>Data de Exaltação</label><input type="date" name="DataExaltacao" value={formData.DataExaltacao?.split('T')[0] || ''} onChange={handleChange} className="form-input" /></div>
        </div>
      </fieldset>

      {/* --- Dados Familiares --- */}
      <fieldset className="form-fieldset">
        <legend>Familiares</legend>
        {formData.familiares?.map((familiar, index) => (
            <div key={index} className="form-grid" style={{alignItems: 'flex-end', marginBottom: '1rem'}}>
                <div className="form-group"><label>Nome do Familiar</label><input type="text" name="nomeCompleto" value={familiar.nomeCompleto} onChange={(e) => handleFamilyChange(index, e)} className="form-input" /></div>
                <div className="form-group"><label>Parentesco</label><input type="text" name="parentesco" value={familiar.parentesco} onChange={(e) => handleFamilyChange(index, e)} className="form-input" /></div>
                <div className="form-group"><label>Data de Nasc.</label><input type="date" name="dataNascimento" value={familiar.dataNascimento.split('T')[0]} onChange={(e) => handleFamilyChange(index, e)} className="form-input" /></div>
                <div><button type="button" onClick={() => removeFamilyMember(index)} className="btn btn-secondary" style={{backgroundColor: '#b91c1c'}}>Remover</button></div>
            </div>
        ))}
        <button type="button" onClick={addFamilyMember} className="btn btn-secondary" style={{marginTop: '1rem'}}>+ Adicionar Familiar</button>
      </fieldset>
      
      <div className="form-actions">
        <button type="button" onClick={() => window.history.back()} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Alterações</button>
      </div>
    </form>
  );
};

export default MemberForm;
