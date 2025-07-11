import React from 'react';

const MetricsCard = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCard; 