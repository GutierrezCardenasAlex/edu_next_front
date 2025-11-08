"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditTemarioPage() {
  const { id } = useParams();
  const router = useRouter();
  const [temario, setTemario] = useState<any>(null);
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [temarioRes, cursosRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/temarios/${id}`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cursos`),
      ]);
      const temarioData = await temarioRes.json();
      const cursosData = await cursosRes.json();

      // Ajustar el valor inicial del select
      setTemario({
        ...temarioData,
        cursoId: temarioData.curso?.id || "",
      });
      setCursos(cursosData);
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/temarios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: temario.titulo,
          orden: temario.orden,
          cursoId: temario.cursoId, // 👈 nombre corregido
        }),
      });

      const data = await res.json();
      console.log("Respuesta del backend:", data);

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar el temario");
      }

      router.push("/dashboard/temarios");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "No se pudo actualizar el temario.");
    }
  };

  if (!temario) return <p className="text-gray-400">Cargando...</p>;

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Editar Temario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Título</label>
          <input
            type="text"
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
            value={temario.titulo}
            onChange={(e) => setTemario({ ...temario, titulo: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Orden</label>
          <input
            type="number"
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
            value={temario.orden}
            onChange={(e) => setTemario({ ...temario, orden: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Curso</label>
          <select
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
            value={temario.cursoId || ""}
            onChange={(e) => setTemario({ ...temario, cursoId: Number(e.target.value) })}
          >
            <option value="">Seleccione curso</option>
            {cursos.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/temarios")}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
