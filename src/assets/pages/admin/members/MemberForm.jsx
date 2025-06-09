import React, { useState, useEffect } from 'react';
import './MemberForm.css';

const MemberForm = ({ initialData = {}, onSave, isCreating = false }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    // Garante que o formulário é preenchido com os dados iniciais ou valores padrão
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="member-form">
      
      <fieldset>
        <legend>Informações de Acesso</legend>
        <div className="form-grid">
          <div className="form-group"><label>Email</label><input type="email" name="Email" value={formData.Email || ''} onChange={handleChange} required /></div>
          {isCreating && (
            <div className="form-group"><label>Senha Inicial</label><input type="password" name="SenhaHash" onChange={handleChange} required /></div>
          )}
          <div className="form-group"><label>Credencial</label><select name="credencialAcesso" value={formData.credencialAcesso || 'Membro'} onChange={handleChange}><option value="Membro">Membro</option><option value="Diretoria">Diretoria</option><option value="Webmaster">Webmaster</option></select></div>
          <div className="form-group"><label>Status do Cadastro</label><select name="statusCadastro" value={formData.statusCadastro || 'Aprovado'} onChange={handleChange}><option value="Pendente">Pendente</option><option value="Aprovado">Aprovado</option><option value="Rejeitado">Rejeitado</option></select></div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Dados Pessoais</legend>
        <div className="form-grid">
          <div className="form-group full-width"><label>Nome Completo</label><input type="text" name="NomeCompleto" value={formData.NomeCompleto || ''} onChange={handleChange} required /></div>
          <div className="form-group"><label>CPF</label><input type="text" name="CPF" value={formData.CPF || ''} onChange={handleChange} required /></div>
          <div className="form-group"><label>Identidade (RG)</label><input type="text" name="Identidade" value={formData.Identidade || ''} onChange={handleChange} /></div>
          <div className="form-group"><label>Data de Nascimento</label><input type="date" name="DataNascimento" value={formData.DataNascimento?.split('T')[0] || ''} onChange={handleChange} /></div>
          <div className="form-group"><label>Telefone</label><input type="tel" name="Telefone" value={formData.Telefone || ''} onChange={handleChange} /></div>
          <div className="form-group full-width"><label>Endereço</label><input type="text" name="Endereco_Rua" value={formData.Endereco_Rua || ''} onChange={handleChange} placeholder="Rua, Av..." /></div>
          <div className="form-group"><label>Bairro</label><input type="text" name="Endereco_Bairro" value={formData.Endereco_Bairro || ''} onChange={handleChange} /></div>
          <div className="form-group"><label>Cidade</label><input type="text" name="Endereco_Cidade" value={formData.Endereco_Cidade || ''} onChange={handleChange} /></div>
          <div className="form-group"><label>CEP</label><input type="text" name="Endereco_CEP" value={formData.Endereco_CEP || ''} onChange={handleChange} /></div>
        </div>
      </fieldset>
      
      <fieldset>
        <legend>Dados Maçónicos</legend>
        <div className="form-grid">
          <div className="form-group"><label>CIM</label><input type="text" name="CIM" value={formData.CIM || ''} onChange={handleChange} /></div>
          <div className="form-group"><label>Situação</label><select name="Situacao" value={formData.Situacao || 'Ativo'} onChange={handleChange}><option value="Ativo">Ativo</option><option value="Licenciado">Licenciado</option><option value="Adormecido">Adormecido</option></select></div>
          <div className="form-group"><label>Graduação</label><select name="Graduacao" value={formData.Graduacao || 'APRENDIZ'} onChange={handleChange}><option value="APRENDIZ">Aprendiz</option><option value="COMPANHEIRO">Companheiro</option><option value="MESTRE">Mestre</option></select></div>
          <div className="form-group"><label>Data de Iniciação</label><input type="date" name="DataIniciacao" value={formData.DataIniciacao?.split('T')[0] || ''} onChange={handleChange} /></div>
          <div className="form-group"><label>Data de Elevação</label><input type="date" name="DataElevacao" value={formData.DataElevacao?.split('T')[0] || ''} onChange={handleChange} /></div>
          <div className="form-group"><label>Data de Exaltação</label><input type="date" name="DataExaltacao" value={formData.DataExaltacao?.split('T')[0] || ''} onChange={handleChange} /></div>
        </div>
      </fieldset>
      
      <fieldset>
        <legend>Informações Adicionais</legend>
         <div className="form-grid">
            <div className="form-group"><label>Formação Académica</label><input type="text" name="FormacaoAcademica" value={formData.FormacaoAcademica || ''} onChange={handleChange} /></div>
            <div className="form-group"><label>Ocupação/Profissão</label><input type="text" name="Ocupacao" value={formData.Ocupacao || ''} onChange={handleChange} /></div>
            <div className="form-group full-width"><label>Local de Trabalho</label><input type="text" name="LocalTrabalho" value={formData.LocalTrabalho || ''} onChange={handleChange} /></div>
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Salvar</button>
      </div>
    </form>
  );
};

export default MemberForm;
