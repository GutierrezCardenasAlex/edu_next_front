"use client";

import Link from "next/link";
import { LayoutDashboard, BookOpen, Users, Settings, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Inicio", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Cursos", href: "/dashboard/courses", icon: <BookOpen size={20} /> },
    { name: "Estudiantes", href: "/dashboard/students", icon: <Users size={20} /> },
    { name: "Configuración", href: "/dashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Botón hamburguesa (visible solo en móvil) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 p-2 rounded-md text-white hover:bg-indigo-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 bg-gray-900 text-gray-100 w-64 min-h-screen flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-6 py-5 text-xl font-bold tracking-wide border-b border-gray-700 flex items-center justify-between">
          🎓 Udemy Clone
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-800 hover:text-indigo-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
