import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { memberValidationSchema } from "../../../../validators/memberValidator.js";
import { consultarCEP } from "../../../../services/cepService.js";
import FormPageLayout from "../../../../components/layout/FormPageLayout.jsx";
import "../../../styles/FormStyles.css";

// 1. IMPORTAMOS NOSSOS NOVOS COMPONENTES DE FORMULÁRIO
import PersonalDataFields from "./components/PersonalDataFields.jsx";
import FamilyDataFields from "./components/FamilyDataFields.jsx";
import AddressFields from "./components/AddressFields.jsx";
import MasonicDataFields from "./components/MasonicDataFields.jsx";
import ProfessionalDataFields from "./components/ProfessionalDataFields.jsx";

// Importamos apenas as constantes necessárias para a lógica deste componente
import {
  CREDENCIAIS,
  STATUS_CADASTRO,
} from "../../../../constants/userConstants";

const MemberForm = ({
  initialData = {},
  onSave,
  isCreating = false,
  onCancel,
}) => {
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
    context: { isCreating },
    defaultValues: { familiares: [], ...initialData },
  });

  // A lógica do useFieldArray permanece aqui, pois controla o estado do formulário
  const { fields, append, remove } = useFieldArray({
    control,
    name: "familiares",
  });

  const cepValue = watch("Endereco_CEP");

  // A lógica de busca de CEP também permanece no componente pai
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

  useEffect(() => {
    // A lógica de formatação de dados para popular o formulário também fica aqui
    const formattedData = {
      ...initialData,
      DataNascimento: initialData.DataNascimento
        ? new Date(initialData.DataNascimento).toISOString().split("T")[0]
        : "",
      DataCasamento: initialData.DataCasamento
        ? new Date(initialData.DataCasamento).toISOString().split("T")[0]
        : "",
      DataIniciacao: initialData.DataIniciacao
        ? new Date(initialData.DataIniciacao).toISOString().split("T")[0]
        : "",
      DataElevacao: initialData.DataElevacao
        ? new Date(initialData.DataElevacao).toISOString().split("T")[0]
        : "",
      DataExaltacao: initialData.DataExaltacao
        ? new Date(initialData.DataExaltacao).toISOString().split("T")[0]
        : "",
      DataFiliacao: initialData.DataFiliacao
        ? new Date(initialData.DataFiliacao).toISOString().split("T")[0]
        : "",
      DataRegularizacao: initialData.DataRegularizacao
        ? new Date(initialData.DataRegularizacao).toISOString().split("T")[0]
        : "",
      familiares: (initialData.familiares || []).map((f) => ({
        ...f,
        dataNascimento: f.dataNascimento
          ? new Date(f.dataNascimento).toISOString().split("T")[0]
          : "",
      })),
    };
    reset(formattedData);
  }, [initialData, reset]);

  const ActionButtons = () => (
    <div className="actions-box">
      <h3>Ações</h3>
      <p>
        Reveja os dados com atenção antes de salvar. Todos os campos
        obrigatórios devem ser preenchidos.
      </p>
      <button
        type="submit"
        form="member-form"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "A salvar..." : "Salvar Alterações"}
      </button>
      <button type="button" onClick={onCancel} className="btn btn-secondary">
        Cancelar
      </button>
    </div>
  );

  return (
    <FormPageLayout
      title={isCreating ? "Criar Novo Membro" : "Editar Membro"}
      actionsComponent={<ActionButtons />}
    >
      <form
        id="member-form"
        onSubmit={handleSubmit(onSave)}
        className="form-container"
      >
        {/* 2. SUBSTITUÍMOS OS BLOCOS JSX PELOS NOSSOS COMPONENTES */}

        <PersonalDataFields register={register} errors={errors} />

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

        <MasonicDataFields register={register} errors={errors} />

        <ProfessionalDataFields register={register} />

        {/* A seção de Acesso é específica deste formulário, então ela permanece aqui */}
        <fieldset className="form-fieldset">
          <legend>Informações de Acesso</legend>
          <div className="form-grid">
            <div className="form-group">
              <label>Credencial</label>
              <select {...register("credencialAcesso")} className="form-select">
                {CREDENCIAIS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select {...register("statusCadastro")} className="form-select">
                {STATUS_CADASTRO.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {isCreating && (
              <div className="form-group">
                <label>Senha Inicial</label>
                <input
                  type="password"
                  {...register("SenhaHash")}
                  className={`form-input ${
                    errors.SenhaHash ? "is-invalid" : ""
                  }`}
                />
                {errors.SenhaHash && (
                  <p className="form-error-message">
                    {errors.SenhaHash.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </fieldset>
      </form>
    </FormPageLayout>
  );
};

export default MemberForm;
