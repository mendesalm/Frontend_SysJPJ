import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import {
  getMemberById,
  updateMember,
} from "../../../../services/memberService";
import MemberForm from "./MemberForm";
import LoadingOverlay from "./components/LoadingOverlay";
import Modal from "../../../../components/modal/Modal";
import AdminPasswordResetForm from "./components/AdminPasswordResetForm";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../utils/notifications";

const MemberEditPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const fetchMember = useCallback(() => {
    if (memberId) {
      return getMemberById(memberId);
    }
    return Promise.resolve(null);
  }, [memberId]);

  const {
    data, // Busca os dados brutos primeiro
    isLoading,
    error,
  } = useDataFetching(fetchMember);

  // CORREÇÃO: Extrai o objeto do membro, quer ele venha diretamente ou dentro de um array.
  const member = data ? (Array.isArray(data) ? data[0] : data) : null;

  const handleSave = async (data) => {
    try {
      await updateMember(memberId, data);
      showSuccessToast("Membro atualizado com sucesso!");
      navigate("/admin/members");
    } catch (err) {
      showErrorToast("Não foi possível atualizar o membro.");
      console.error(err);
    }
  };

  if (isLoading) {
    return <LoadingOverlay>A carregar dados do membro...</LoadingOverlay>;
  }

  if (error) {
    return (
      <div className="error-message">{`Erro ao carregar dados: ${error}`}</div>
    );
  }

  if (!member) {
    return <div>Membro não encontrado ou falha ao carregar.</div>;
  }

  return (
    <>
      <MemberForm
        initialData={member}
        onSave={handleSave}
        isCreating={false}
        onCancel={() => navigate("/admin/members")}
        onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
      />

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title={`Redefinir Senha para ${member.NomeCompleto}`}
      >
        <AdminPasswordResetForm
          memberId={memberId}
          onFinished={() => setIsPasswordModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default MemberEditPage;
