import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createLodgeMember } from '../../../../services/memberService';
import MemberForm from './MemberForm';
import './MemberForm.css';

const MemberCreatePage = () => {
  const navigate = useNavigate();

  const handleSave = async (formData) => {
    try {
      await createLodgeMember(formData);
      alert('Membro criado com sucesso!');
      navigate('/admin/members');
    } catch (error) {
      console.error("Erro ao criar membro:", error);
      alert(error.response?.data?.message || "Não foi possível criar o membro.");
    }
  };

  return (
    <div className="member-form-container">
      <h1>Criar Novo Membro</h1>
      <MemberForm onSave={handleSave} isCreating={true} />
    </div>
  );
};

export default MemberCreatePage;
