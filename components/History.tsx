import React from 'react';
import { HistoryItem } from '../types';
import { HistoryIcon } from './IconComponents';

interface HistoryProps {
  history: HistoryItem[];
  isLoading: boolean;
}

const History: React.FC<HistoryProps> = ({ history, isLoading }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };
  
  return (
    <div className="bg-surface-light/80 backdrop-blur-sm border border-border-color p-6 rounded-2xl mt-8">
      <h3 className="flex items-center gap-2 text-lg font-bold text-text-light mb-4">
        <HistoryIcon className="w-5 h-5" />
        Recent Generations
      </h3>
      {isLoading && !history.length ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-surface rounded-lg"></div>
          ))}
        </div>
      ) : history.length > 0 ? (
        <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
          {history.map((item) => (
            <li key={item.id} className="p-3 bg-surface rounded-lg hover:bg-surface-light transition-colors duration-200">
              <p className="font-semibold text-text-light truncate">{item.game_name}</p>
              <div className="flex justify-between items-center text-xs text-text-muted mt-1">
                <span className="capitalize">{item.guide_type.replace(/_/g, ' ')} / {item.platform}</span>
                <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-text-muted text-center py-4">No history yet. Generate a guide to get started!</p>
      )}
    </div>
  );
};

export default History;
