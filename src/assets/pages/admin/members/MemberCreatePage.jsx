import React from "react";
import { useNavigate } from "react-router-dom";
import { createMember } from "../../../../services/memberService";
import MemberForm from "./MemberForm";
import "../../../styles/FormStyles.css";

const initialData = {}; // Define stable empty object

const MemberCreatePage = () => {
  const navigate = useNavigate();

  const handleSave = async (formData) => {
    try {
      await createMember(formData);
      alert("Membro criado com sucesso!");
      navigate("/admin/members");
    } catch (error) {
      console.error("Erro ao criar membro:", error);
      alert(
        error.response?.data?.message || "Não foi possível criar o membro."
      );
    }
  };

  return (
    <div className="member-form-container">
      <h1>Criar Novo Membro</h1>
      <MemberForm onSave={handleSave} isCreating={true} initialData={initialData} />
    </div>
  );
};

export default MemberCreatePage;
