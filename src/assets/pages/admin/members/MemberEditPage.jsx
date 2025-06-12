import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
      navigate("/admin/members");
    } catch (err) {
      console.error("Erro ao atualizar membro:", err);
      setError(
        err.response?.data?.message ||
          "Ocorreu um erro ao salvar as alterações."
      );
    }
  };

  if (error)
    return (
      <div className="table-page-container">
        <p className="error-message">{error}</p>
      </div>
    );
  if (!initialData)
    return <div className="table-page-container">A carregar...</div>;

  return (
    // A página agora simplesmente renderiza o MemberForm, que contém toda a sua própria lógica de layout.
    <MemberForm
      initialData={initialData}
      onSave={handleSave}
      isCreating={false}
      onCancel={() => navigate("/admin/members")}
    />
  );
};

export default MemberEditPage;
