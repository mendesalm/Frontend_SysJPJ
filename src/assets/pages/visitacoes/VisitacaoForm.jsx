// src/assets/pages/visitacoes/VisitacaoForm.jsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  visitacaoValidationSchema,
  TIPO_SESSAO_OPTIONS,
} from "../../../validators/visitacaoValidator";
import { getAllMembers } from "../../../services/memberService";
import { searchLojas } from "../../../services/lojaService";
import useDebounce from "../../../hooks/useDebounce";
import "../../../assets/styles/FormStyles.css";

const VisitacaoForm = ({ visitaToEdit, onSave, onCancel }) => {
  const [membros, setMembros] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [isSearchingLojas, setIsSearchingLojas] = useState(false);
  const [isLojaInputFocused, setIsLojaInputFocused] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(visitacaoValidationSchema),
  });

  const lojaVisitadaValue = watch("dadosLoja.nome");
  const debouncedSearchTerm = useDebounce(lojaVisitadaValue, 300);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await getAllMembers({ limit: 500 });
        setMembros(response.data.data || response.data);
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      }
    }
    fetchMembers();
  }, []);

  useEffect(() => {
    if (
      isLojaInputFocused &&
      debouncedSearchTerm &&
      debouncedSearchTerm.length >= 2
    ) {
      setIsSearchingLojas(true);
      searchLojas(debouncedSearchTerm)
        .then((response) => {
          setSugestoes(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar sugestões de lojas:", error);
          setSugestoes([]);
        })
        .finally(() => {
          setIsSearchingLojas(false);
        });
    } else {
      setSugestoes([]);
    }
  }, [debouncedSearchTerm, isLojaInputFocused]);

  useEffect(() => {
    if (visitaToEdit) {
      reset({
        ...visitaToEdit,
        dataSessao: new Date(visitaToEdit.dataSessao)
          .toISOString()
          .split("T")[0],
        dataEntrega: visitaToEdit.dataEntrega
          ? new Date(visitaToEdit.dataEntrega).toISOString().split("T")[0]
          : "",
        dadosLoja: visitaToEdit.loja,
      });
    } else {
      reset();
    }
  }, [visitaToEdit, reset]);

  const handleSugestaoClick = (sugestao) => {
    setValue("dadosLoja", sugestao, { shouldValidate: true });
    setSugestoes([]);
  };

  const membroOptions = membros.map((m) => ({
    value: m.id,
    label: m.NomeCompleto,
  }));

  return (
    <form onSubmit={handleSubmit(onSave)} className="form-container">
      <div className="form-group">
        <label htmlFor="lodgeMemberId">Membro</label>
        <Controller
          name="lodgeMemberId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={membroOptions}
              isClearable
              isSearchable
              placeholder="Selecione um membro..."
              className={`form-select ${
                errors.lodgeMemberId ? "is-invalid" : ""
              }`}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "var(--cor-fundo-input)",
                  color: "var(--cor-texto-primario)",
                  borderColor: "var(--cor-borda-input)",
                  "&:hover": { borderColor: "var(--cor-foco-input-borda)" },
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "var(--cor-texto-primario)",
                }),
                input: (base) => ({
                  ...base,
                  color: "var(--cor-texto-primario)",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "var(--cor-texto-secundario)",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "var(--cor-fundo-input)",
                  borderColor: "var(--cor-borda-input)",
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected
                    ? "var(--cor-foco-input-borda)"
                    : isFocused
                    ? "var(--cor-fundo-hover-sidebar)"
                    : "var(--cor-fundo-input)",
                  color: isSelected ? "white" : "var(--cor-texto-primario)",
                  "&:active": {
                    backgroundColor: "var(--cor-foco-input-borda)",
                  },
                }),
              }}
              onChange={(selectedOption) =>
                field.onChange(selectedOption ? selectedOption.value : "")
              }
              value={
                membroOptions.find((option) => option.value === field.value) ||
                null
              }
            />
          )}
        />
        {errors.lodgeMemberId && (
          <p className="form-error-message">{errors.lodgeMemberId.message}</p>
        )}
      </div>

      <fieldset className="form-fieldset">
        <legend>Dados da Loja Visitada</legend>
        <div className="autocomplete-container">
          <div className="form-group">
            <label htmlFor="lojaVisitadaSearch">Pesquisar/Nome da Loja</label>
            <input
              id="lojaVisitadaSearch"
              type="text"
              {...register("dadosLoja.nome")}
              className={`form-input ${
                errors.dadosLoja?.nome ? "is-invalid" : ""
              }`}
              autoComplete="off"
              onFocus={() => setIsLojaInputFocused(true)}
              onBlur={() => setTimeout(() => setIsLojaInputFocused(false), 200)}
            />
            {errors.dadosLoja?.nome && (
              <p className="form-error-message">
                {errors.dadosLoja.nome.message}
              </p>
            )}
          </div>
          {isLojaInputFocused && isSearchingLojas && (
            <div className="suggestions-list">
              <div className="suggestion-item">A procurar...</div>
            </div>
          )}
          {isLojaInputFocused && sugestoes.length > 0 && (
            <ul className="suggestions-list">
              {sugestoes.map((sug, index) => (
                <li
                  key={index}
                  className="suggestion-item"
                  onMouseDown={() => handleSugestaoClick(sug)}
                >
                  <strong>{sug.nome}</strong>
                  <br />
                  <small>
                    {sug.cidade} - {sug.estado} ({sug.potencia || "N/A"})
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-grid" style={{ marginTop: "1rem" }}>
          <div className="form-group">
            <label>Cidade</label>
            <input
              type="text"
              {...register("dadosLoja.cidade")}
              className={`form-input ${
                errors.dadosLoja?.cidade ? "is-invalid" : ""
              }`}
            />
            {errors.dadosLoja?.cidade && (
              <p className="form-error-message">
                {errors.dadosLoja.cidade.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Estado (UF)</label>
            <input
              type="text"
              {...register("dadosLoja.estado")}
              className={`form-input ${
                errors.dadosLoja?.estado ? "is-invalid" : ""
              }`}
            />
            {errors.dadosLoja?.estado && (
              <p className="form-error-message">
                {errors.dadosLoja.estado.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Potência</label>
            <input
              type="text"
              {...register("dadosLoja.potencia")}
              className={`form-input ${
                errors.dadosLoja?.potencia ? "is-invalid" : ""
              }`}
            />
            {errors.dadosLoja?.potencia && (
              <p className="form-error-message">
                {errors.dadosLoja.potencia.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="dataSessao">Data da Visita</label>
          <input
            id="dataSessao"
            type="date"
            {...register("dataSessao")}
            className={`form-input ${errors.dataSessao ? "is-invalid" : ""}`}
          />
          {errors.dataSessao && (
            <p className="form-error-message">{errors.dataSessao.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="tipoSessao">Tipo de Sessão</label>
          <select
            id="tipoSessao"
            {...register("tipoSessao")}
            className={`form-select ${errors.tipoSessao ? "is-invalid" : ""}`}
          >
            {TIPO_SESSAO_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.tipoSessao && (
            <p className="form-error-message">{errors.tipoSessao.message}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dataEntrega">
          Data de Entrega do Certificado (Opcional)
        </label>
        <input
          id="dataEntrega"
          type="date"
          {...register("dataEntrega")}
          className={`form-input ${errors.dataEntrega ? "is-invalid" : ""}`}
        />
        {errors.dataEntrega && (
          <p className="form-error-message">{errors.dataEntrega.message}</p>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "A salvar..." : "Salvar Registro"}
        </button>
      </div>
    </form>
  );
};

export default VisitacaoForm;
