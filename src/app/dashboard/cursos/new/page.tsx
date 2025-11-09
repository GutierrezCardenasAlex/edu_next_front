"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCursoPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | "">(0);
  const [nivel, setNivel] = useState("Principiante");
  const [esGratuito, setEsGratuito] = useState(false);
  const [estado, setEstado] = useState("Borrador");

  const [categorias, setCategorias] = useState<any[]>([]);
  const [subcategorias, setSubcategorias] = useState<any[]>([]);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [subcategoriaId, setSubcategoriaId] = useState<number | "">("");
  const [docenteId, setDocenteId] = useState<number | "">("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const parseList = async (res: Response) => {
    try {
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data?.data && Array.isArray(data.data)) return data.data;
      if (data?.items && Array.isArray(data.items)) return data.items;
      if (data?.results && Array.isArray(data.results)) return data.results;
      const firstArray = Object.values(data).find(v => Array.isArray(v));
      if (firstArray) return firstArray as any[];
      return [];
    } catch (err) {
      console.error("parseList error:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        const [catRes, subcatRes, docRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subcategorias`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes`),
        ]);

        const [categoriasData, subcategoriasData, docentesData] = await Promise.all([
          parseList(catRes),
          parseList(subcatRes),
          parseList(docRes),
        ]);

        setCategorias(categoriasData);
        setSubcategorias(subcategoriasData);
        setDocentes(docentesData);
      } catch (err) {
        console.error("Error cargando listas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validaciones simples
    if (!titulo) return setErrors(["El título es obligatorio"]);
    if (!categoriaId) return setErrors(["Selecciona una categoría"]);
    if (!docenteId) return setErrors(["Selecciona un docente"]);

    try {
      const body = {
        titulo,
        descripcion,
        imagen_portada: "", // si usarás upload, cambiar más adelante
        categoria_id: categoriaId,
        subcategoria_id: subcategoriaId || null,
        docente_id: docenteId || null,
        precio: Number(precio) || 0,
        es_gratuito: esGratuito,
        nivel,
        estado,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cursos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msgs = data?.message ? (Array.isArray(data.message) ? data.message : [data.message]) : ["Error al crear curso"];
        setErrors(msgs);
        return;
      }

      router.push("/dashboard/cursos");
    } catch (err) {
      console.error(err);
      setErrors(["Error al procesar la solicitud"]);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando listas...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-gray-700 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Nuevo Curso</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Título</label>
          <input value={titulo} onChange={(e)=>setTitulo(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm mb-1">Categoría</label>
          <select value={categoriaId} onChange={(e)=>setCategoriaId(Number(e.target.value) || "")} className="w-full bg-gray-700 border px-3 py-2 rounded">
            <option value="">Seleccione categoría</option>
            {categorias.map(c=> <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Descripción</label>
          <textarea value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm mb-1">Subcategoría</label>
          <select value={subcategoriaId} onChange={(e)=>setSubcategoriaId(Number(e.target.value) || "")} className="w-full border px-3 py-2 rounded">
            <option value="">Seleccione subcategoría</option>
            {subcategorias.map(s=> <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Docente</label>
          <select value={docenteId} onChange={(e)=>setDocenteId(Number(e.target.value) || "")} className="w-full border px-3 py-2 rounded bg-gray-700">
            <option value="">Seleccione docente</option>
            {docentes.map(d=> <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Precio</label>
          <input type="number" value={precio as any} onChange={(e)=>setPrecio(Number(e.target.value))} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block bg-gray-700 text-sm mb-1">Nivel</label>
          <select value={nivel} onChange={(e)=>setNivel(e.target.value)} className="w-full bg-gray-700 border px-3 py-2 rounded">
            <option>Principiante</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <input type="checkbox" checked={esGratuito} onChange={(e)=>setEsGratuito(e.target.checked)} />
          <label>Curso gratuito</label>
        </div>

        <div>
          <label className="block text-sm mb-1">Estado</label>
          <select value={estado} onChange={(e)=>setEstado(e.target.value)} className="w-full bg-gray-700 border px-3 py-2 rounded">
            <option>Borrador</option>
            <option>Publicado</option>
            <option>Inactivo</option>
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          <button type="button" onClick={()=>router.push("/dashboard/cursos")} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>
      </form>

      {errors.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded">
          {errors.map((e,i)=><p key={i} className="text-red-700 text-sm">{e}</p>)}
        </div>
      )}
    </div>
  );
}
