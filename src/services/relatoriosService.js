import apiClient from "./apiClient";

// Função auxiliar para descarregar o ficheiro PDF
const downloadPdf = (response, defaultFilename) => {
  const header = response.headers["content-disposition"];
  let filename = defaultFilename;
  if (header) {
    const parts = header.split(";");
    const filenamePart = parts.find((part) =>
      part.trim().startsWith("filename=")
    );
    if (filenamePart) {
      filename = filenamePart.split("=")[1].trim().replace(/"/g, "");
    }
  }

  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// --- RELATÓRIOS DA CHANCELARIA ---

export const getRelatorioMembros = async () => {
  const response = await apiClient.get("/relatorios/membros/pdf", {
    responseType: "blob",
  });
  downloadPdf(response, "Quadro_de_Obreiros.pdf");
};

export const getRelatorioFrequencia = async (dataInicio, dataFim) => {
  const response = await apiClient.get("/relatorios/frequencia/pdf", {
    params: { dataInicio, dataFim },
    responseType: "blob",
  });
  downloadPdf(response, `Relatorio_Frequencia_${dataInicio}_a_${dataFim}.pdf`);
};

export const getRelatorioVisitacoes = async (dataInicio, dataFim) => {
  const response = await apiClient.get("/relatorios/visitacoes/pdf", {
    params: { dataInicio, dataFim },
    responseType: "blob",
  });
  downloadPdf(response, `Relatorio_Visitacoes_${dataInicio}_a_${dataFim}.pdf`);
};

export const getRelatorioAniversariantes = async (mes) => {
  const response = await apiClient.get("/relatorios/aniversariantes/pdf", {
    params: { mes },
    responseType: "blob",
  });
  downloadPdf(response, `Relatorio_Aniversariantes_Mes_${mes}.pdf`);
};

export const getRelatorioCargosGestao = async () => {
  const response = await apiClient.get("/relatorios/cargos-gestao/pdf", {
    responseType: "blob",
  });
  downloadPdf(response, "Relatorio_Cargos_Gestao.pdf");
};

export const getRelatorioDatasMaconicas = async (mes) => {
  const response = await apiClient.get("/relatorios/datas-maconicas/pdf", {
    params: { mes },
    responseType: "blob",
  });
  downloadPdf(response, `Relatorio_Datas_Maconicas_Mes_${mes}.pdf`);
};

export const getRelatorioComissoes = async (dataInicio, dataFim) => {
  const response = await apiClient.get("/relatorios/comissoes/pdf", {
    params: { dataInicio, dataFim },
    responseType: "blob",
  });
  downloadPdf(response, `Relatorio_Comissoes_${dataInicio}_a_${dataFim}.pdf`);
};

// --- OUTROS RELATÓRIOS (FINANCEIRO, ETC.) ---

export const getRelatorioFinanceiro = async (mes, ano) => {
  const response = await apiClient.get(`/financeiro/balancete/pdf`, {
    params: { mes, ano },
    responseType: "blob",
  });
  downloadPdf(response, `Balancete_${mes}_${ano}.pdf`);
};
