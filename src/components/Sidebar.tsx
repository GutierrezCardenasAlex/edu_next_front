// src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  FileText,
  BarChart3,
  Trophy,
  Star,
  Calendar,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/SessionWrapper";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { user, isAdmin, isInstructor, isUser } = useAuth();

  const toggleSubmenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Si no hay usuario → no mostrar sidebar
  if (!user) return null;

  // Opciones comunes
  const commonLinks = [
    { name: "Inicio", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Mis Cursos", href: "/dashboard/mis-cursos", icon: <BookOpen size={20} /> },
    { name: "Configuración", href: "/dashboard/settings", icon: <Settings size={20} /> },
  ];

  // Opciones solo para admin
  const adminLinks = [
    { name: "Usuarios", href: "/dashboard/usuarios", icon: <Users size={20} /> },
    {
      name: "Gestión de Cursos",
      icon: <FileText size={20} />,
      submenu: [
        { name: "Todos los cursos", href: "/dashboard/cursos" },
        { name: "Categorías", href: "/dashboard/cursos/categorias" },
        { name: "Temas", href: "/dashboard/temarios" },
        { name: "Lecciones", href: "/dashboard/lecciones" },
        { name: "Inscripciones", href: "/dashboard/inscripciones" },
        { name: "Certificados", href: "/dashboard/cursos/certificados" },
      ],
    },
    { name: "Reportes", href: "/dashboard/reportes", icon: <BarChart3 size={20} /> },
  ];

  // Opciones solo para instructor
  const instructorLinks = [
    {
      name: "Crear Curso",
      icon: <GraduationCap size={20} />,
      href: "/dashboard/cursos/crear",
    },
    { name: "Estudiantes", href: "/dashboard/cursos/estudiantes", icon: <Users size={20} /> },
    // En instructorLinks
    { name: "Citas", href: "/dashboard/citas", icon: <Calendar size={20} /> },
  ];

  // Opciones solo para estudiante
  const studentLinks = [
    { name: "Mis Progresos", href: "/dashboard/progreso", icon: <Trophy size={20} /> },
    { name: "Certificados", href: "/dashboard/certificados", icon: <Star size={20} /> },
  ];

  // Construir links según rol
  const links = [
    ...commonLinks,
    ...(isAdmin ? adminLinks : []),
    ...(isInstructor ? instructorLinks : []),
    ...(isUser ? studentLinks : []),
  ];

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Botón móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-20 left-4 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
        aria-label="Menú"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-gray-900 text-gray-100
          flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">
            {isAdmin ? "Panel Admin" : isInstructor ? "Panel Instructor" : "Panel Estudiante"}
          </h2>
          <p className="text-xs text-gray-400 mt-1 truncate">
            {user.email}
          </p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <div key={link.name}>
              {link.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(link.name)}
                    className={`
                      w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${pathname.startsWith(link.submenu[0].href.split('/')[1])
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    <span className="flex items-center gap-3">
                      {link.icon}
                      {link.name}
                    </span>
                    {openMenu === link.name ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  {openMenu === link.name && (
                    <div className="ml-8 mt-2 space-y-1">
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`
                            block px-3 py-1.5 rounded-md text-sm
                            ${pathname === sub.href
                              ? "bg-purple-500 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }
                          `}
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${pathname === link.href
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            © 2025 LearnHub
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;