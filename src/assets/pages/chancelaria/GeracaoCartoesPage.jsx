// src/assets/pages/chancelaria/GeracaoCartoesPage.jsx
import React, { useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDataFetching } from "../../hooks/useDataFetching";
import { getAllMembers } from "../../services/memberService";
import { gerarCartao } from "../../services/chancelerService";
import { showSuccessToast, showErrorToast } from "../../utils/notifications";
import apiClient from "../../services/apiClient";
import "./GeracaoCartoes.css";
import "../../assets/styles/TableStyles.css";

const GeracaoCartoesPage = () => {
  const { user } = useAuth();
  const { data: members, isLoading, error } = useDataFetching(getAllMembers);
  const [isGenerating, setIsGenerating] = useState(null); // Controla o estado de loading de cada botão

  const canGenerate = user?.permissoes?.some(
    (p) => p.nomeFuncionalidade === "gerenciarCartoesAniversario"
  );

  // CORREÇÃO: Os hooks useMemo foram movidos para o topo do componente, antes de qualquer retorno condicional.
  const allFamiliares = useMemo(() => {
    if (!members) return [];
    return members.flatMap((m) =>
      m.familiares
        .filter((f) => !f.falecido)
        .map((f) => ({ ...f, membroNome: m.NomeCompleto }))
    );
  }, [members]);

  const activeMembers = useMemo(() => {
    if (!members) return [];
    return members.filter((m) => m.Situacao === "Ativo");
  }, [members]);

  const handleGenerateClick = async (id, type) => {
    setIsGenerating(`${type}-${id}`);
    try {
      const payload =
        type === "member" ? { memberId: id } : { familyMemberId: id };
      const response = await gerarCartao(payload);

      const filePath = response.data.caminho;
      const baseURL = apiClient.defaults.baseURL.startsWith("http")
        ? apiClient.defaults.baseURL
        : window.location.origin;
      const downloadUrl = `${baseURL}/${filePath}`.replace("/api/", "/");

      window.open(downloadUrl, "_blank");
      showSuccessToast("Cartão gerado e transferido com sucesso!");
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Não foi possível gerar o cartão."
      );
    } finally {
      setIsGenerating(null);
    }
  };

  if (!canGenerate) {
    return (
      <div className="table-page-container">
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para aceder a esta funcionalidade.</p>
      </div>
    );
  }

  return (
    <div className="geracao-cartoes-page">
      <div className="table-header">
        <h1>Geração Manual de Cartões de Aniversário</h1>
      </div>
      <p className="page-description">
        Selecione um membro ou familiar abaixo para gerar um cartão de
        aniversário em PDF sob demanda.
      </p>

      <div className="cards-generation-grid">
        <div className="generation-section">
          <h2>Membros da Loja</h2>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Data de Nascimento</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan="3">A carregar membros...</td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan="3" className="error-message">
                      {error}
                    </td>
                  </tr>
                )}
                {activeMembers.map((member) => (
                  <tr key={`member-${member.id}`}>
                    <td>{member.NomeCompleto}</td>
                    <td>
                      {new Date(member.DataNascimento).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn-action btn-approve"
                        onClick={() => handleGenerateClick(member.id, "member")}
                        disabled={isGenerating === `member-${member.id}`}
                      >
                        {isGenerating === `member-${member.id}`
                          ? "A gerar..."
                          : "Gerar Cartão"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="generation-section">
          <h2>Familiares</h2>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Parente</th>
                  <th>Data de Nascimento</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan="4">A carregar familiares...</td>
                  </tr>
                )}
                {allFamiliares.map((familiar) => (
                  <tr key={`familiar-${familiar.id}`}>
                    <td>{familiar.nomeCompleto}</td>
                    <td>{familiar.membroNome}</td>
                    <td>
                      {new Date(familiar.dataNascimento).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn-action btn-approve"
                        onClick={() =>
                          handleGenerateClick(familiar.id, "familiar")
                        }
                        disabled={isGenerating === `familiar-${familiar.id}`}
                      >
                        {isGenerating === `familiar-${familiar.id}`
                          ? "A gerar..."
                          : "Gerar Cartão"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeracaoCartoesPage;
