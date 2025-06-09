import apiClient from './apiClient';

export const getDashboardData = () => {
  return apiClient.get('/dashboard');
};