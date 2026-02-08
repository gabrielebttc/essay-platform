import React, { useState, useEffect, useMemo } from 'react';
import { essayService } from '../services/essay';
import { Essay, EssayType } from '../types';
import { Link } from 'react-router-dom';
import { Book, Calendar, CheckCircle, Clock, PlusCircle, ChevronRight, Loader2 } from 'lucide-react';

const EssayList: React.FC = () => {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [essayTypes, setEssayTypes] = useState<EssayType[]>([]);

  useEffect(() => {
    Promise.all([essayService.getMyEssays(), essayService.getEssayTypes()])
      .then(([fetchedEssays, fetchedEssayTypes]) => {
        // Sort by submission date to ensure reviews are in order
        const sortedEssays = fetchedEssays.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
        setEssays(sortedEssays);
        setEssayTypes(fetchedEssayTypes);
      })
      .catch(() => setError('Failed to fetch data'))
      .finally(() => setLoading(false));
  }, []);

  const getTaskTypeName = (taskTypeId: string) => {
    const type = essayTypes.find(et => et.id === taskTypeId);
    return type ? type.name : 'Unknown Task Type';
  };

  /**
   * Processes essays to handle multiple reviews for the same submission.
   * If an essay ID is duplicated, it means it has been reviewed more than once.
   * This function generates a unique key for React's map function (e.g., "essayId-review-2")
   * and a display name (e.g., "Task 2 (Review 2)") to differentiate them in the UI.
   * It's wrapped in useMemo for performance, re-running only when the essays array changes.
   */
  const processedEssays = useMemo(() => {
    const idCounts: { [key: string]: number } = {};
    return essays.map(essay => {
      idCounts[essay.id] = (idCounts[essay.id] || 0) + 1;
      const reviewCount = idCounts[essay.id];
      const taskTypeName = getTaskTypeName(essay.taskTypeId);

      return {
        ...essay,
        uniqueKey: reviewCount > 1 ? `${essay.id}-review-${reviewCount}` : essay.id,
        displayName: reviewCount > 1 ? `${taskTypeName} (Review ${reviewCount})` : `IELTS Writing ${taskTypeName}`
      };
    });
  }, [essays, essayTypes]);

  const statusInfo: { [key: string]: { icon: React.ElementType, text: string, color: string } } = {
    pending_payment: { icon: Clock, text: 'Payment Pending', color: 'text-yellow-600 bg-yellow-100' },
    pending: { icon: Clock, text: 'Submitted', color: 'text-blue-600 bg-blue-100' },
    in_review: { icon: Clock, text: 'In Review', color: 'text-purple-600 bg-purple-100' },
    completed: { icon: CheckCircle, text: 'Completed', color: 'text-green-600 bg-green-100' },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Essays</h1>
            <p className="text-sm text-gray-500">Track the status of your submissions.</p>
          </div>
          <Link
            to="/submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Submit New Essay
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {processedEssays.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Book className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">No essays submitted yet.</h2>
            <p className="mt-1 text-sm text-gray-500">Submit your first essay to get professional feedback.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {processedEssays.map((essay) => {
                const currentStatus = statusInfo[essay.status] || statusInfo.pending;
                const Icon = currentStatus.icon;
                return (
                  <li key={essay.uniqueKey}>
                    <Link to={`/essays/${essay.id}?reviewKey=${essay.uniqueKey}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {essay.displayName}
                            </p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <p>
                                Submitted on <time dateTime={essay.submittedAt}>{new Date(essay.submittedAt).toLocaleDateString()}</time>
                              </p>
                            </div>
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{essay.content}</p>
                          </div>
                          <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${currentStatus.color}`}>
                              <Icon className="mr-1.5 h-4 w-4" />
                              {currentStatus.text}
                            </p>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default EssayList;