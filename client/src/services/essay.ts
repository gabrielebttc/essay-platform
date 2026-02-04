import { api } from './api'
import { Essay } from '../types'

export interface EssaySubmission {
  taskType: string
  content: string
}

export interface CreateEssayResponse {
  essay: Essay
  paymentUrl?: string
  sessionId?: string
}

export interface EssayType {
  id: number
  name: string
  price: number,
  minWords: number
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
}