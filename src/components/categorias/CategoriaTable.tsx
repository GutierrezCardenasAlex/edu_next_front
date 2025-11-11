"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  parent_id?: number;
  parent?: { id: number; nombre: string };
}

export default function CategoriaTable() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(5);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/categorias`);
        if (!res.ok) throw new Error("Error al cargar categorías");
        const data = await res.json();
        setCategorias(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, [API_URL]);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      const res = await fetch(`${API_URL}/categorias/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      setCategorias(categorias.filter((c) => c.id !== id));
      alert("Categoría eliminada correctamente");
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la categoría");
    }
  };

  const filtradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const inicio = (pagina - 1) * porPagina;
  const paginadas = filtradas.slice(inicio, inicio + porPagina);
  const totalPaginas = Math.ceil(filtradas.length / porPagina);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Buscar categoría..."
          className="bg-gray-700 px-3 py-2 rounded-md w-1/3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          onClick={() => router.push("/dashboard/categorias/new")}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
        >
          + Nueva Categoría
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Cargando...</p>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-left">
                <th className="p-3 border-b border-gray-700">#</th>
                <th className="p-3 border-b border-gray-700">Nombre</th>
                <th className="p-3 border-b border-gray-700">Descripción</th>
                <th className="p-3 border-b border-gray-700">Padre</th>
                <th className="p-3 border-b border-gray-700 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginadas.length > 0 ? (
                paginadas.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-800">
                    <td className="p-3 border-b border-gray-700">{cat.id}</td>
                    <td className="p-3 border-b border-gray-700">{cat.nombre}</td>
                    <td className="p-3 border-b border-gray-700">
                      {cat.descripcion || "—"}
                    </td>
                    <td className="p-3 border-b border-gray-700">
                      {cat.parent?.nombre || "—"}
                    </td>
                    <td className="p-3 border-b border-gray-700 text-center space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/categorias/edit/${cat.id}`)
                        }
                        className="p-2 rounded-md bg-yellow-500 hover:bg-yellow-600"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 rounded-md bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400 italic">
                    No hay categorías registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-400">
              Página {pagina} de {totalPaginas || 1}
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagina === 1}
                onClick={() => setPagina(pagina - 1)}
                className="bg-gray-700 px-3 py-1 rounded-md disabled:opacity-50">
                Anterior
              </button>
              <button
                disabled={pagina === totalPaginas || totalPaginas === 0}
                onClick={() => setPagina(pagina + 1)}
                className="bg-gray-700 px-3 py-1 rounded-md disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
