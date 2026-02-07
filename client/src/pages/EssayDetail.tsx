import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { essayService } from '../services/essay'
import { Essay, EssayType } from '../types'

const EssayDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [essay, setEssay] = useState<Essay | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [essayTypes, setEssayTypes] = useState<EssayType[]>([]);
  const [loadingEssayTypes, setLoadingEssayTypes] = useState(true);
  const [errorEssayTypes, setErrorEssayTypes] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEssay()
    }
  }, [id])

  useEffect(() => {
    const fetchEssayTypes = async () => {
      try {
        setLoadingEssayTypes(true);
        const data = await essayService.getEssayTypes();
        setEssayTypes(data);
      } catch (error) {
        setErrorEssayTypes('Failed to load essay types.');
        console.error('Failed to fetch essay types:', error);
      } finally {
        setLoadingEssayTypes(false);
      }
    };
    fetchEssayTypes();
  }, []);

  const fetchEssay = async () => {
    try {
      const fetchedEssay = await essayService.getEssayById(id!)
      setEssay(fetchedEssay)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch essay')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending_payment: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800',
      in_review: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
    }

    const statusLabels = {
      pending_payment: 'Payment Pending',
      pending: 'Submitted',
      in_review: 'In Review',
      completed: 'Completed',
    }

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTaskTypeName = (taskTypeId: string) => {
    const type = essayTypes.find(et => et.id === taskTypeId);
    return type ? type.name : 'Unknown Task Type';
  };

  const handleDeleteEssay = async () => {
    if (!confirm('Are you sure you want to delete this essay? This action cannot be undone.')) {
      return
    }

    try {
      await essayService.deleteEssay(essay!.id)
      navigate('/essays')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete essay')
    }
  }

  if (loading || loadingEssayTypes) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="card">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !essay) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Essay Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'The essay you\'re looking for could not be found.'}
            </p>
            <button
              onClick={() => navigate('/essays')}
              className="btn btn-primary"
            >
              Back to Essays
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (errorEssayTypes) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errorEssayTypes}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-4">
          <button
            onClick={() => navigate('/essays')}
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            ← Back to Essays
          </button>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                IELTS Writing {getTaskTypeName(essay.taskTypeId).toUpperCase()}
              </h1>
              <p className="text-gray-600 mt-1">
                Submitted on {formatDate(essay.submittedAt)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(essay.status)}
              {essay.status === 'pending_payment' && (
                <button
                  onClick={handleDeleteEssay}
                  className="btn btn-secondary"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Essay Content */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Essay Content</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <pre className="whitespace-pre-wrap text-gray-800 font-sans">
                {essay.content}
              </pre>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Word count: {essay.content.trim().split(/\s+/).length} words
            </div>
          </div>

          {/* Feedback */}
          {essay.feedback ? (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {essay.feedback.overallBandScore}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Overall Band Score</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Task Achievement:</span>
                    <span className="font-medium">{essay.feedback.taskAchievement}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coherence & Cohesion:</span>
                    <span className="font-medium">{essay.feedback.coherence}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lexical Resource:</span>
                    <span className="font-medium">{essay.feedback.lexicalResource}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Grammatical Range:</span>
                    <span className="font-medium">{essay.feedback.grammaticalRange}</span>
                  </div>
                </div>
              </div>

              {essay.feedback.comments && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Detailed Feedback</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {essay.feedback.comments}
                    </p>
                  </div>
                </div>
              )}

              {essay.feedback.improvedVersion && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Improved Version</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-gray-800 font-sans text-sm">
                      {essay.feedback.improvedVersion}
                    </pre>
                  </div>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500">
                Feedback provided on {formatDate(essay.feedback.completedAt)}
              </div>
            </div>
          ) : (
            <div className="card bg-blue-50">
              <div className="text-center py-6">
                <div className="text-blue-600 text-4xl mb-3">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {essay.status === 'pending' && 'Essay Submitted Successfully'}
                  {essay.status === 'in_review' && 'Essay Currently Under Review'}
                  {essay.status === 'pending_payment' && 'Payment Required'}
                </h3>
                <p className="text-gray-600">
                  {essay.status === 'pending' && 'Our examiners are reviewing your essay. You will receive feedback within 24-48 hours.'}
                  {essay.status === 'in_review' && 'Your essay is being reviewed by our experienced IELTS examiners.'}
                  {essay.status === 'pending_payment' && 'Please complete the payment to submit your essay for review.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EssayDetail