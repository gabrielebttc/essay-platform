import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionId) {
      /*setError('Payment session not found')*/
      setLoading(false)
      return
    }

    // Simulate processing - in a real app, you'd verify the payment status with your backend
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
        <h2 className="mt-6 text-2xl font-semibold text-gray-700">
          Processing your payment...
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we confirm your submission.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Payment Processing Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error}
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-block w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Payment Successful!
        </h2>
        <p className="mt-4 text-gray-600">
          Your essay has been successfully submitted for review. Our examiners will provide detailed feedback within 24-48 hours.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          You've received a confirmation email with your submission details.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-2 sm:space-y-0">
          <Link
            to="/essays"
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View My Essays
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
