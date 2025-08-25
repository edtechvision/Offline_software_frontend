import React from 'react';

const KPICard = ({ title, value, color = 'accent', icon: IconComponent }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'accent':
        return 'bg-accent text-white';
      case 'accent-green':
        return 'bg-accent-green text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'teal':
        return 'bg-teal-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'red':
        return 'bg-red-500 text-white';
      case 'yellow':
        return 'bg-yellow-500 text-white';
      case 'gray':
        return 'bg-gray-600 text-white';
      case 'primary-900':
        return 'bg-primary-900 text-white';
      default:
        return 'bg-accent text-white';
    }
  };

  return (
    <div className={`${getColorClasses(color)} rounded-lg p-4 shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold opacity-90">{title}</h3>
        {IconComponent && (
          <div className="text-xl opacity-80">
            <IconComponent />
          </div>
        )}
      </div>
      
      <div className="text-2xl font-bold mb-2">{value}</div>
      
      {/* Status indicator for Find Fees card */}
      {title === 'Find Fees' && (
        <div className="text-xs opacity-80">Status</div>
      )}
    </div>
  );
};

export default KPICard;
