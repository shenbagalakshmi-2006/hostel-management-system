import { fetchApi } from './api';
import { DashboardStats } from '../types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const res = await fetchApi<DashboardStats>('/dashboard/stats');
    return res.data!;
  },
};
