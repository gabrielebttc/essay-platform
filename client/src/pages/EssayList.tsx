import React, { useState, useEffect } from 'react'
import { essayService } from '../services/essay'
import { Essay, EssayType } from '../types'

const EssayList: React.FC = () => {
  const [essays, setEssays] = useState<Essay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [essayTypes, setEssayTypes] = useState<EssayType[]>([])
  const [loadingEssayTypes, setLoadingEssayTypes] = useState(true)
  const [errorEssayTypes, setErrorEssayTypes] = useState<string | null>(null)

  useEffect(() => {
    fetchEssays()
  }, [])

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
  }, [])

  const fetchEssays = async () => {
    try {
      const fetchedEssays = await essayService.getMyEssays()
      setEssays(fetchedEssays)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch essays')
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
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTaskTypeName = (taskTypeId: string) => {
    const type = essayTypes.find(et => et.id === taskTypeId);
    return type ? type.name : 'Unknown Task Type';
  };

  if (loading || loadingEssayTypes) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (errorEssayTypes) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errorEssayTypes}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Essays</h1>
          <p className="text-gray-600 mt-2">Track the status of your essay submissions</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {essays.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No essays submitted yet</h3>
            <p className="text-gray-600 mb-6">Submit your first essay to get professional IELTS feedback!</p>
            <a
              href="/submit"
              className="btn btn-primary inline-block"
            >
              Submit Your First Essay
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {essays.map((essay) => (
              <div key={essay.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        IELTS Writing {getTaskTypeName(essay.taskTypeId).toUpperCase()}
                      </h3>
                      {getStatusBadge(essay.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Submitted on {formatDate(essay.submittedAt)}
                    </p>
                    <p className="text-gray-700 line-clamp-2">
                      {essay.content.substring(0, 150)}...
                    </p>
                    {essay.feedback && (
                      <div className="mt-3 p-3 bg-green-50 rounded">
                        <p className="text-sm font-medium text-green-800">
                          Overall Band Score: {essay.feedback.overallBandScore}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <a
                      href={`/essays/${essay.id}`}
                      className="btn btn-secondary"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EssayList