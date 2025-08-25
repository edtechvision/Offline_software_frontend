import React from 'react';

const FeePage = () => {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-lg p-4 shadow-lg">
        <h1 className="text-xl font-bold text-white">Fee Management</h1>
      </div>
      
      <div className="bg-bg-primary rounded-lg p-4 shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Fee Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { month: 'January 2025', collected: '₹ 125000', pending: '₹ 25000' },
            { month: 'February 2025', collected: '₹ 118000', pending: '₹ 32000' },
            { month: 'March 2025', collected: '₹ 132000', pending: '₹ 18000' },
            { month: 'April 2025', collected: '₹ 145000', pending: '₹ 15000' },
            { month: 'May 2025', collected: '₹ 128000', pending: '₹ 22000' },
            { month: 'June 2025', collected: '₹ 156000', pending: '₹ 14000' }
          ].map((fee, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-text-primary mb-2">{fee.month}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Collected:</span>
                  <span className="text-sm font-medium text-accent-green">{fee.collected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Pending:</span>
                  <span className="text-sm font-medium text-red-500">{fee.pending}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeePage;
