import React, { useState } from 'react';
import type { SubredditData } from '../types/subreddit';

interface Props {
  onDataSubmit: (data: SubredditData[]) => void;
  disabled?: boolean;
}

export const DataInput: React.FC<Props> = ({ onDataSubmit, disabled }) => {
  const [error, setError] = useState<string | null>(null);

  const parseSubredditData = (line: string): SubredditData | null => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return null;

    const parts = trimmedLine.split(/\s+/);
    if (parts.length < 2) return null;

    const subreddit = parts[0];
    const subscribers = parseInt(parts[1], 10);
    const moderator = parts[2] || 'None';

    if (!subreddit || isNaN(subscribers)) return null;

    return {
      subreddit,
      subscribers,
      moderator
    };
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setError(null);

    const pastedText = event.clipboardData.getData('text');
    if (!pastedText) {
      setError('No data was pasted');
      return;
    }

    const lines = pastedText.split('\n').filter(line => line.trim().length > 0);
    const parsedData: SubredditData[] = [];
    const errors: string[] = [];

    lines.forEach((line, index) => {
      const parsedLine = parseSubredditData(line);
      if (parsedLine) {
        parsedData.push(parsedLine);
      } else {
        errors.push(`Line ${index + 1}: Invalid format`);
      }
    });

    if (errors.length > 0) {
      setError(`Failed to parse some lines:\n${errors.join('\n')}`);
      return;
    }

    if (parsedData.length === 0) {
      setError('No valid data found');
      return;
    }

    onDataSubmit(parsedData);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-2">
          Paste data in the format:<br />
          <code className="bg-gray-100 px-2 py-1 rounded">subreddit subscribers moderator</code>
        </p>
        <p className="text-sm text-gray-600">
          Example:<br />
          <code className="bg-gray-100 px-2 py-1 rounded">MarvelFanArt 429 None</code>
        </p>
      </div>

      <textarea
        className={`w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`}
        placeholder="Paste your subreddit data here..."
        onPaste={handlePaste}
        disabled={disabled}
      />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 whitespace-pre-line">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        <p>Instructions:</p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Copy your subreddit data</li>
          <li>Click the text area above</li>
          <li>Paste (Ctrl+V or Cmd+V) your data</li>
          <li>Data will be automatically processed</li>
        </ol>
      </div>
    </div>
  );
};