import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, AdminStats } from '../../services/admin';
import { BookOpen, DollarSign, Users, Clock, Loader2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getDashboardStats()
      .then(data => setStats(data))
      .catch(() => setError('Failed to fetch dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { name: 'Total Submissions', stat: stats?.totalSubmissions, icon: BookOpen },
    { name: 'Pending Review', stat: stats?.pendingSubmissions, icon: Clock },
    { name: 'Registered Students', stat: stats?.registeredStudents, icon: Users },
    { name: 'Total Revenue', stat: `$${parseFloat(stats?.totalRevenue || '0').toLocaleString()}`, icon: DollarSign },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-12 w-12 text-indigo-600" /></div>;
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of the platform.</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-lg leading-6 font-medium text-gray-900">Platform Statistics</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((item) => (
              <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{item.stat}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link
            to="/admin/submissions"
            className="w-full block text-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Manage All Submissions
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;