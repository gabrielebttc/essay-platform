import { api } from './api';
import { Essay } from '../types';

export const adminService = {
  async getAllEssays(): Promise<Essay[]> {
    const response = await api.get('/admin/essays');
    return response.data;
  },

  async getEssayById(id: string): Promise<Essay> {
    const response = await api.get(`/admin/essays/${id}`);
    return response.data;
  },

  async submitFeedback(id: string, feedbackData: any): Promise<void> {
    await api.post(`/admin/essays/${id}/feedback`, feedbackData);
  }
};
