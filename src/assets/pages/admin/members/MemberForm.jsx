import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { memberValidationSchema } from "../../../../validators/memberValidator.js";
import { consultarCEP } from "../../../../services/cepService.js";
import "../../../styles/FormStyles.css";

const MemberForm = ({ initialData = {}, onSave, isCreating = false }) => {
  const [cepStatus, setCepStatus] = useState(""); // Estado para a mensagem de status do CEP

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch, // Para observar o campo CEP
    setValue, // Para definir os valores dos campos de endereço
  } = useForm({
    resolver: yupResolver(memberValidationSchema),
    context: { isCreating },
    defaultValues: {
      familiares: [],
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "familiares",
  });

  // Observa o campo CEP para acionar a consulta
  const cepValue = watch("Endereco_CEP");

  const handleCepBlur = async () => {
    const cepLimpo = (cepValue || "").replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setCepStatus("");
      return;
    }

    setCepStatus("A consultar...");
    try {
      const data = await consultarCEP(cepLimpo);
      // Preenche os campos do formulário com os dados retornados
      setValue("Endereco_Rua", data.logradouro, { shouldValidate: true });
      setValue("Endereco_Bairro", data.bairro, { shouldValidate: true });
      setValue("Endereco_Cidade", data.localidade, { shouldValidate: true });
      setCepStatus("Endereço preenchido!");
    } catch (error) {
      setCepStatus(error.message);
    }
  };

  useEffect(() => {
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

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      {/* --- Informações de Acesso --- */}
      <fieldset className="form-fieldset">
        <legend>Informações de Acesso</legend>
        <div className="form-grid">
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
          {isCreating && (
            <div className="form-group">
              <label>Senha Inicial</label>
              <input
                type="password"
                {...register("SenhaHash")}
                className={`form-input ${errors.SenhaHash ? "is-invalid" : ""}`}
              />
              {errors.SenhaHash && (
                <p className="form-error-message">{errors.SenhaHash.message}</p>
              )}
            </div>
          )}
          <div className="form-group">
            <label>Credencial</label>
            <select {...register("credencialAcesso")} className="form-select">
              <option value="Membro">Membro</option>
              <option value="Diretoria">Diretoria</option>
              <option value="Webmaster">Webmaster</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select {...register("statusCadastro")} className="form-select">
              <option value="Pendente">Pendente</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Rejeitado">Rejeitado</option>
            </select>
          </div>
        </div>
      </fieldset>

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
              className={`form-input ${errors.CPF ? "is-invalid" : ""}`}
            />
            {errors.CPF && (
              <p className="form-error-message">{errors.CPF.message}</p>
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
          <div className="form-group">
            <label>Naturalidade</label>
            <input
              type="text"
              {...register("Naturalidade")}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Nacionalidade</label>
            <input
              type="text"
              {...register("Nacionalidade")}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Religião</label>
            <input
              type="text"
              {...register("Religiao")}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Nome do Pai</label>
            <input
              type="text"
              {...register("NomePai")}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Nome da Mãe</label>
            <input
              type="text"
              {...register("NomeMae")}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Data de Casamento</label>
            <input
              type="date"
              {...register("DataCasamento")}
              className="form-input"
            />
          </div>
        </div>
      </fieldset>

      {/* --- Endereço --- */}
      <fieldset className="form-fieldset">
        <legend>Endereço</legend>
        <div className="form-grid" style={{ gridTemplateColumns: "1fr 3fr" }}>
          <div className="form-group">
            <label>CEP</label>
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
          <div className="form-group">
            <label>Rua / Avenida</label>
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
          <div className="form-group full-width">
            <label>Local de Trabalho</label>
            <input
              type="text"
              {...register("LocalTrabalho")}
              className="form-input"
            />
          </div>
        </div>
      </fieldset>

      {/* --- Dados Maçónicos --- */}
      <fieldset className="form-fieldset">
        <legend>Dados Maçónicos</legend>
        <div className="form-grid">
          <div className="form-group">
            <label>CIM</label>
            <input type="text" {...register("CIM")} className="form-input" />
          </div>
          <div className="form-group">
            <label>Situação</label>
            <select {...register("Situacao")} className="form-select">
              <option value="Ativo">Ativo</option>
              <option value="Licenciado">Licenciado</option>
              <option value="Adormecido">Adormecido</option>
            </select>
          </div>
          <div className="form-group">
            <label>Grau</label>
            <select {...register("Graduacao")} className="form-select">
              <option value="Aprendiz">Aprendiz</option>
              <option value="Companheiro">Companheiro</option>
              <option value="Mestre">Mestre</option>
              <option value="Mestre Instalado">Mestre Instalado</option>
            </select>
          </div>
          <div className="form-group">
            <label>Grau Filosófico</label>
            <input
              type="text"
              {...register("grauFilosofico")}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Data de Iniciação</label>
            <input
              type="date"
              {...register("DataIniciacao")}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Data de Elevação</label>
            <input
              type="date"
              {...register("DataElevacao")}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Data de Exaltação</label>
            <input
              type="date"
              {...register("DataExaltacao")}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Data de Filiação</label>
            <input
              type="date"
              {...register("DataFiliacao")}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Data de Regularização</label>
            <input
              type="date"
              {...register("DataRegularizacao")}
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
              <label>Nome do Familiar</label>
              <input
                {...register(`familiares.${index}.nomeCompleto`)}
                className={`form-input ${
                  errors.familiares?.[index]?.nomeCompleto ? "is-invalid" : ""
                }`}
              />
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
            </div>
            <div className="form-group">
              <label>Data de Nasc.</label>
              <input
                type="date"
                {...register(`familiares.${index}.dataNascimento`)}
                className={`form-input ${
                  errors.familiares?.[index]?.dataNascimento ? "is-invalid" : ""
                }`}
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="btn btn-secondary"
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

      <div className="form-actions">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "A salvar..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
};

export default MemberForm;
