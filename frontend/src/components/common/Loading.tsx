import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  center?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  center = true,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const content = (
    <div className="flex items-center space-x-2">
      <div
        className={`${sizeClasses[size]} border-2 border-blue-600 border-t-transparent rounded-full animate-spin`}
      />
      {text && (
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>{text}</span>
      )}
    </div>
  );

  if (center) {
    return (
      <div className="flex justify-center items-center py-8">{content}</div>
    );
  }

  return content;
};

export default Loading;
