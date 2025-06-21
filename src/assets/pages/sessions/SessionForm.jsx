import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAllMembers } from "../../..//services/memberService";
import { GRAUS, TIPOS_SESSAO } from "../../../constants/userConstants";

const SessionForm = ({ onSave, onCancel, isSubmitting }) => {
  // A variável 'errors' agora será utilizada
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipoResponsabilidadeJantar: "Sequencial",
    },
  });

  const [members, setMembers] = useState([]);
  const tipoResponsabilidade = watch("tipoResponsabilidadeJantar");

  useEffect(() => {
    getAllMembers({ limit: 999 })
      .then((res) => {
        const memberData = Array.isArray(res.data) ? res.data : [];
        setMembers(memberData);
      })
      .catch((err) => console.error("Erro ao buscar membros", err));
  }, []);

  return (
    <form onSubmit={handleSubmit(onSave)} className="form-container">
      <div className="form-grid">
        <div className="form-group">
          <label>Data da Sessão</label>
          {/* Adicionada a validação e a mensagem de erro */}
          <input
            type="date"
            {...register("dataSessao", {
              required: "A data da sessão é obrigatória.",
            })}
            className={`form-input ${errors.dataSessao ? "is-invalid" : ""}`}
          />
          {errors.dataSessao && (
            <p className="form-error-message">{errors.dataSessao.message}</p>
          )}
        </div>
        <div className="form-group">
          <label>Tipo de Sessão</label>
          <select
            {...register("tipoSessao", { required: true })}
            className="form-select"
          >
            {TIPOS_SESSAO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Grau (Subtipo)</label>
          <select
            {...register("subtipoSessao", { required: true })}
            className="form-select"
          >
            {GRAUS.map((grau) => (
              <option key={grau} value={grau}>
                {grau}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="form-fieldset" style={{ marginTop: "1.5rem" }}>
        <legend>Responsabilidade pelo Jantar</legend>
        <div className="form-group">
          <label>Definir Responsável</label>
          <select
            {...register("tipoResponsabilidadeJantar")}
            className="form-select"
          >
            <option value="Sequencial">Automático (Próximo da Escala)</option>
            <option value="Manual">Designação Manual</option>
            <option value="Institucional">
              Institucional (Oferecido pela Loja)
            </option>
          </select>
        </div>

        {tipoResponsabilidade === "Manual" && (
          <div className="form-group">
            <label>Selecione o Responsável</label>
            {/* Adicionada a validação e a mensagem de erro */}
            <select
              {...register("responsavelJantarLodgeMemberId", {
                required: "É obrigatório selecionar um responsável.",
              })}
              className={`form-select ${
                errors.responsavelJantarLodgeMemberId ? "is-invalid" : ""
              }`}
            >
              <option value="">-- Escolha um Irmão --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.NomeCompleto}
                </option>
              ))}
            </select>
            {errors.responsavelJantarLodgeMemberId && (
              <p className="form-error-message">
                {errors.responsavelJantarLodgeMemberId.message}
              </p>
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
          {isSubmitting ? "Salvando..." : "Salvar Sessão"}
        </button>
      </div>
    </form>
  );
};

export default SessionForm;
