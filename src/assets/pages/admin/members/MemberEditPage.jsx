import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMemberById, updateMember } from '../../../../services/memberService';
import MemberForm from './MemberForm';
import './MemberForm.css';

const MemberEditPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMember = useCallback(async () => {
    // Impede a chamada à API se o memberId não for um número válido
    if (!memberId || isNaN(parseInt(memberId))) {
        setIsLoading(false);
        // Opcional: redirecionar ou mostrar erro
        navigate('/admin/members'); 
        return;
    }
    try {
      const response = await getMemberById(memberId);
      setMemberData(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do membro:", error);
    } finally {
      setIsLoading(false);
    }
  }, [memberId, navigate]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  const handleSave = async (formData) => {
    try {
      await updateMember(memberId, formData);
      alert('Membro atualizado com sucesso!');
      navigate('/admin/members');
    } catch (error) {
      console.error("Erro ao atualizar membro:", error);
      alert(error.response?.data?.message || "Não foi possível salvar as alterações.");
    }
  };

  if (isLoading) return <div className="member-form-container">A carregar...</div>;

  // Só renderiza o formulário se tiver dados
  return (
    <div className="member-form-container">
      <h1>Editar Membro</h1>
      {memberData && <MemberForm initialData={memberData} onSave={handleSave} />}
    </div>
  );
};

export default MemberEditPage;
