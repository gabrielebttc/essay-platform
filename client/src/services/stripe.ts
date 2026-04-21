import { api } from './api'

export const redirectToPayment = async (taskTypeId: string, content: string) => {
  try {
    const response = await api.post('/payments/create-payment-link', {
      taskTypeId,
      content,
    })

    const { paymentUrl } = response.data
    
    // Redirect directly to Payment Link
    window.location.href = paymentUrl
  } catch (error: any) {
    console.error('Payment redirect error:', error)
    throw new Error(error.message || 'Failed to process payment')
  }
}