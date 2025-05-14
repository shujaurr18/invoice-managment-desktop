import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-700';
  };
  
  return (
    <div className="bg-indigo-900 text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8">Invoice Manager</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard" className={`block p-3 rounded-lg ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/scan" className={`block p-3 rounded-lg ${isActive('/scan')}`}>
                Scan Invoice
              </Link>
            </li>
            <li>
              <Link to="/create" className={`block p-3 rounded-lg ${isActive('/create')}`}>
                Create Invoice
              </Link>
            </li>
            <li>
              <Link to="/invoices" className={`block p-3 rounded-lg ${isActive('/invoices')}`}>
                View Invoices
              </Link>
            </li>
            <li>
              <Link to="/export" className={`block p-3 rounded-lg ${isActive('/export')}`}>
                Export Data
              </Link>
            </li>
            <li>
              <Link to="/settings" className={`block p-3 rounded-lg ${isActive('/settings')}`}>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 