import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { updateMyProfile } from '../../../services/memberService';
// Reutilizamos o mesmo estilo do formulário de admin
import '../admin/members/MemberForm.css'; 

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth(); // Usamos os dados do contexto
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Preenche o formulário quando os dados do utilizador do contexto estiverem disponíveis
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      // Usamos a nova função do serviço para atualizar o perfil
      await updateMyProfile(formData);
      setSuccessMessage('Perfil atualizado com sucesso!');
      // Opcional: recarregar os dados do utilizador no contexto após a atualização
      // (a implementação atual do AuthContext já faz isso ao recarregar a página)
    } catch (err) {
      console.error("Erro ao atualizar o perfil:", err);
      setError('Não foi possível salvar as alterações. Verifique os dados e tente novamente.');
    }
  };

  if (authLoading || !formData) {
    return <div className="member-form-container">A carregar perfil...</div>;
  }

  return (
    <div className="member-form-container">
      <h1>Meu Perfil</h1>
      <form onSubmit={handleSubmit} className="member-form">
        <div className="form-grid">
            <div className="form-group">
                <label htmlFor="NomeCompleto">Nome Completo</label>
                <input type="text" id="NomeCompleto" name="NomeCompleto" value={formData.NomeCompleto || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label htmlFor="Email">Email</label>
                <input type="email" id="Email" name="Email" value={formData.Email || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label htmlFor="Telefone">Telefone</label>
                <input type="tel" id="Telefone" name="Telefone" value={formData.Telefone || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label htmlFor="CPF">CPF (não editável)</label>
                <input type="text" id="CPF" name="CPF" value={formData.CPF || ''} disabled />
            </div>
             {/* Adicione outros campos editáveis do perfil aqui (ex: Endereço, Data de Nascimento, etc.) */}
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">Voltar</button>
          <button type="submit" className="btn btn-primary">Salvar Alterações</button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
