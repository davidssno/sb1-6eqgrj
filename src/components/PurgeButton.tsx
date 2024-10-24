import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface Props {
  onPurge: () => void;
  disabled?: boolean;
}

export const PurgeButton: React.FC<Props> = ({ onPurge, disabled }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePurge = () => {
    if (showConfirm) {
      onPurge();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handlePurge}
        disabled={disabled}
        className={`flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        {showConfirm ? 'Confirm Purge' : 'Purge Database'}
      </button>
      {showConfirm && !disabled && (
        <button
          onClick={() => setShowConfirm(false)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      )}
    </div>
  );
};