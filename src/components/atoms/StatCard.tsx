import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="bg-white border border-gray-200 h-[157px] w-[168px] rounded-[14px] flex flex-col items-center justify-center shadow-sm">
      <p className="text-[14px] text-gray-400 font-light mb-4">{label}</p>
      <p className="text-[32px] font-medium text-black">{value}</p>
    </div>
  );
};

export default StatCard;
