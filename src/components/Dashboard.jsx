import React from 'react';
import Layout from './Layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Dashboard</h2>
        <p className="text-gray-600">
          This is a protected dashboard page. Only authenticated users can see this content.
        </p>
      </div>
    </Layout>
  );
};

export default Dashboard;