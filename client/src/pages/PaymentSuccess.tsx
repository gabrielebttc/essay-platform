import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionId) {
      setError('Payment session not found')
      setLoading(false)
      return
    }

    // Simulate processing - in real app, you'd verify the payment status
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [sessionId])

  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  const handleGoToEssays = () => {
    navigate('/essays')
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Processing your payment...
        </h2>
        <p className="text-gray-600">
          Please wait while we confirm your submission.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16">
        <div className="card text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Processing Error
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <button
            onClick={handleGoToDashboard}
            className="btn btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card text-center">
        <div className="text-green-500 text-4xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Your essay has been successfully submitted for review. Our examiners will provide detailed feedback within 24-48 hours.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          You've received a confirmation email with your submission details.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleGoToEssays}
            className="btn btn-primary w-full"
          >
            View My Essays
          </button>
          <button
            onClick={handleGoToDashboard}
            className="btn btn-secondary w-full"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess