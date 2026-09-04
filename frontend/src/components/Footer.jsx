import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-800">QuickBite</span>
          <span>— Skip the Queue. Enjoy Your Food.</span>
        </div>
        <div>
          <p className="text-xs text-gray-400">
            College Canteen Pre-Ordering System
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
