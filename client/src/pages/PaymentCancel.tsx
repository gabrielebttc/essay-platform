import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { essayService } from '../services/essay'

const PaymentCancel: React.FC = () => {
  const [searchParams] = useSearchParams()
  const essayId = searchParams.get('essay_id')
  const [loading, setLoading] = useState(true)
  const setError = useState('')[1]
  const navigate = useNavigate()

  useEffect(() => {
    if (essayId) {
      // Cancel the essay submission
      essayService.getEssayById(essayId)
        .then(() => {
          setLoading(false)
        })
        .catch(() => {
          setError('Essay not found')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [essayId])

  const handleGoToSubmit = () => {
    navigate('/submit')
  }

  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Processing cancellation...
        </h2>
        <p className="text-gray-600">
          Please wait while we process your cancellation.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card text-center">
        <div className="text-orange-500 text-4xl mb-4">✕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h2>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled and your essay submission was not processed.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Don't worry! You can submit your essay again whenever you're ready.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleGoToSubmit}
            className="btn btn-primary w-full"
          >
            Try Again
          </button>
          <button
            onClick={handleGoToDashboard}
            className="btn btn-secondary w-full"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancel