// src/assets/pages/locacoes/LocacaoForm.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { locacaoValidationSchema } from "~/validators/locacaoValidator";
import { getAllMembers } from "~/services/memberService";
import "~/assets/styles/FormStyles.css";

const LocacaoForm = ({ onSave, onCancel }) => {
  const [members, setMembers] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(locacaoValidationSchema),
    defaultValues: {
      tipoLocatario: "membro",
      ehNaoOneroso: false,
    },
  });

  const tipoLocatario = watch("tipoLocatario");
  const ehNaoOneroso = watch("ehNaoOneroso");

  useEffect(() => {
    getAllMembers({ limit: 1000 })
      .then((res) => setMembers(res.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (tipoLocatario === "membro") {
      setValue("nomeLocatarioExterno", "");
      setValue("contatoLocatarioExterno", "");
    } else {
      setValue("lodgeMemberId", null);
    }
  }, [tipoLocatario, setValue]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="form-container">
      <div className="form-group">
        <label>Finalidade da Locação</label>
        <input
          {...register("finalidade")}
          className={`form-input ${errors.finalidade ? "is-invalid" : ""}`}
        />
        {errors.finalidade && (
          <p className="form-error-message">{errors.finalidade.message}</p>
        )}
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Data e Hora de Início</label>
          <input
            type="datetime-local"
            {...register("dataInicio")}
            className={`form-input ${errors.dataInicio ? "is-invalid" : ""}`}
          />
          {errors.dataInicio && (
            <p className="form-error-message">{errors.dataInicio.message}</p>
          )}
        </div>
        <div className="form-group">
          <label>Data e Hora de Término</label>
          <input
            type="datetime-local"
            {...register("dataFim")}
            className={`form-input ${errors.dataFim ? "is-invalid" : ""}`}
          />
          {errors.dataFim && (
            <p className="form-error-message">{errors.dataFim.message}</p>
          )}
        </div>
      </div>

      <fieldset className="form-fieldset">
        <legend>Informações do Locatário</legend>
        <div className="form-group">
          <select {...register("tipoLocatario")} className="form-select">
            <option value="membro">Membro da Loja</option>
            <option value="externo">Locatário Externo</option>
          </select>
        </div>
        {tipoLocatario === "membro" ? (
          <div className="form-group">
            <label>Selecione o Membro</label>
            <select
              {...register("lodgeMemberId")}
              className={`form-select ${
                errors.lodgeMemberId ? "is-invalid" : ""
              }`}
            >
              <option value="">-- Selecione --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.NomeCompleto}
                </option>
              ))}
            </select>
            {errors.lodgeMemberId && (
              <p className="form-error-message">
                {errors.lodgeMemberId.message}
              </p>
            )}
          </div>
        ) : (
          <div className="form-grid">
            <div className="form-group">
              <label>Nome Completo do Responsável</label>
              <input
                {...register("nomeLocatarioExterno")}
                className={`form-input ${
                  errors.nomeLocatarioExterno ? "is-invalid" : ""
                }`}
              />
              {errors.nomeLocatarioExterno && (
                <p className="form-error-message">
                  {errors.nomeLocatarioExterno.message}
                </p>
              )}
            </div>
            <div className="form-group">
              <label>Telefone de Contato</label>
              <input
                {...register("contatoLocatarioExterno")}
                className={`form-input ${
                  errors.contatoLocatarioExterno ? "is-invalid" : ""
                }`}
              />
              {errors.contatoLocatarioExterno && (
                <p className="form-error-message">
                  {errors.contatoLocatarioExterno.message}
                </p>
              )}
            </div>
          </div>
        )}
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Valores</legend>
        <div className="form-group-inline">
          <input
            type="checkbox"
            {...register("ehNaoOneroso")}
            id="ehNaoOneroso"
          />
          <label htmlFor="ehNaoOneroso">Locação não onerosa (sem custos)</label>
        </div>
        {!ehNaoOneroso && (
          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label>Valor da Locação (R$)</label>
            <input
              type="number"
              step="0.01"
              {...register("valor")}
              className={`form-input ${errors.valor ? "is-invalid" : ""}`}
            />
            {errors.valor && (
              <p className="form-error-message">{errors.valor.message}</p>
            )}
          </div>
        )}
      </fieldset>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "A enviar..." : "Enviar Solicitação"}
        </button>
      </div>
    </form>
  );
};

export default LocacaoForm;
