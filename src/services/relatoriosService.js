import apiClient from './apiClient';

// Função auxiliar para descarregar o ficheiro PDF
const downloadPdf = (response, defaultFilename) => {
  // Extrai o nome do ficheiro do cabeçalho Content-Disposition, se existir
  const header = response.headers['content-disposition'];
  let filename = defaultFilename;
  if (header) {
    const parts = header.split(';');
    const filenamePart = parts.find(part => part.trim().startsWith('filename='));
    if (filenamePart) {
      filename = filenamePart.split('=')[1].trim().replace(/"/g, '');
    }
  }

  // Cria um URL para o blob (o ficheiro PDF recebido)
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Limpa o URL e o link após o download
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};


// Função para gerar o relatório do Quadro de Obreiros
export const getRelatorioMembros = async () => {
  const response = await apiClient.get('/relatorios/membros/pdf', {
    responseType: 'blob', // Importante: informa ao axios que esperamos um ficheiro
  });
  downloadPdf(response, 'Quadro_de_Obreiros.pdf');
};

// Função para gerar o relatório Financeiro (Balancete)
export const getRelatorioFinanceiro = async (mes, ano) => {
    const response = await apiClient.get(`/financeiro/balancete/pdf`, {
        params: { mes, ano },
        responseType: 'blob',
    });
    downloadPdf(response, `Balancete_${mes}_${ano}.pdf`);
};

// Função para gerar o relatório de Frequência
export const getRelatorioFrequencia = async (dataInicio, dataFim) => {
    const response = await apiClient.get(`/relatorios/frequencia/pdf`, {
        params: { dataInicio, dataFim },
        responseType: 'blob',
    });
    downloadPdf(response, `Relatorio_Frequencia.pdf`);
};

// Adicione outras funções para os demais relatórios conforme necessário...
