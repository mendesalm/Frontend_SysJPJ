import apiClient from "./apiClient";

export const getDashboardData = () => {
  return apiClient.get("/dashboard");
};
export const getCalendarioUnificado = (ano, mes) => {
  return apiClient.get("/dashboard/calendario-unificado", {
    params: { ano, mes },
  });
};
