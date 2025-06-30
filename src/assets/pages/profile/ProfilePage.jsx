import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { memberValidationSchema } from "../../../validators/memberValidator";
import { useAuth } from "../../../hooks/useAuth";
import { updateMember } from "../../../services/memberService";
import { consultarCEP } from "../../../services/cepService.js";
import FormPageLayout from "../../../components/layout/FormPageLayout";
import "../../styles/FormStyles.css";
import "../../styles/TableStyles.css";
// ATUALIZADO: Importa o componente reutilizável de dados pessoais
import PersonalDataFields from "../admin/members/components/PersonalDataFields";

const ProfilePage = () => {
  const { user, loading: authLoading, checkUserStatus } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cepStatus, setCepStatus] = useState("");

  const methods = useForm({
    resolver: yupResolver(memberValidationSchema),
    context: { isCreating: false },
    defaultValues: {
      familiares: [],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = methods;

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

  const onSubmit = async (data) => {
    setError("");
    setSuccessMessage("");
    try {
      const formData = new FormData();
      for (const key in data) {
        if (key === "FotoPessoal") {
          if (data.FotoPessoal && data.FotoPessoal[0]) {
            formData.append(key, data.FotoPessoal[0]);
          }
        } else if (key === "familiares") {
          formData.append(key, JSON.stringify(data[key] || []));
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }

      await updateMember(user.id, formData);
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
      <p>Mantenha os seus dados sempre atualizados.</p>
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
    <FormProvider {...methods}>
      <FormPageLayout title="Meu Perfil" actionsComponent={<ActionButtons />}>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form
          id="profile-form"
          onSubmit={handleSubmit(onSubmit)}
          className="form-container"
        >
          {/* ATUALIZADO: O formulário agora usa o componente reutilizável para consistência */}
          <PersonalDataFields
            register={register}
            errors={errors}
            watch={watch}
            initialPhoto={user?.FotoPessoal_Caminho}
          />

          <fieldset className="form-fieldset">
            <legend>Familiares</legend>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="form-grid familiar-row"
                style={{
                  alignItems: "flex-end",
                  marginBottom: "1rem",
                  borderBottom: "1px solid var(--cor-borda-input)",
                  paddingBottom: "1rem",
                }}
              >
                <div className="form-group">
                  <label>Nome</label>
                  <input
                    {...register(`familiares.${index}.nomeCompleto`)}
                    className={`form-input ${
                      errors.familiares?.[index]?.nomeCompleto
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {errors.familiares?.[index]?.nomeCompleto && (
                    <p className="form-error-message">
                      {errors.familiares[index].nomeCompleto.message}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label>Parentesco</label>
                  <select
                    {...register(`familiares.${index}.parentesco`)}
                    className={`form-select ${
                      errors.familiares?.[index]?.parentesco ? "is-invalid" : ""
                    }`}
                  >
                    <option value="Cônjuge">Cônjuge</option>
                    <option value="Esposa">Esposa</option>
                    <option value="Filho">Filho</option>
                    <option value="Filha">Filha</option>
                  </select>
                  {errors.familiares?.[index]?.parentesco && (
                    <p className="form-error-message">
                      {errors.familiares[index].parentesco.message}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label>Data de Nasc.</label>
                  <input
                    type="date"
                    {...register(`familiares.${index}.dataNascimento`)}
                    className={`form-input ${
                      errors.familiares?.[index]?.dataNascimento
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {errors.familiares?.[index]?.dataNascimento && (
                    <p className="form-error-message">
                      {errors.familiares[index].dataNascimento.message}
                    </p>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="btn"
                    style={{ backgroundColor: "#b91c1c" }}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                append({
                  nomeCompleto: "",
                  parentesco: "Filho",
                  dataNascimento: "",
                })
              }
              className="btn btn-secondary"
              style={{ marginTop: "1rem" }}
            >
              + Adicionar Familiar
            </button>
          </fieldset>

          <fieldset className="form-fieldset">
            <legend>Endereço</legend>
            <div
              className="form-grid"
              style={{ gridTemplateColumns: "1fr 3fr" }}
            >
              <div className="form-group">
                <label>CEP</label>
                <div>
                  <input
                    type="text"
                    {...register("Endereco_CEP")}
                    className="form-input"
                    onBlur={handleCepBlur}
                  />
                  {cepStatus && (
                    <small
                      style={{
                        color: "var(--cor-foco-input)",
                        marginTop: "5px",
                      }}
                    >
                      {cepStatus}
                    </small>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Rua</label>
                <input
                  type="text"
                  {...register("Endereco_Rua")}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Número</label>
                <input
                  type="text"
                  {...register("Endereco_Numero")}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Bairro</label>
                <input
                  type="text"
                  {...register("Endereco_Bairro")}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Cidade</label>
                <input
                  type="text"
                  {...register("Endereco_Cidade")}
                  className="form-input"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="form-fieldset">
            <legend>Dados Maçônicos</legend>
            <p>Esta secção apenas pode ser editada pela administração.</p>
            {/* Campos desabilitados aqui */}
          </fieldset>

          <fieldset className="form-fieldset">
            <legend>Dados Profissionais</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>Formação Académica</label>
                <input
                  type="text"
                  {...register("FormacaoAcademica")}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Ocupação/Profissão</label>
                <input
                  type="text"
                  {...register("Ocupacao")}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Local de Trabalho</label>
                <input
                  type="text"
                  {...register("LocalTrabalho")}
                  className="form-input"
                />
              </div>
            </div>
          </fieldset>
        </form>
      </FormPageLayout>
    </FormProvider>
  );
};

export default ProfilePage;
