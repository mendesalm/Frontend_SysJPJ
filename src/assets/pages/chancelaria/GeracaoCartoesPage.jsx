// src/assets/pages/chancelaria/GeracaoCartoesPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
import { getAllMembers } from "~/services/memberService";
import { gerarCartao } from "~/services/chancelerService";
import { showSuccessToast, showErrorToast } from "~/utils/notifications";
import "./GeracaoCartoes.css";
import "~/assets/styles/TableStyles.css";

// Função auxiliar para formatar a data de forma segura
const formatLocalDate = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) return "Não informado";
  return new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

const GeracaoCartoesPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(null);
  const [generatedLinks, setGeneratedLinks] = useState({});

  useEffect(() => {
    const fetchMembersWithFamily = async () => {
      try {
        setIsLoading(true);
        const response = await getAllMembers({
          include: "familiares",
          limit: 500,
        });
        setMembers(response.data.data || []);
      } catch (err) {
        console.error("Erro ao buscar dados dos membros:", err);
        setError("Não foi possível carregar os dados.");
        showErrorToast("Erro ao carregar os dados dos membros.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembersWithFamily();
  }, []);

  const canGenerate =
    user?.credencialAcesso === "Webmaster" ||
    user?.permissoes?.some(
      (p) => p.nomeFuncionalidade === "gerenciarCartoesAniversario"
    );

  const sortAniversariantesPorProximidade = (a, b) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const getProximoAniversario = (nasc) => {
      if (!nasc || isNaN(new Date(nasc))) {
        return new Date(8640000000000000);
      }
      const dataNascimento = new Date(nasc);
      let proximoAniv = new Date(
        hoje.getFullYear(),
        dataNascimento.getMonth(),
        dataNascimento.getDate()
      );
      if (proximoAniv < hoje) {
        proximoAniv.setFullYear(hoje.getFullYear() + 1);
      }
      return proximoAniv;
    };

    const proximoAnivA = getProximoAniversario(
      a.DataNascimento || a.dataNascimento
    );
    const proximoAnivB = getProximoAniversario(
      b.DataNascimento || b.dataNascimento
    );

    return proximoAnivA - proximoAnivB;
  };

  const allFamiliares = useMemo(() => {
    if (!Array.isArray(members)) return [];
    return members
      .flatMap((m) =>
        (m.familiares || [])
          .filter((f) => !f.falecido)
          .map((f) => ({ ...f, membroNome: m.NomeCompleto }))
      )
      .sort(sortAniversariantesPorProximidade);
  }, [members]);

  const activeMembers = useMemo(() => {
    if (!Array.isArray(members)) return [];
    return members
      .filter((m) => m.Situacao === "Ativo")
      .sort(sortAniversariantesPorProximidade);
  }, [members]);

  const handleGenerateClick = async (id, type) => {
    const uniqueKey = `${type}-${id}`;
    setIsGenerating(uniqueKey);
    try {
      const payload =
        type === "member" ? { memberId: id } : { familyMemberId: id };
      const response = await gerarCartao(payload);
      const filePath = response.data.caminho;

      if (!filePath) {
        throw new Error("A API não retornou um caminho para o ficheiro.");
      }

      // CORREÇÃO DEFINITIVA: Utiliza o construtor URL para evitar barras duplas.
      const downloadUrl = new URL(filePath, window.location.origin).href;

      setGeneratedLinks((prev) => ({ ...prev, [uniqueKey]: downloadUrl }));
      showSuccessToast("Cartão gerado! Clique em 'Baixar' para abrir.");
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Não foi possível gerar o cartão."
      );
    } finally {
      setIsGenerating(null);
    }
  };

  const handleDownloadAndReset = (uniqueKey, downloadUrl) => {
    window.open(downloadUrl, "_blank", "noreferrer");
    setGeneratedLinks((prev) => {
      const newLinks = { ...prev };
      delete newLinks[uniqueKey];
      return newLinks;
    });
  };

  if (!canGenerate && !isLoading) {
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

      {error && <p className="error-message">{error}</p>}

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
                {isLoading ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      A carregar membros...
                    </td>
                  </tr>
                ) : activeMembers.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      Nenhum membro ativo encontrado.
                    </td>
                  </tr>
                ) : (
                  activeMembers.map((member) => {
                    const uniqueKey = `member-${member.id}`;
                    const downloadLink = generatedLinks[uniqueKey];
                    return (
                      <tr key={uniqueKey}>
                        <td>{member.NomeCompleto}</td>
                        <td>{formatLocalDate(member.DataNascimento)}</td>
                        <td className="actions-cell">
                          {downloadLink ? (
                            <button
                              className="btn-action btn-success"
                              onClick={() =>
                                handleDownloadAndReset(uniqueKey, downloadLink)
                              }
                            >
                              Baixar Cartão
                            </button>
                          ) : (
                            <button
                              className="btn-action btn-approve"
                              onClick={() =>
                                handleGenerateClick(member.id, "member")
                              }
                              disabled={
                                isGenerating === uniqueKey ||
                                !member.DataNascimento
                              }
                            >
                              {isGenerating === uniqueKey
                                ? "A gerar..."
                                : "Gerar Cartão"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
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
                {isLoading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      A carregar familiares...
                    </td>
                  </tr>
                ) : allFamiliares.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      Nenhum familiar encontrado.
                    </td>
                  </tr>
                ) : (
                  allFamiliares.map((familiar) => {
                    const uniqueKey = `familiar-${familiar.id}`;
                    const downloadLink = generatedLinks[uniqueKey];
                    return (
                      <tr key={uniqueKey}>
                        <td>{familiar.nomeCompleto}</td>
                        <td>{familiar.membroNome}</td>
                        <td>{formatLocalDate(familiar.dataNascimento)}</td>
                        <td className="actions-cell">
                          {downloadLink ? (
                            <button
                              className="btn-action btn-success"
                              onClick={() =>
                                handleDownloadAndReset(uniqueKey, downloadLink)
                              }
                            >
                              Baixar Cartão
                            </button>
                          ) : (
                            <button
                              className="btn-action btn-approve"
                              onClick={() =>
                                handleGenerateClick(familiar.id, "familiar")
                              }
                              disabled={
                                isGenerating === uniqueKey ||
                                !familiar.dataNascimento
                              }
                            >
                              {isGenerating === uniqueKey
                                ? "A gerar..."
                                : "Gerar Cartão"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeracaoCartoesPage;
