import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import type { SubredditData, SortField, SortDirection } from '../types/subreddit';

interface Props {
  data: SubredditData[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  selectedItems?: Set<string>;
  onToggleSelect?: (subreddit: string) => void;
  onDelete?: (subreddit: string) => void;
  isAdmin?: boolean;
}

export const SubredditTable: React.FC<Props> = ({
  data,
  sortField,
  sortDirection,
  onSort,
  selectedItems,
  onToggleSelect,
  onDelete,
  isAdmin = false,
}) => {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {isAdmin && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={selectedItems && data.length > 0 && data.every(item => selectedItems.has(item.subreddit))}
                    onChange={() => {
                      if (!onToggleSelect) return;
                      const allSelected = data.every(item => selectedItems?.has(item.subreddit));
                      data.forEach(item => onToggleSelect(item.subreddit));
                    }}
                  />
                </th>
              )}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('subreddit')}
              >
                <div className="flex items-center space-x-1">
                  <span>Subreddit</span>
                  <SortIcon field="subreddit" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('subscribers')}
              >
                <div className="flex items-center space-x-1">
                  <span>Subscribers</span>
                  <SortIcon field="subscribers" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('moderator')}
              >
                <div className="flex items-center space-x-1">
                  <span>Moderator</span>
                  <SortIcon field="moderator" />
                </div>
              </th>
              {isAdmin && onDelete && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.subreddit} className="hover:bg-gray-50">
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedItems?.has(item.subreddit) || false}
                      onChange={() => onToggleSelect?.(item.subreddit)}
                    />
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.subreddit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.subscribers.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.moderator}
                </td>
                {isAdmin && onDelete && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onDelete(item.subreddit)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};