"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCursoPage() {
  const { id } = useParams();
  const router = useRouter();

  const [curso, setCurso] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [subcategorias, setSubcategorias] = useState<any[]>([]);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parseList = async (res: Response) => {
      try {
        const data = await res.json();
        if (Array.isArray(data)) return data;
        if (data?.data && Array.isArray(data.data)) return data.data;
        const firstArray = Object.values(data).find((v) => Array.isArray(v));
        return firstArray || [];
      } catch {
        return [];
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const [cursoRes, catRes, subcatRes, docRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cursos/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subcategorias`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes`),
        ]);

        if (!cursoRes.ok) throw new Error(`Error cargando curso: ${cursoRes.status}`);

        const cursoData = await cursoRes.json();
        const [categoriasData, subcategoriasData, docentesData] = await Promise.all([
          parseList(catRes),
          parseList(subcatRes),
          parseList(docRes),
        ]);

        setCurso(cursoData);
        setCategorias(categoriasData);
        setSubcategorias(subcategoriasData);
        setDocentes(docentesData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Actualizar curso
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const body = {
        titulo: curso.titulo,
        descripcion: curso.descripcion || "",
        imagen_portada: curso.imagen_portada || "",
        categoria_id: curso.categoria_id ? Number(curso.categoria_id) : null,
        subcategoria_id: curso.subcategoria_id ? Number(curso.subcategoria_id) : null,
        docente_id: Number(curso.docente_id),
        precio: curso.precio ? Number(curso.precio) : 0,
        es_gratuito: Boolean(curso.es_gratuito),
        nivel: curso.nivel,
        estado: curso.estado,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cursos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Error al actualizar curso: ${res.status} - ${errText}`);
      }

      router.push("/dashboard/cursos");
    } catch (err) {
      console.error(" Error al actualizar curso:", err);
      alert("Error al actualizar curso. Ver consola para más detalles.");
    }
  };

  if (loading) return <p className="text-gray-600">Cargando...</p>;
  if (!curso) return <p>No se encontró el curso.</p>;

  return (
    <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Editar Curso</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna 1 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Título</label>
            <input
              type="text"
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded-md"
              value={curso.titulo}
              onChange={(e) => setCurso({ ...curso, titulo: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Descripción</label>
            <textarea
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded-md"
              rows={3}
              value={curso.descripcion || ""}
              onChange={(e) => setCurso({ ...curso, descripcion: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Imagen de portada (URL)</label>
            <input
              type="text"
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded-md"
              value={curso.imagen_portada || ""}
              onChange={(e) => setCurso({ ...curso, imagen_portada: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Precio</label>
            <input
              type="number"
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded-md"
              value={curso.precio || 0}
              onChange={(e) => setCurso({ ...curso, precio: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Categoría</label>
            <select
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded-md"
              value={curso.categoria_id || ""}
              onChange={(e) => setCurso({ ...curso, categoria_id: Number(e.target.value) })}
            >
              <option value="">Seleccione categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Subcategoría</label>
            <select
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded-md"
              value={curso.subcategoria_id || ""}
              onChange={(e) => setCurso({ ...curso, subcategoria_id: Number(e.target.value) })}
            >
              <option value="">Seleccione subcategoría</option>
              {subcategorias.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Docente</label>
            <select
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded-md"
              value={curso.docente_id || ""}
              onChange={(e) => setCurso({ ...curso, docente_id: Number(e.target.value) })}
            >
              <option value="">Seleccione docente</option>
              {docentes.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Nivel</label>
            <select
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded-md"
              value={curso.nivel}
              onChange={(e) => setCurso({ ...curso, nivel: e.target.value })}
            >
              <option>Principiante</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Estado</label>
            <select
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded-md"
              value={curso.estado}
              onChange={(e) => setCurso({ ...curso, estado: e.target.value })}
            >
              <option>Borrador</option>
              <option>Publicado</option>
              <option>Inactivo</option>
            </select>
          </div>

          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              checked={curso.es_gratuito || false}
              onChange={(e) => setCurso({ ...curso, es_gratuito: e.target.checked })}
            />
            <span>Curso gratuito</span>
          </label>
        </div>

        <div className="col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard/cursos")}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
