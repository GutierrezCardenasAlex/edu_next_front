"use client";

import Link from "next/link";
import { LayoutDashboard, BookOpen, Users, Settings, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleSubmenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const links = [
    { name: "Inicio", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Usuarios", href: "/dashboard/usuarios", icon: <Users size={20} /> },
    {
      name: "Cursos",
      icon: <BookOpen size={20} />,
      submenu: [
        { name: "Lista de cursos", href: "/dashboard/cursos" },
        { name: "Temas", href: "/dashboard/temarios" },
        { name: "Categorías", href: "/dashboard/categorias" },
        { name: "Lecciones", href: "/dashboard/lecciones" },
        { name: "Inscripciones", href: "/dashboard/inscripciones" },
        { name: "Certificados", href: "/dashboard/certificados" },
      ],
    },
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
            <div key={link.name}>
              {/* Si tiene submenú */}
              {link.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(link.name)}
                    className={`flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname.startsWith("/dashboard/cursos")
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-gray-800 hover:text-indigo-400"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {link.icon}
                      {link.name}
                    </span>
                    {openMenu === link.name ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>

                  {/* Submenú */}
                  {openMenu === link.name && (
                    <div className="ml-8 mt-2 space-y-1">
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                            pathname === sub.href
                              ? "bg-indigo-500 text-white"
                              : "hover:bg-gray-800 hover:text-indigo-400"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Link normal sin submenú
                <Link
                  href={link.href!}
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
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
