import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMemberById, updateMember } from '../../../../services/memberService';
import './MemberForm.css'; // Usaremos um CSS de formulário

const MemberEditPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null); // Inicia como nulo
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMember = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getMemberById(memberId);
      setFormData(response.data); // Preenche o formulário com os dados do membro
    } catch (err) {
      console.error("Erro ao buscar dados do membro:", err);
      setError('Falha ao carregar dados do membro.');
    } finally {
      setIsLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await updateMember(memberId, formData);
      alert('Membro atualizado com sucesso!');
      navigate('/admin/members'); // Volta para a lista após salvar
    } catch (err) {
      console.error("Erro ao atualizar membro:", err);
      setError('Não foi possível salvar as alterações. Verifique os dados e tente novamente.');
    }
  };

  if (isLoading) return <div className="member-form-container">A carregar...</div>;
  if (error) return <div className="member-form-container error-message">{error}</div>;

  return (
    <div className="member-form-container">
      <h1>Editar Membro: {formData?.NomeCompleto}</h1>
      <form onSubmit={handleSubmit} className="member-form">
        <div className="form-grid">
            <div className="form-group">
                <label htmlFor="NomeCompleto">Nome Completo</label>
                <input type="text" id="NomeCompleto" name="NomeCompleto" value={formData?.NomeCompleto || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label htmlFor="Email">Email</label>
                <input type="email" id="Email" name="Email" value={formData?.Email || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label htmlFor="credencialAcesso">Credencial</label>
                <select id="credencialAcesso" name="credencialAcesso" value={formData?.credencialAcesso || ''} onChange={handleChange}>
                    <option value="Membro">Membro</option>
                    <option value="Diretoria">Diretoria</option>
                    <option value="Webmaster">Webmaster</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="statusCadastro">Status do Cadastro</label>
                <select id="statusCadastro" name="statusCadastro" value={formData?.statusCadastro || ''} onChange={handleChange}>
                    <option value="Pendente">Pendente</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Rejeitado">Rejeitado</option>
                </select>
            </div>
             {/* Adicione mais campos aqui conforme necessário */}
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/members')} className="btn btn-secondary">Cancelar</button>
          <button type="submit" className="btn btn-primary">Salvar Alterações</button>
        </div>
      </form>
    </div>
  );
};

export default MemberEditPage;
