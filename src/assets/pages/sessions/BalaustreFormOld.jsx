import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { balaustreValidationSchema } from "../../../validators/balaustreValidator";
import "../../../assets/styles/FormStyles.css";

const BalaustreForm = ({
  formId,
  initialData,
  onSave,
  onCancel,
  isSubmitting,
  readOnly = false, // Add readOnly prop with default false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(balaustreValidationSchema),
    defaultValues: { Escrutinio: "Não houve", ...(initialData || {}) },
  });

  useEffect(() => {
    if (initialData) {
      reset({ Escrutinio: "Não houve", ...initialData });
    } else {
      reset({ Escrutinio: "Não houve" });
    }
  }, [initialData, reset]);

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSave)}
      className="form-container"
    >
      <fieldset className="form-fieldset">
        <legend>Detalhes do Balaústre</legend>
        <div className="form-grid">
          <div className="form-group">
            <label>Número do Balaústre</label>
            <input
              {...register("NumeroBalaustre")}
              className={`form-input ${
                errors.NumeroBalaustre ? "is-invalid" : ""
              }`}
              disabled={readOnly}
            />
            {errors.NumeroBalaustre && (
              <p className="form-error-message">
                {errors.NumeroBalaustre.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Classe da Sessão</label>
            <input
              {...register("ClasseSessao")}
              className={`form-input ${
                errors.ClasseSessao ? "is-invalid" : ""
              }`}
              disabled={readOnly}
            />
            {errors.ClasseSessao && (
              <p className="form-error-message">
                {errors.ClasseSessao.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Balaústre Anterior teve Emendas?</label>
            <select
              {...register("EmendasBalaustreAnterior")}
              className={`form-select ${
                errors.EmendasBalaustreAnterior ? "is-invalid" : ""
              }`}
              disabled={readOnly}
            >
              <option value="sem">Sem Emendas</option>
              <option value="com">Com Emendas</option>
            </select>
            {errors.EmendasBalaustreAnterior && (
              <p className="form-error-message">
                {errors.EmendasBalaustreAnterior.message}
              </p>
            )}
          </div>
        </div>
        <div className="form-group full-width">
          <label>Emendas (se houver)</label>
          <textarea
            {...register("Emendas")}
            className="form-textarea"
            rows="3"
            placeholder="Descreva as emendas, se aplicável..."
            disabled={readOnly}
          ></textarea>
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Presença e Contagens</legend>
        <div className="form-grid">
          <div className="form-group">
            <label>Nº de Irmãos do Quadro</label>
            <input
              type="number"
              {...register("NumeroIrmaosQuadro")}
              className={`form-input ${
                errors.NumeroIrmaosQuadro ? "is-invalid" : ""
              }`}
              disabled={readOnly}
            />
            {errors.NumeroIrmaosQuadro && (
              <p className="form-error-message">
                {errors.NumeroIrmaosQuadro.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Nº de Visitantes</label>
            <input
              type="number"
              {...register("NumeroVisitantes")}
              className={`form-input ${
                errors.NumeroVisitantes ? "is-invalid" : ""
              }`}
              disabled={readOnly}
            />
            {errors.NumeroVisitantes && (
              <p className="form-error-message">
                {errors.NumeroVisitantes.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Datas e Horários</legend>
        <div className="form-grid">
          <div className="form-group">
            <label>Data da Sessão Anterior</label>
            <input
              {...register("DataSessaoAnterior")}
              className={`form-input ${
                errors.DataSessaoAnterior ? "is-invalid" : ""
              }`}
              disabled={readOnly}
            />
            {errors.DataSessaoAnterior && (
              <p className="form-error-message">
                {errors.DataSessaoAnterior.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Data da Sessão Atual</label>
            <input
              {...register("DiaSessao")}
              className={`form-input ${errors.DiaSessao ? "is-invalid" : ""}`}
              disabled={readOnly}
            />
            {errors.DiaSessao && (
              <p className="form-error-message">{errors.DiaSessao.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>Data da Assinatura</label>
            <input
              {...register("DataAssinatura")}
              className={`form-input ${
                errors.DataAssinatura ? "is-invalid" : ""
              }`}
              disabled={readOnly}
            />
            {errors.DataAssinatura && (
              <p className="form-error-message">
                {errors.DataAssinatura.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Hora de Início</label>
            <input
              {...register("HoraInicioSessao")}
              className={`form-input ${
                errors.HoraInicioSessao ? "is-invalid" : ""
              }`}
              disabled={readOnly}
            />
            {errors.HoraInicioSessao && (
              <p className="form-error-message">
                {errors.HoraInicioSessao.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Hora de Encerramento</label>
            <input
              {...register("HoraEncerramento")}
              className={`form-input ${
                errors.HoraEncerramento ? "is-invalid" : ""
              }`}
              disabled={readOnly}
            />
            {errors.HoraEncerramento && (
              <p className="form-error-message">
                {errors.HoraEncerramento.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Oficiais</legend>
        <div className="form-grid">
          <div className="form-group">
            <label>Venerável Mestre</label>
            <input
              {...register("Veneravel")}
              className={`form-input ${errors.Veneravel ? "is-invalid" : ""}`}
              disabled={readOnly}
            />
            {errors.Veneravel && (
              <p className="form-error-message">{errors.Veneravel.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>1º Vigilante</label>
            <input
              {...register("PrimeiroVigilante")}
              className={`form-input ${
                errors.PrimeiroVigilante ? "is-invalid" : ""
              }`}
              disabled={readOnly}
            />
            {errors.PrimeiroVigilante && (
              <p className="form-error-message">
                {errors.PrimeiroVigilante.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>2º Vigilante</label>
            <input
              {...register("SegundoVigilante")}
              className={`form-input ${
                errors.SegundoVigilante ? "is-invalid" : ""
              }`}
              disabled={readOnly}
            />
            {errors.SegundoVigilante && (
              <p className="form-error-message">
                {errors.SegundoVigilante.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Orador</label>
            <input
              {...register("Orador")}
              className={`form-input ${errors.Orador ? "is-invalid" : ""}`}
              disabled={readOnly}
            />
            {errors.Orador && (
              <p className="form-error-message">{errors.Orador.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>Secretário</label>
            <input
              {...register("Secretario")}
              className={`form-input ${errors.Secretario ? "is-invalid" : ""}`}
              disabled={readOnly}
            />
            {errors.Secretario && (
              <p className="form-error-message">{errors.Secretario.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>Tesoureiro</label>
            <input
              {...register("Tesoureiro")}
              className={`form-input ${errors.Tesoureiro ? "is-invalid" : ""}`}
              disabled={readOnly}
            />
            {errors.Tesoureiro && (
              <p className="form-error-message">{errors.Tesoureiro.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>Chanceler</label>
            <input
              {...register("Chanceler")}
              className={`form-input ${errors.Chanceler ? "is-invalid" : ""}`}
              disabled={readOnly}
            />
            {errors.Chanceler && (
              <p className="form-error-message">{errors.Chanceler.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Corpo do Balaústre</legend>
        <div className="form-group full-width">
          <label>Expediente Recebido</label>
          <textarea
            {...register("ExpedienteRecebido")}
            className="form-textarea"
            rows="3"
            disabled={readOnly}
          ></textarea>
        </div>
        <div className="form-group full-width">
          <label>Expediente Expedido</label>
          <textarea
            {...register("ExpedienteExpedido")}
            className="form-textarea"
            rows="3"
            disabled={readOnly}
          ></textarea>
        </div>
        <div className="form-group full-width">
          <label>Saco de Propostas e Informações</label>
          <textarea
            {...register("SacoProposta")}
            className="form-textarea"
            rows="3"
            disabled={readOnly}
          ></textarea>
        </div>
        <div className="form-group full-width">
          <label>Ordem do Dia</label>
          <textarea
            {...register("OrdemDia")}
            className="form-textarea"
            rows="4"
            disabled={readOnly}
          ></textarea>
        </div>
        <div className="form-group full-width">
          <label>Escrutínio</label>
          <textarea
            {...register("Escrutinio")}
            className="form-textarea"
            rows="3"
            disabled={readOnly}
          ></textarea>
        </div>
        <div className="form-group full-width">
          <label>Tempo de Instrução</label>
          <textarea
            {...register("TempoInstrucao")}
            className="form-textarea"
            rows="2"
            disabled={readOnly}
          ></textarea>
        </div>
        <div className="form-group full-width">
          <label>Palavra a Bem da Ordem</label>
          <textarea
            {...register("Palavra")}
            className="form-textarea"
            rows="3"
            disabled={readOnly}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Tronco de Beneficência (R$)</label>
          <input
            type="number"
            step="1"
            {...register("TroncoBeneficiencia")}
            className={`form-input ${
              errors.TroncoBeneficiencia ? "is-invalid" : ""
            }`}
            disabled={readOnly}
          />
          {errors.TroncoBeneficiencia && (
            <p className="form-error-message">
              {errors.TroncoBeneficiencia.message}
            </p>
          )}
        </div>
      </fieldset>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || readOnly}
        >
          {isSubmitting ? "A salvar..." : "Salvar e Regenerar Documentos"}
        </button>
      </div>
    </form>
  );
};

export default BalaustreForm;
