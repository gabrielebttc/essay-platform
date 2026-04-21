import { api } from './api'
import { Essay, EssayType } from '../types'

export interface EssaySubmission {
  taskTypeId: string
  content: string
}

export interface CreateEssayResponse {
  essay: Essay
  paymentUrl?: string
  sessionId?: string
}

export const essayService = {
  async submitEssay(essayData: EssaySubmission): Promise<CreateEssayResponse> {
    const response = await api.post('/payments/create-checkout-session', essayData)
    return response.data
  },

  async getMyEssays(): Promise<Essay[]> {
    const response = await api.get('/essays/my')
    return response.data
  },

  async getEssayById(id: string): Promise<Essay> {
    const response = await api.get(`/essays/${id}`)
    return response.data
  },

  async deleteEssay(id: string): Promise<void> {
    await api.delete(`/essays/${id}`)
  },

  async getEssayTypes(): Promise<EssayType[]> {
    const response = await api.get('/essays/essay-types')
    return response.data
  },
}