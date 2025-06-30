import React, { useEffect, useState, useMemo } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { memberValidationSchema } from "../../../../validators/memberValidator.js";
import { consultarCEP } from "../../../../services/cepService.js";
import { formatDateForInput } from "../../../../utils/dateUtils.js";
import FormPageLayout from "../../../../components/layout/FormPageLayout.jsx";
import "../../../styles/FormStyles.css";

// Importando os componentes de formulário reutilizáveis
import PersonalDataFields from "./components/PersonalDataFields.jsx";
import FamilyDataFields from "./components/FamilyDataFields.jsx";
import AddressFields from "./components/AddressFields.jsx";
import MasonicDataFields from "./components/MasonicDataFields.jsx";
import ProfessionalDataFields from "./components/ProfessionalDataFields.jsx";
import HistoricoCargos from "./components/HistoricoCargos";
import {
  CREDENCIAIS,
  STATUS_CADASTRO,
} from "../../../../constants/userConstants";

const MemberForm = ({
  initialData = {},
  onSave,
  isCreating = false,
  onCancel,
  onOpenPasswordModal,
}) => {
  const [cepStatus, setCepStatus] = useState("");

  const methods = useForm({
    resolver: yupResolver(memberValidationSchema),
    context: { isCreating },
    defaultValues: initialData,
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

  // Função atualizada para processar e enviar o formulário como FormData
  const processAndSave = (data) => {
    const formData = new FormData();

    // Adiciona todos os campos ao FormData
    for (const key in data) {
      if (key === "FotoPessoal") {
        if (data.FotoPessoal && data.FotoPessoal[0]) {
          formData.append(key, data.FotoPessoal[0]);
        }
      } else if (key === "familiares") {
        // Envia familiares como uma string JSON para compatibilidade com o backend
        formData.append(key, JSON.stringify(data[key]));
      } else if (
        (key === "DataCasamento" ||
          key === "DataFiliacao" ||
          key === "DataRegularizacao") &&
        data[key] === ""
      ) {
        // Se o campo de data estiver vazio, envie null
        formData.append(key, null);
      } else if (key === "SenhaHash" && !isCreating) {
        // Não envia SenhaHash se não estiver criando um novo membro
        continue;
      } else {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
    }

    // Log the formData content for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
    }
    onSave(formData);
  };

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

  const memoizedInitialData = useMemo(() => initialData, [initialData]);

  useEffect(() => {
    const formattedData = {
      ...memoizedInitialData,
      DataNascimento: formatDateForInput(memoizedInitialData.DataNascimento),
      DataCasamento: formatDateForInput(memoizedInitialData.DataCasamento),
      DataIniciacao: formatDateForInput(memoizedInitialData.DataIniciacao),
      DataElevacao: formatDateForInput(memoizedInitialData.DataElevacao),
      DataExaltacao: formatDateForInput(memoizedInitialData.DataExaltacao),
      DataFiliacao: formatDateForInput(memoizedInitialData.DataFiliacao),
      DataRegularizacao: formatDateForInput(memoizedInitialData.DataRegularizacao),
      familiares: (memoizedInitialData.familiares || []).map((f) => ({
        ...f,
        dataNascimento: formatDateForInput(f.dataNascimento),
      })),
    };
    reset(formattedData);
  }, [memoizedInitialData, reset]);

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
      {!isCreating && (
        <button
          type="button"
          onClick={onOpenPasswordModal}
          className="btn btn-secondary"
        >
          Redefinir Senha
        </button>
      )}
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
      <FormProvider {...methods}>
        <form
          id="member-form"
          onSubmit={handleSubmit(processAndSave)}
          className="form-container"
        >
          {/* O componente PersonalDataFields agora recebe as props 'watch' e 'initialPhoto' */}
          <PersonalDataFields
            register={register}
            errors={errors}
            watch={watch}
            initialPhoto={initialData?.FotoPessoal_Caminho}
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
            control={control}
            register={register}
            errors={errors}
          />
          <ProfessionalDataFields control={control} register={register} />

          {!isCreating && initialData.id && (
            <HistoricoCargos memberId={initialData.id} />
          )}

          <fieldset className="form-fieldset">
            <legend>Informações de Acesso</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>Credencial</label>
                <select
                  {...register("credencialAcesso")}
                  className="form-select"
                >
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
      </FormProvider>
    </FormPageLayout>
  );
};

export default MemberForm;
