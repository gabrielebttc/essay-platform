import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { essayService } from '../services/essay'
import { Loader2, AlertTriangle } from 'lucide-react'

const PaymentCancel: React.FC = () => {
  const [searchParams] = useSearchParams()
  const essayId = searchParams.get('essay_id')
  const [loading, setLoading] = useState(true)
  const [, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (essayId) {
      // Here you might want to mark the essay as 'payment_cancelled' on your backend
      essayService.getEssayById(essayId)
        .then(() => setLoading(false))
        .catch(() => {
          setError('Essay not found')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [essayId, setError])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Loader2 className="animate-spin h-12 w-12 text-gray-400" />
        <h2 className="mt-6 text-2xl font-semibold text-gray-700">
          Processing cancellation...
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we process your cancellation.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Payment Cancelled
        </h2>
        <p className="mt-4 text-gray-600">
          Your payment was cancelled and your essay submission was not processed.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Don't worry! You can submit your essay again whenever you're ready.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-2 sm:space-y-0">
          <Link
            to="/submit"
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try Again
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancel
