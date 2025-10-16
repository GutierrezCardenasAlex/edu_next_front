"use client";

import { Bell } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="flex justify-between items-center bg-white shadow px-8 py-4 sticky top-0 z-30">
      <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell className="text-gray-500 hover:text-indigo-600 transition" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
          + Nuevo Curso
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
