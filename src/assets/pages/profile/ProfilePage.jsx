import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { updateMyProfile } from '../../../services/memberService';
import '../../styles/FormStyles.css';


const ProfilePage = () => {
  const { user, loading: authLoading, checkUserStatus } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Carrega os dados do utilizador do contexto para o estado do formulário
  useEffect(() => {
    if (user) {
      // Garante que familiares seja um array, mesmo que venha nulo do backend
      setFormData({ ...user, familiares: user.familiares || [] });
    }
  }, [user]);

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
    const familiarToRemove = formData.familiares[index];
    // Se o familiar já existe no banco (tem um ID), precisaremos de o remover via API
    if (familiarToRemove.id && !window.confirm(`Tem certeza que deseja remover ${familiarToRemove.nomeCompleto}?`)) {
        return;
    }

    setFormData(prev => ({
        ...prev,
        familiares: prev.familiares.filter((_, i) => i !== index)
    }));
  };
  // --- Fim da Lógica para Familiares ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      // O backend deve ser inteligente para lidar com o array de familiares.
      // A função `updateMyProfile` deve ser capaz de processar todos os dados enviados.
      await updateMyProfile(formData);

      // Recarrega os dados do utilizador no contexto para refletir as alterações
      await checkUserStatus(); 

      setSuccessMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Erro ao atualizar o perfil:", err);
      setError(err.response?.data?.message || 'Não foi possível salvar as alterações. Verifique os dados e tente novamente.');
    }
  };

  if (authLoading || !formData) {
    return <div className="table-page-container">A carregar perfil...</div>;
  }

  return (
    <div className="table-page-container">
        <div className="table-header">
            <h1>Meu Perfil</h1>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="form-container" style={{ padding: 0 }}>
            {/* --- Dados Pessoais --- */}
            <fieldset className="form-fieldset">
                <legend>Dados Pessoais</legend>
                <div className="form-grid">
                    <div className="form-group full-width"><label>Nome Completo</label><input type="text" name="NomeCompleto" value={formData.NomeCompleto || ''} onChange={handleChange} required className="form-input"/></div>
                    <div className="form-group"><label>CPF (não editável)</label><input type="text" value={formData.CPF || ''} disabled className="form-input"/></div>
                    <div className="form-group"><label>Email</label><input type="email" name="Email" value={formData.Email || ''} onChange={handleChange} required className="form-input"/></div>
                    <div className="form-group"><label>Identidade (RG)</label><input type="text" name="Identidade" value={formData.Identidade || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>Data de Nascimento</label><input type="date" name="DataNascimento" value={formData.DataNascimento?.split('T')[0] || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>Telefone</label><input type="tel" name="Telefone" value={formData.Telefone || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>Naturalidade</label><input type="text" name="Naturalidade" value={formData.Naturalidade || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>Nacionalidade</label><input type="text" name="Nacionalidade" value={formData.Nacionalidade || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>Religião</label><input type="text" name="Religiao" value={formData.Religiao || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>Nome do Pai</label><input type="text" name="NomePai" value={formData.NomePai || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>Nome da Mãe</label><input type="text" name="NomeMae" value={formData.NomeMae || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>Data de Casamento</label><input type="date" name="DataCasamento" value={formData.DataCasamento?.split('T')[0] || ''} onChange={handleChange} className="form-input"/></div>
                </div>
            </fieldset>

            {/* --- Endereço --- */}
            <fieldset className="form-fieldset">
                <legend>Endereço</legend>
                <div className="form-grid" style={{gridTemplateColumns: '3fr 1fr'}}>
                    <div className="form-group"><label>Rua / Avenida</label><input type="text" name="Endereco_Rua" value={formData.Endereco_Rua || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>Número</label><input type="text" name="Endereco_Numero" value={formData.Endereco_Numero || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>Bairro</label><input type="text" name="Endereco_Bairro" value={formData.Endereco_Bairro || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>Cidade</label><input type="text" name="Endereco_Cidade" value={formData.Endereco_Cidade || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>CEP</label><input type="text" name="Endereco_CEP" value={formData.Endereco_CEP || ''} onChange={handleChange} className="form-input"/></div>
                </div>
            </fieldset>

             {/* --- Dados Profissionais --- */}
             <fieldset className="form-fieldset">
                <legend>Dados Profissionais</legend>
                <div className="form-grid">
                    <div className="form-group"><label>Formação Académica</label><input type="text" name="FormacaoAcademica" value={formData.FormacaoAcademica || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group"><label>Ocupação/Profissão</label><input type="text" name="Ocupacao" value={formData.Ocupacao || ''} onChange={handleChange} className="form-input"/></div>
                    <div className="form-group full-width"><label>Local de Trabalho</label><input type="text" name="LocalTrabalho" value={formData.LocalTrabalho || ''} onChange={handleChange} className="form-input"/></div>
                </div>
            </fieldset>

            {/* --- Dados Familiares --- */}
            <fieldset className="form-fieldset">
                <legend>Familiares</legend>
                {formData.familiares?.map((familiar, index) => (
                    <div key={familiar.id || index} className="form-grid" style={{alignItems: 'flex-end', marginBottom: '1rem', borderBottom: '1px solid var(--cor-borda-input)', paddingBottom: '1rem'}}>
                        <div className="form-group"><label>Nome do Familiar</label><input type="text" name="nomeCompleto" value={familiar.nomeCompleto} onChange={(e) => handleFamilyChange(index, e)} className="form-input" /></div>
                        <div className="form-group"><label>Parentesco</label><input type="text" name="parentesco" value={familiar.parentesco} onChange={(e) => handleFamilyChange(index, e)} className="form-input" /></div>
                        <div className="form-group"><label>Data de Nasc.</label><input type="date" name="dataNascimento" value={familiar.dataNascimento?.split('T')[0] || ''} onChange={(e) => handleFamilyChange(index, e)} className="form-input" /></div>
                        <div><button type="button" onClick={() => removeFamilyMember(index)} className="btn btn-secondary" style={{backgroundColor: '#b91c1c'}}>Remover</button></div>
                    </div>
                ))}
                <button type="button" onClick={addFamilyMember} className="btn btn-secondary" style={{marginTop: '1rem'}}>+ Adicionar Familiar</button>
            </fieldset>
            
            <div className="form-actions">
                <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">Voltar</button>
                <button type="submit" className="btn btn-primary">Salvar Alterações</button>
            </div>
        </form>
    </div>
  );
};

export default ProfilePage;
