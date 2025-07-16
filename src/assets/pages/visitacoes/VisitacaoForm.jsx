// src/assets/pages/visitacoes/VisitacaoForm.jsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaPencilAlt } from "react-icons/fa";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isManualEdit, setIsManualEdit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(visitacaoValidationSchema),
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
        lodgeMemberId: visitaToEdit.lodgeMemberId
          ? [visitaToEdit.lodgeMemberId]
          : [],
        dataSessao: new Date(visitaToEdit.dataSessao)
          .toISOString()
          .split("T")[0],
        dataEntrega: visitaToEdit.dataEntrega
          ? new Date(visitaToEdit.dataEntrega).toISOString().split("T")[0]
          : "",
        dadosLoja: visitaToEdit.loja,
      });
      setSearchTerm(visitaToEdit.loja?.nome || "");
    } else {
      reset({
        lodgeMemberId: [],
        dataSessao: "",
        tipoSessao: TIPO_SESSAO_OPTIONS[0],
        dadosLoja: { nome: "", numero: "", cidade: "", estado: "", potencia: "" },
        dataEntrega: "",
      });
    }
  }, [visitaToEdit, reset]);

  const handleSugestaoClick = (sugestao) => {
    setValue("dadosLoja", sugestao, { shouldValidate: true });
    setSearchTerm(sugestao.nome);
    setSugestoes([]);
    setIsManualEdit(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isManualEdit) {
      setValue("dadosLoja.nome", e.target.value, { shouldValidate: true });
    }
  };

  const handleManualEditToggle = () => {
    setIsManualEdit(!isManualEdit);
  };

  const handleManualDataChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value, { shouldValidate: true });
  };

  const membroOptions = membros.map((m) => ({
    value: m.id,
    label: m.NomeCompleto,
  }));

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "var(--cor-fundo-input)",
      borderColor: "var(--cor-borda-input)",
      "&:hover": { borderColor: "var(--cor-foco-input-borda)" },
    }),
    singleValue: (base) => ({ ...base, color: "var(--cor-texto-primario)" }),
    input: (base) => ({ ...base, color: "var(--cor-texto-primario)" }),
    placeholder: (base) => ({ ...base, color: "var(--cor-texto-secundario)" }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--cor-sidebar-primaria)",
      zIndex: 5,
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? "var(--cor-active-icon)"
        : isFocused
        ? "var(--cor-fundo-hover-sidebar)"
        : "var(--cor-fundo-app)",
      color: "var(--cor-texto-primario)",
      "&:active": { backgroundColor: "var(--cor-active-icon)" },
    }),
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="form-container">
      <div className="form-group">
        <label htmlFor="lodgeMemberId">Membro(s)</label>
        <Controller
          name="lodgeMemberId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              isDisabled={!!visitaToEdit}
              options={membroOptions}
              isClearable
              isSearchable
              placeholder="Selecione um ou mais membros..."
              classNamePrefix="react-select"
              styles={customSelectStyles}
              onChange={(selectedOptions) =>
                field.onChange(
                  selectedOptions ? selectedOptions.map((o) => o.value) : []
                )
              }
              value={
                membroOptions.filter(
                  (option) => field.value?.includes(option.value)
                ) || []
              }
            />
          )}
        />
        {errors.lodgeMemberId && (
          <p className="form-error-message">{errors.lodgeMemberId.message}</p>
        )}
      </div>

      <fieldset className="form-fieldset">
        <legend>
          Dados da Loja Visitada
          <button
            type="button"
            onClick={handleManualEditToggle}
            className="btn-icon"
            style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
            title="Editar manualmente"
          >
            <FaPencilAlt color="var(--cor-texto-primario)" />
          </button>
        </legend>
        <div className="autocomplete-container">
          <div className="form-group">
            <label htmlFor="lojaVisitadaSearch">
              Pesquisar Loja (Nome ou Número)
            </label>
            <input
              id="lojaVisitadaSearch"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className={`form-input ${
                errors.dadosLoja?.nome ? "is-invalid" : ""
              } ${isLojaInputFocused ? "focused" : ""}`}
              autoComplete="off"
              onFocus={() => setIsLojaInputFocused(true)}
              onBlur={() => setTimeout(() => setIsLojaInputFocused(false), 200)}
              disabled={isManualEdit}
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

        <div className="form-row-flex" style={{ marginTop: "1rem" }}>
          <div className="form-group" style={{ flexBasis: "40%" }}>
            <label>Nome</label>
            <input
              {...register("dadosLoja.nome")}
              readOnly={!isManualEdit}
              className="form-input"
              onChange={handleManualDataChange}
            />
          </div>
          <div className="form-group" style={{ flexBasis: "8%" }}>
            <label>Nº</label>
            <input
              {...register("dadosLoja.numero")}
              readOnly={!isManualEdit}
              className="form-input"
              onChange={handleManualDataChange}
            />
          </div>
          <div className="form-group" style={{ flexBasis: "25%" }}>
            <label>Cidade</label>
            <input
              {...register("dadosLoja.cidade")}
              readOnly={!isManualEdit}
              className="form-input"
              onChange={handleManualDataChange}
            />
          </div>
          <div className="form-group" style={{ flexBasis: "8%" }}>
            <label>UF</label>
            <input
              {...register("dadosLoja.estado")}
              readOnly={!isManualEdit}
              className="form-input"
              onChange={handleManualDataChange}
            />
          </div>
          <div className="form-group" style={{ flexBasis: "12%" }}>
            <label>Potência</label>
            <input
              {...register("dadosLoja.potencia")}
              readOnly={!isManualEdit}
              className="form-input"
              onChange={handleManualDataChange}
            />
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
