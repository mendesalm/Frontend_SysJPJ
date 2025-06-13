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

// --- INÍCIO DA MODIFICAÇÃO: Importando a constante de parentesco ---
import { PARENTESCO_OPTIONS } from "../../../constants/formConstants";
// --- FIM DA MODIFICAÇÃO ---

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
        {/* --- Dados Pessoais --- */}
        <fieldset className="form-fieldset">
          <legend>Dados Pessoais</legend>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Nome Completo</label>
              <input
                type="text"
                {...register("NomeCompleto")}
                className={`form-input ${
                  errors.NomeCompleto ? "is-invalid" : ""
                }`}
              />
              {errors.NomeCompleto && (
                <p className="form-error-message">
                  {errors.NomeCompleto.message}
                </p>
              )}
            </div>
            <div className="form-group">
              <label>CPF</label>
              <input
                type="text"
                {...register("CPF")}
                className="form-input"
                disabled
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                {...register("Email")}
                className={`form-input ${errors.Email ? "is-invalid" : ""}`}
              />
              {errors.Email && (
                <p className="form-error-message">{errors.Email.message}</p>
              )}
            </div>
            <div className="form-group">
              <label>Identidade (RG)</label>
              <input
                type="text"
                {...register("Identidade")}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Data de Nasc.</label>
              <input
                type="date"
                {...register("DataNascimento")}
                className={`form-input ${
                  errors.DataNascimento ? "is-invalid" : ""
                }`}
              />
              {errors.DataNascimento && (
                <p className="form-error-message">
                  {errors.DataNascimento.message}
                </p>
              )}
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                {...register("Telefone")}
                className="form-input"
              />
            </div>
          </div>
        </fieldset>

        {/* --- Dados Familiares --- */}
        <fieldset className="form-fieldset">
          <legend>Familiares</legend>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="form-grid"
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
                    errors.familiares?.[index]?.nomeCompleto ? "is-invalid" : ""
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
                {/* --- MODIFICAÇÃO: Usando a constante para Parentesco --- */}
                <select
                  {...register(`familiares.${index}.parentesco`)}
                  className={`form-select ${
                    errors.familiares?.[index]?.parentesco ? "is-invalid" : ""
                  }`}
                >
                  {PARENTESCO_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
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

        {/* --- Endereço --- */}
        <fieldset className="form-fieldset">
          <legend>Endereço</legend>
          <div className="form-grid" style={{ gridTemplateColumns: "1fr 3fr" }}>
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
                    style={{ color: "var(--cor-foco-input)", marginTop: "5px" }}
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

        {/* --- Dados Maçônicos (A maioria desabilitada para o usuário) --- */}
        <fieldset className="form-fieldset">
          <legend>Dados Maçônicos</legend>
          <div className="form-grid">
            <div className="form-group">
              <label>CIM</label>
              <input
                type="text"
                {...register("CIM")}
                disabled
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Situação</label>
              <input
                type="text"
                {...register("Situacao")}
                disabled
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Grau</label>
              <input
                type="text"
                {...register("Graduacao")}
                disabled
                className="form-input"
              />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Data de Iniciação</label>
              <input
                type="date"
                {...register("DataIniciacao")}
                disabled
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Data de Elevação</label>
              <input
                type="date"
                {...register("DataElevacao")}
                disabled
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Data de Exaltação</label>
              <input
                type="date"
                {...register("DataExaltacao")}
                disabled
                className="form-input"
              />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Data de Filiação</label>
              <input
                type="date"
                {...register("DataFiliacao")}
                disabled
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Data de Regularização</label>
              <input
                type="date"
                {...register("DataRegularizacao")}
                disabled
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Grau Filosófico</label>
              <input
                type="text"
                {...register("grauFilosofico")}
                className="form-input"
              />
            </div>
          </div>
        </fieldset>

        {/* --- Dados Profissionais --- */}
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
  );
};

export default ProfilePage;
