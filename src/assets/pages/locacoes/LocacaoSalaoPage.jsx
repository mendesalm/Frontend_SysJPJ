// src/assets/pages/locacoes/LocacaoSalaoPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useDataFetching } from "~/hooks/useDataFetching";
import * as locacaoService from "~/services/locacaoService";
import { showSuccessToast, showErrorToast } from "~/utils/notifications";
import Modal from "~/components/modal/Modal";
import LocacaoForm from "./LocacaoForm";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./LocacaoSalao.css";
import "~/assets/styles/TableStyles.css";
import { BiErrorCircle } from "react-icons/bi";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const LocacaoSalaoPage = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [eventosCalendario, setEventosCalendario] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // CORREÇÃO: A variável 'error' (renomeada para 'locacoesError') agora é capturada.
  const {
    data: locacoes,
    isLoading: isLoadingLocacoes,
    error: locacoesError,
    refetch: refetchLocacoes,
  } = useDataFetching(locacaoService.getLocacoes);
  const canManage = user?.permissoes?.some(
    (p) => p.nomeFuncionalidade === "gerenciar-locacao-salao"
  );

  const fetchCalendario = useCallback(async (dataCalendario) => {
    try {
      const ano = dataCalendario.getFullYear();
      const mes = dataCalendario.getMonth() + 1;
      const response = await locacaoService.getCalendarioOcupacao(ano, mes);
      const formattedEvents = response.data.map((item) => {
        // CORREÇÃO: Trata a data como UTC para evitar problemas de fuso horário.
        // Adiciona T00:00:00 para que a data seja interpretada no fuso horário local corretamente.
        const dataObj = new Date(`${item.data}T00:00:00`);

        return {
          title: item.titulo,
          start: dataObj,
          end: dataObj,
          allDay: true,
          resource: { type: "ocupado" },
        };
      });
      setEventosCalendario(formattedEvents);
    } catch (error) {
      console.error(error);
      showErrorToast("Não foi possível carregar as datas do calendário.");
    }
  }, []);

  useEffect(() => {
    fetchCalendario(date);
  }, [date, fetchCalendario]);

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleSave = async (data) => {
    try {
      await locacaoService.createLocacao(data);
      showSuccessToast("Solicitação de locação enviada com sucesso!");
      setIsModalOpen(false);
      fetchCalendario(date); // Atualiza o calendário
      if (canManage) refetchLocacoes(); // Atualiza a lista de gestão
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Erro ao enviar a solicitação."
      );
    }
  };

  const handleConfirm = async (id) => {
    try {
      await locacaoService.confirmarLocacao(id);
      showSuccessToast("Locação confirmada com sucesso!");
      refetchLocacoes();
      fetchCalendario(date);
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Erro ao confirmar locação."
      );
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Tem a certeza que deseja cancelar esta locação?")) {
      try {
        await locacaoService.cancelarLocacao(id);
        showSuccessToast("Locação cancelada.");
        refetchLocacoes();
        fetchCalendario(date);
      } catch (err) {
        showErrorToast(
          err.response?.data?.message || "Erro ao cancelar locação."
        );
      }
    }
  };

  const handleEncerramento = async (id) => {
    if (window.confirm("Confirma o encerramento desta locação?")) {
      try {
        await locacaoService.encerrarLocacao(id);
        showSuccessToast('Locação encerrada e marcada como "Concluída".');
        refetchLocacoes();
      } catch (err) {
        showErrorToast(
          err.response?.data?.message || "Erro ao encerrar locação."
        );
      }
    }
  };

  return (
    <div className="locacao-page-container">
      <div className="table-header">
        <h1>Locação do Salão de Festas</h1>
      </div>

      <p className="page-description">
        Consulte a disponibilidade no calendário abaixo. As datas em azul estão
        ocupadas. Preencha o formulário ao lado para solicitar uma nova reserva.
      </p>

      <div className="locacao-content-wrapper">
        <div className="locacao-calendar-container">
          <Calendar
            localizer={localizer}
            events={eventosCalendario}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            messages={{
              today: "Hoje",
              previous: "Anterior",
              next: "Próximo",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              agenda: "Agenda",
              noEventsInRange: "Nenhuma data ocupada neste período.",
            }}
            onNavigate={handleNavigate}
            date={date}
            views={["month"]}
            culture="pt-BR"
          />
        </div>

        <div className="locacao-form-section">
          <h2>Solicitar Reserva do Salão de Festas</h2>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">Nova Solicitação</button>
        </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Solicitar Reserva do Salão de Festas"
      >
        <LocacaoForm
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      </div>

      {canManage && (
        <div className="management-section">
          <h2>Gestão de Solicitações</h2>
          {/* CORREÇÃO: Exibição da mensagem de erro */}
          {locacoesError && <p className="error-message">{locacoesError}</p>}
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Solicitante</th>
                  <th>Finalidade</th>
                  <th>Período</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingLocacoes ? (
                  <tr>
                    <td colSpan="6">A carregar solicitações...</td>
                  </tr>
                ) : (
                  (locacoes || []).map((loc) => (
                    <tr key={loc.id}>
                      <td>
                        {loc.locatarioMembro?.NomeCompleto ||
                          loc.nomeLocatarioExterno}
                      </td>
                      <td>{loc.finalidade}</td>
                      <td>{`${format(new Date(loc.dataInicio), "dd/MM/yy HH:mm")} - ${format(new Date(loc.dataFim), "dd/MM/yy HH:mm")}`}</td>
                      <td>
                        {loc.ehNaoOneroso
                          ? "Não Oneroso"
                          : `R$ ${parseFloat(loc.valor).toFixed(2)}`}
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${loc.status.toLowerCase()}`}
                        >
                          {loc.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        {loc.status === "Pendente" && (
                          <>
                            <button
                              onClick={() => handleConfirm(loc.id)}
                              className="btn-action btn-approve"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => handleCancel(loc.id)}
                              className="btn-action btn-delete"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        {loc.status === "Confirmado" && (
                          <>
                            <button
                              onClick={() => handleEncerramento(loc.id)}
                              className="btn-action btn-concluir"
                            >
                              Encerrar
                            </button>
                            <button
                              onClick={() => handleCancel(loc.id)}
                              className="btn-action btn-delete"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocacaoSalaoPage;
