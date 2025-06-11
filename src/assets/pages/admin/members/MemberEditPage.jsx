import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
// CORREÇÃO: A importação agora usa 'getMemberById'.
import {
  getMemberById,
  updateMember,
} from "../../../../services/memberService";
import MemberForm from "./MemberForm";

const MemberEditPage = () => {
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState("");
  const { memberId } = useParams();
  const navigate = useNavigate();

  const fetchMemberData = useCallback(async () => {
    try {
      // CORREÇÃO: A função chamada agora é 'getMemberById'.
      const response = await getMemberById(memberId);
      setInitialData(response.data);
    } catch (err) {
      console.error("Erro ao carregar dados do membro:", err);
      setError("Não foi possível carregar os dados para edição.");
    }
  }, [memberId]);

  useEffect(() => {
    fetchMemberData();
  }, [fetchMemberData]);

  const handleSave = async (formData) => {
    try {
      await updateMember(memberId, formData);
      navigate("/admin/members"); // Redireciona para a lista após salvar
    } catch (err) {
      console.error("Erro ao atualizar membro:", err);
      setError(
        err.response?.data?.message ||
          "Ocorreu um erro ao salvar as alterações."
      );
    }
  };

  if (error) {
    return (
      <div className="table-page-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="table-page-container">A carregar dados do membro...</div>
    );
  }

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Editar Membro</h1>
      </div>
      <MemberForm
        initialData={initialData}
        onSave={handleSave}
        isCreating={false}
      />
    </div>
  );
};

export default MemberEditPage;
