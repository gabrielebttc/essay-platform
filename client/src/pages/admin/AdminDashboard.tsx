import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, DollarSign, Users, Clock } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Dummy data for stats
  const stats = [
    { name: 'Total Submissions', stat: '71,897', icon: BookOpen },
    { name: 'Pending Review', stat: '5,816', icon: Clock },
    { name: 'Registered Students', stat: '24,573', icon: Users },
    { name: 'Total Revenue', stat: '$58,162.00', icon: DollarSign },
  ];

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
          <h2 className="text-lg leading-6 font-medium text-gray-900">Last 30 days</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
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
            className="w-full block text-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Manage All Submissions
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;