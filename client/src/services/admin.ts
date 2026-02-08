import { api } from './api';
import { Essay, EssayFeedback } from '../types';

export interface AdminStats {
  totalSubmissions: string;
  pendingSubmissions: string;
  registeredStudents: string;
  totalRevenue: string;
}

export const adminService = {
  async getDashboardStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getAllEssays(): Promise<Essay[]> {
    const response = await api.get('/admin/essays');
    return response.data;
  },

  async getEssayById(id: string): Promise<Essay> {
    const response = await api.get(`/admin/essays/${id}`);
    return response.data;
  },

  async getFeedbackHistory(essayId: string): Promise<EssayFeedback[]> {
    const response = await api.get(`/admin/essays/${essayId}/history`);
    return response.data;
  },

  async submitFeedback(id: string, feedbackData: any): Promise<void> {
    await api.post(`/admin/essays/${id}/feedback`, feedbackData);
  }
};
