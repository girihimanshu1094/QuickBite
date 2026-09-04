import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      <p className="mt-3 text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
};

export default Loading;
