import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import { SubredditTable } from '../components/SubredditTable';
import type { SubredditData, SortField, SortDirection } from '../types/subreddit';
import { getAllSubreddits } from '../lib/db';

export const HomePage: React.FC = () => {
  const [data, setData] = useState<SubredditData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('subscribers');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    const loadData = async () => {
      try {
        const subreddits = await getAllSubreddits();
        setData(subreddits);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data from database');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSort = (field: SortField) => {
    setSortDirection(current => field === sortField ? (current === 'asc' ? 'desc' : 'asc') : 'desc');
    setSortField(field);
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return sortDirection === 'asc' 
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : data.length > 0 ? (
          <SubredditTable
            data={sortedData}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Data Available</h2>
            <p className="text-gray-600">Please use the admin panel to upload subreddit data.</p>
          </div>
        )}
      </main>
    </div>
  );
};