import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

const DashboardCard = ({ title, value, icon, color }: DashboardCardProps) => {
  return (
    <div
      className={`p-5 rounded-xl shadow-md bg-white border-l-4 ${color ?? "border-indigo-500"}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="text-3xl text-indigo-600">{icon}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
