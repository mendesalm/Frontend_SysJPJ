import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { memberValidationSchema } from "../../../validators/memberValidator";
import { useAuth } from "../../../hooks/useAuth";
import { updateMyProfile } from "../../../services/memberService";
import { consultarCEP } from "../../../services/cepService.js";
import FormPageLayout from "../../../components/layout/FormPageLayout";
import "../../styles/FormStyles.css";
import "../../styles/TableStyles.css";

// 1. IMPORTAMOS OS NOSSOS COMPONENTES DE FORMULÁRIO
import PersonalDataFields from "../admin/members/components/PersonalDataFields.jsx";
import FamilyDataFields from "../admin/members/components/FamilyDataFields.jsx";
import AddressFields from "../admin/members/components/AddressFields.jsx";
import MasonicDataFields from "../admin/members/components/MasonicDataFields.jsx";
import ProfessionalDataFields from "../admin/members/components/ProfessionalDataFields.jsx";

// A importação de constantes de formulário não é mais necessária aqui
// import { PARENTESCO_OPTIONS } from "../../../constants/formConstants";

const ProfilePage = () => {
  const { user, loading: authLoading, checkUserStatus } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cepStatus, setCepStatus] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(memberValidationSchema),
    context: { isCreating: false },
    defaultValues: {
      familiares: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "familiares",
  });
  const cepValue = watch("Endereco_CEP");

  useEffect(() => {
    if (user) {
      const formattedData = {
        ...user,
        DataNascimento: user.DataNascimento
          ? new Date(user.DataNascimento).toISOString().split("T")[0]
          : "",
        DataCasamento: user.DataCasamento
          ? new Date(user.DataCasamento).toISOString().split("T")[0]
          : "",
        DataIniciacao: user.DataIniciacao
          ? new Date(user.DataIniciacao).toISOString().split("T")[0]
          : "",
        DataElevacao: user.DataElevacao
          ? new Date(user.DataElevacao).toISOString().split("T")[0]
          : "",
        DataExaltacao: user.DataExaltacao
          ? new Date(user.DataExaltacao).toISOString().split("T")[0]
          : "",
        familiares: (user.familiares || []).map((f) => ({
          ...f,
          dataNascimento: f.dataNascimento
            ? new Date(f.dataNascimento).toISOString().split("T")[0]
            : "",
        })),
      };
      reset(formattedData);
    }
  }, [user, reset]);

  const handleCepBlur = async () => {
    const cepLimpo = (cepValue || "").replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setCepStatus("");
      return;
    }
    setCepStatus("A consultar...");
    try {
      const data = await consultarCEP(cepLimpo);
      setValue("Endereco_Rua", data.logradouro, { shouldValidate: true });
      setValue("Endereco_Bairro", data.bairro, { shouldValidate: true });
      setValue("Endereco_Cidade", data.localidade, { shouldValidate: true });
      setCepStatus("Endereço preenchido!");
    } catch (error) {
      setCepStatus(error.message);
    }
  };

  const onSubmit = async (formData) => {
    setError("");
    setSuccessMessage("");
    try {
      await updateMyProfile(formData);
      await checkUserStatus();
      setSuccessMessage("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erro ao atualizar o perfil:", err);
      setError(
        err.response?.data?.message || "Não foi possível salvar as alterações."
      );
    }
  };

  const ActionButtons = () => (
    <div className="actions-box">
      <h3>Ações</h3>
      <p>
        Mantenha os seus dados sempre atualizados. Clique em "Salvar" para
        confirmar as alterações.
      </p>
      <button
        type="submit"
        form="profile-form"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "A salvar..." : "Salvar Alterações"}
      </button>
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="btn btn-secondary"
      >
        Voltar ao Dashboard
      </button>
    </div>
  );

  if (authLoading) {
    return <div className="table-page-container">A carregar perfil...</div>;
  }

  return (
    <FormPageLayout title="Meu Perfil" actionsComponent={<ActionButtons />}>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form
        id="profile-form"
        onSubmit={handleSubmit(onSubmit)}
        className="form-container"
      >
        {/* 2. OS BLOCOS DE FORMULÁRIO SÃO SUBSTITUÍDOS PELOS COMPONENTES */}
        {/* Note o uso da prop `isReadOnly={true}` nos componentes que precisam ter campos desabilitados */}

        <PersonalDataFields
          register={register}
          errors={errors}
          isReadOnly={true}
        />

        <FamilyDataFields
          fields={fields}
          register={register}
          errors={errors}
          remove={remove}
          append={append}
          control={control}
        />

        <AddressFields
          register={register}
          handleCepBlur={handleCepBlur}
          cepStatus={cepStatus}
        />

        <MasonicDataFields
          register={register}
          errors={errors}
          isReadOnly={true}
        />

        <ProfessionalDataFields register={register} />
      </form>
    </FormPageLayout>
  );
};

export default ProfilePage;
