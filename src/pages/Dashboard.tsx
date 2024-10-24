import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataInput } from '../components/DataInput';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import { PurgeButton } from '../components/PurgeButton';
import { SubredditTable } from '../components/SubredditTable';
import { useAuth } from '../hooks/useAuth';
import type { SubredditData, SortField, SortDirection } from '../types/subreddit';
import { insertSubreddits, purgeDatabase, getAllSubreddits, deleteSubreddits } from '../lib/db';
import { Save } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SubredditData[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('subscribers');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    loadData();
  }, [navigate, isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
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

  const handleDataSubmit = async (newData: SubredditData[]) => {
    setIsLoading(true);
    setError(null);
    try {
      await insertSubreddits(newData);
      await loadData();
    } catch (err) {
      console.error('Error inserting data:', err);
      setError('Failed to save data to database');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setSaveStatus('saving');
    try {
      await insertSubreddits(data);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Error saving data:', err);
      setSaveStatus('error');
      setError('Failed to save data to database');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handlePurge = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await purgeDatabase();
      setData([]);
      setSelectedItems(new Set());
    } catch (err) {
      console.error('Error purging database:', err);
      setError('Failed to purge database');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;

    setIsLoading(true);
    setError(null);
    try {
      await deleteSubreddits(Array.from(selectedItems));
      await loadData();
      setSelectedItems(new Set());
    } catch (err) {
      console.error('Error deleting items:', err);
      setError('Failed to delete selected items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelect = (subreddit: string) => {
    setSelectedItems(current => {
      const newSet = new Set(current);
      if (newSet.has(subreddit)) {
        newSet.delete(subreddit);
      } else {
        newSet.add(subreddit);
      }
      return newSet;
    });
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Data Input</h2>
          <DataInput onDataSubmit={handleDataSubmit} disabled={isLoading} />
          {error && (
            <div className="mt-4 text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Manage Data</h2>
            <div className="space-x-4">
              {selectedItems.size > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  disabled={isLoading}
                  className="btn bg-red-600 hover:bg-red-700"
                >
                  Delete Selected ({selectedItems.size})
                </button>
              )}
              <PurgeButton onPurge={handlePurge} disabled={isLoading} />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              <SubredditTable
                data={sortedData}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                selectedItems={selectedItems}
                onToggleSelect={handleToggleSelect}
                onDelete={(subreddit) => deleteSubreddits([subreddit]).then(loadData)}
                isAdmin={true}
              />
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveAll}
                  disabled={isLoading || saveStatus === 'saving'}
                  className={`btn flex items-center space-x-2 ${
                    saveStatus === 'saved' ? 'bg-green-600 hover:bg-green-700' :
                    saveStatus === 'error' ? 'bg-red-600 hover:bg-red-700' :
                    'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {saveStatus === 'saving' ? 'Saving...' :
                     saveStatus === 'saved' ? 'Saved!' :
                     saveStatus === 'error' ? 'Error Saving' :
                     'Save All Changes'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};