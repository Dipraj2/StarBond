import React from 'react';

interface AnalyticsCardProps {
  title: string;
  value: number;
  description: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default AnalyticsCard;