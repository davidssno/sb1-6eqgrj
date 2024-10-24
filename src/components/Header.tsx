import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <Ghost className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Abandoned Subreddits
            </h1>
          </Link>
        </div>
      </div>
    </header>
  );
};