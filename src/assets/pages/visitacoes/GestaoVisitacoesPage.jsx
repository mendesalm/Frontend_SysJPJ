import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getVisitantesDaSessao,
  addVisitanteNaSessao,
  deleteVisitanteDaSessao,
} from "../../../services/visitantesService";
import { searchLojas } from "../../../services/lojaService";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";
import { GRADUACAO_OPTIONS } from "../../../constants/userConstants";
import useDebounce from "../../../hooks/useDebounce";

const VisitantesTab = ({ sessionId }) => {
  const fetchVisitorsCallback = useCallback(
    () => getVisitantesDaSessao(sessionId),
    [sessionId]
  );
  const {
    data: visitantesRegistrados = [],
    isLoading: isLoadingList,
    refetch,
  } = useDataFetching(fetchVisitorsCallback);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    // CORREÇÃO: A variável não utilizada 'watch' foi removida.
    formState: { isSubmitting },
  } = useForm();

  const [nomeLojaInput, setNomeLojaInput] = useState("");
  const [sugestoesLojas, setSugestoesLojas] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(nomeLojaInput, 300);

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      setIsSearching(true);
      searchLojas(debouncedSearchTerm)
        .then((response) => setSugestoesLojas(response.data))
        .catch(() => setSugestoesLojas([]))
        .finally(() => setIsSearching(false));
    } else {
      setSugestoesLojas([]);
    }
  }, [debouncedSearchTerm]);

  const handleSelectLoja = (loja) => {
    setValue("dadosLoja", loja, { shouldValidate: true });
    setNomeLojaInput(loja.nome);
    setSugestoesLojas([]);
  };

  const handleManualLojaChange = (e) => {
    const { name, value } = e.target;
    if (name === "nome") {
      setNomeLojaInput(value);
    }
    setValue(`dadosLoja.${name}`, value, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      await addVisitanteNaSessao(sessionId, data);
      showSuccessToast("Visitante adicionado com sucesso!");
      reset({ graduacao: "Mestre", nomeCompleto: "" });
      setNomeLojaInput("");
      refetch();
    } catch (error) {
      console.error("Erro ao adicionar visitante:", error);
      showErrorToast(
        error.response?.data?.message || "Erro ao adicionar visitante."
      );
    }
  };

  const handleDeleteVisitor = async (visitorId) => {
    if (!window.confirm("Tem certeza que deseja remover este visitante?"))
      return;
    try {
      await deleteVisitanteDaSessao(sessionId, visitorId);
      showSuccessToast("Visitante removido!");
      refetch();
    } catch (error) {
      console.error("Erro ao remover visitante:", error);
      showErrorToast("Não foi possível remover o visitante.");
    }
  };

  if (isLoadingList && !visitantesRegistrados.length)
    return <p>A carregar visitantes...</p>;

  return (
    <div className="card">
      <h3>Registro de Visitantes</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="visitor-form-layout">
        <div className="form-group">
          <label>Nome Completo do Visitante</label>
          <input
            {...register("nomeCompleto", { required: true })}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Graduação</label>
          <select {...register("graduacao")} className="form-select">
            {GRADUACAO_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="form-fieldset" style={{ gridColumn: "1 / -1" }}>
          <legend>Loja do Visitante</legend>
          <div className="autocomplete-container">
            <div className="form-group">
              <label htmlFor="lojaVisitadaSearch">
                Pesquisar Loja Existente
              </label>
              <input
                id="lojaVisitadaSearch"
                type="text"
                value={nomeLojaInput}
                onChange={(e) => setNomeLojaInput(e.target.value)}
                className="form-input"
                autoComplete="off"
                placeholder="Comece a digitar o nome da loja..."
              />
            </div>
            {isSearching && (
              <div className="suggestions-list">
                <div className="suggestion-item">A procurar...</div>
              </div>
            )}
            {sugestoesLojas.length > 0 && (
              <ul className="suggestions-list">
                {sugestoesLojas.map((loja) => (
                  <li
                    key={loja.id}
                    className="suggestion-item"
                    onMouseDown={() => handleSelectLoja(loja)}
                  >
                    <strong>{loja.nome}</strong>
                    <br />
                    <small>
                      {loja.cidade} - {loja.estado} ({loja.potencia})
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-grid" style={{ marginTop: "1rem" }}>
            <div className="form-group">
              <label>Nome da Loja</label>
              <input
                {...register("dadosLoja.nome")}
                onChange={handleManualLojaChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Cidade</label>
              <input
                {...register("dadosLoja.cidade")}
                onChange={handleManualLojaChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <input
                {...register("dadosLoja.estado")}
                onChange={handleManualLojaChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Potência</label>
              <input
                {...register("dadosLoja.potencia")}
                onChange={handleManualLojaChange}
                className="form-input"
              />
            </div>
          </div>
        </fieldset>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adicionando..." : "Adicionar Visitante à Sessão"}
          </button>
        </div>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h4>Visitantes Registrados na Sessão ({visitantesRegistrados.length})</h4>
      {isLoadingList ? (
        <p>A carregar...</p>
      ) : (
        <ul className="lista-simples">
          {visitantesRegistrados.length > 0 ? (
            visitantesRegistrados.map((v) => (
              <li key={v.id}>
                <div className="visitor-info">
                  <span className="nome">
                    <strong>{v.nomeCompleto}</strong> - {v.graduacao}
                  </span>
                  <span className="loja">
                    Loja: {v.loja?.nome || "Não informada"} | Oriente:{" "}
                    {`${v.loja?.cidade || ""}-${v.loja?.estado || ""}`}
                  </span>
                </div>
                <button
                  className="btn-action btn-delete"
                  onClick={() => handleDeleteVisitor(v.id)}
                >
                  Remover
                </button>
              </li>
            ))
          ) : (
            <p>Nenhum visitante registrado para esta sessão.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default VisitantesTab;
