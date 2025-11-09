"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Temario {
  id: number;
  titulo: string;
  orden: number;
  curso?: { id: number; titulo: string };
  createdAt?: string;
}

interface Props {
  temarios: Temario[];
  onDelete: (id: number) => void;
}

export default function TemarioTable({ temarios, onDelete }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar temarios según búsqueda
  const filteredTemarios = useMemo(() => {
    return temarios.filter((t) =>
      t.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [temarios, searchTerm]);

  // Paginación
  const totalPages = Math.ceil(filteredTemarios.length / itemsPerPage);
  const paginatedTemarios = filteredTemarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      {/* Buscador */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar temario..."
          className="px-3 py-2 w-64 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <p className="text-gray-400 text-sm">
          Mostrando {paginatedTemarios.length} de {filteredTemarios.length}
        </p>
      </div>

      {/*Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-sm text-left text-gray-300">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="px-4 py-3">Id</th>
              <th className="px-4 py-3">Título Tema</th>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3">Creado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTemarios.length > 0 ? (
              paginatedTemarios.map((t, index) => (
                <tr
                  key={t.id}
                  className="border-t border-gray-700 hover:bg-gray-700/60 transition"
                >
                  <td className="px-4 py-3">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3">{t.titulo}</td>
                  <td className="px-4 py-3">{t.curso?.titulo || "—"}</td>
                  <td className="px-4 py-3">{t.orden}</td>
                  <td className="px-4 py-3">
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <Link
                      href={`/dashboard/temarios/edit/${t.id}`}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-white text-xs"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white text-xs"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  No se encontraron temarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-700 text-gray-500"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            Anterior
          </button>

          <span className="text-gray-300">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-700 text-gray-500"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
