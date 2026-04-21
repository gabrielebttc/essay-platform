import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import { Essay } from '../../types';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, Loader2, BookOpen } from 'lucide-react';

const AdminSubmissions: React.FC = () => {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEssays();
  }, []);

  const fetchEssays = async () => {
    try {
      const fetchedEssays = await adminService.getAllEssays();
      // Sort essays by submission date, newest first
      const sortedEssays = fetchedEssays.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setEssays(sortedEssays);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch essays');
    } finally {
      setLoading(false);
    }
  };

  const statusInfo: { [key: string]: { icon: React.ElementType, text: string, color: string } } = {
    pending: { icon: Clock, text: 'Needs Review', color: 'text-yellow-600 bg-yellow-100' },
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
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Submission History</h1>
          <p className="text-sm text-gray-500">View and manage all student submissions, past and present.</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {essays.length === 0 ? (
          <div className="text-center py-16 px-4">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">No pending submissions.</h2>
            <p className="mt-1 text-sm text-gray-500">All student essays have been reviewed.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted On
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Review</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {essays.map((essay) => {
                        const currentStatus = statusInfo[essay.status] || statusInfo.pending;
                        return(
                          <tr key={essay.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{essay.user?.name}</div>
                              <div className="text-sm text-gray-500">{essay.user?.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1.5" />
                                {new Date(essay.submittedAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${currentStatus.color}`}>
                                {currentStatus.text}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${essay.paymentStatus === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {essay.paymentStatus || 'pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link to={`/admin/submissions/${essay.id}`} className="text-indigo-600 hover:text-indigo-900">
                                Review
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSubmissions;
