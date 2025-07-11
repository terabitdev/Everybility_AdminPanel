import React from 'react';

const MetricsCard = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl px-6 pb-14 pt-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primaryBlack font-nunitoSansRegular opacity-70  text-[17px] mb-2">{metric.title}</p>
              <p className="text-3xl font-nunitoSansBold font-bold text-primaryBlack">{metric.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-full ${metric.bgColor} flex items-center justify-center`}>
              <img 
                src={metric.icon} 
                alt={metric.title}
                className="w-6 h-6"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCard; 