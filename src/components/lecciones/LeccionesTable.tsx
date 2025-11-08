"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye } from "lucide-react";

export default function LeccionesTable() {
  const [lecciones, setLecciones] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(5);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lecciones`)
      .then((res) => res.json())
      .then((data) => setLecciones(data));
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta lección?")) {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lecciones/${id}`, {
        method: "DELETE",
      });
      setLecciones(lecciones.filter((l) => l.id !== id));
    }
  };

  const filtradas = lecciones.filter(
    (l) =>
      l.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.temario?.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const inicio = (pagina - 1) * porPagina;
  const paginadas = filtradas.slice(inicio, inicio + porPagina);
  const totalPaginas = Math.ceil(filtradas.length / porPagina);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar lección..."
          className="bg-gray-700 text-white px-3 py-2 rounded-md w-1/3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          onClick={() => router.push("/dashboard/lecciones/new")}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
        >
          + Nueva Lección
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Título</th>
              <th className="px-4 py-2 text-left">Temario</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Duración</th>
              <th className="px-4 py-2 text-left">Orden</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginadas.map((l) => (
              <tr key={l.id} className="border-b border-gray-700">
                <td className="px-4 py-2">{l.id}</td>
                <td className="px-4 py-2">{l.titulo}</td>
                <td className="px-4 py-2">{l.temario?.titulo || "-"}</td>
                <td className="px-4 py-2 capitalize">{l.tipo}</td>
                <td className="px-4 py-2">{l.duracion} min</td>
                <td className="px-4 py-2">{l.orden}</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/lecciones/edit/${l.id}`)
                    }
                    className="p-2 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="p-2 bg-red-600 rounded hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* paginación */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={pagina === 1}
          onClick={() => setPagina(pagina - 1)}
          className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-2">{pagina} / {totalPaginas}</span>
        <button
          disabled={pagina === totalPaginas}
          onClick={() => setPagina(pagina + 1)}
          className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
