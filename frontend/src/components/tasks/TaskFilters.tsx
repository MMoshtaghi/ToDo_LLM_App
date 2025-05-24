import React from 'react';
import Button from '../common/Button';

interface TaskFiltersProps {
  currentFilter: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { key: 'all' as const, label: 'All Tasks' },
    { key: 'pending' as const, label: 'Pending' },
    { key: 'completed' as const, label: 'Completed' }
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
      {filters.map(filter => (
        <Button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          variant={currentFilter === filter.key ? 'primary' : 'ghost'}
          size="sm"
          className={`font-medium rounded-md transition-colors ${
            currentFilter === filter.key
              ? 'shadow-sm'
              : ''
          }`}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default TaskFilters;