"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditLeccionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [leccion, setLeccion] = useState<any>(null);
  const [temarios, setTemarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [lecRes, temRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lecciones/${id}`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/temarios`),
      ]);

      const lecData = await lecRes.json();
      const temData = await temRes.json();

      // Normalizar datos para el formulario
      setLeccion({
        titulo: lecData.titulo || "",
        descripcion: lecData.descripcion || "",
        tipo: lecData.tipo || "video",
        urlRecurso: lecData.urlRecurso || "",
        archivo: lecData.archivo || "",
        duracion: lecData.duracion || 0,
        orden: lecData.orden || 0,
        temarioId: lecData.temario?.id || "",
      });

      setTemarios(temData);
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construir body limpio con solo los campos válidos
    const body = {
      temarioId: leccion.temarioId,
      titulo: leccion.titulo,
      descripcion: leccion.descripcion,
      tipo: leccion.tipo,
      urlRecurso: leccion.urlRecurso,
      archivo: leccion.archivo,
      duracion: leccion.duracion,
      orden: leccion.orden,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lecciones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/dashboard/lecciones");
    } else {
      const errorText = await res.text();
      console.error("Respuesta del backend:", errorText);
      alert("Error al actualizar la lección");
    }
  };

  if (!leccion) return <p className="text-gray-400">Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg">
  <h2 className="text-2xl font-bold text-white mb-6 text-center">Editar Lección</h2>

  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Primera fila: Título y Descripción */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Título
        </label>
        <input
          type="text"
          value={leccion.titulo}
          onChange={(e) => setLeccion({ ...leccion, titulo: e.target.value })}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Descripción
        </label>
        <textarea
          value={leccion.descripcion}
          onChange={(e) => setLeccion({ ...leccion, descripcion: e.target.value })}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 h-[90px]"
        />
      </div>
    </div>

    {/* Segunda fila: Tipo y URL */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Tipo de recurso
        </label>
        <select
          value={leccion.tipo}
          onChange={(e) => setLeccion({ ...leccion, tipo: e.target.value })}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
        >
          <option value="video">Video</option>
          <option value="documento">Documento</option>
          <option value="enlace">Enlace</option>
          <option value="quiz">Quiz</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          URL del recurso
        </label>
        <input
          type="text"
          value={leccion.urlRecurso}
          onChange={(e) => setLeccion({ ...leccion, urlRecurso: e.target.value })}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
          placeholder="https://..."
        />
      </div>
    </div>

    {/* Tercera fila: Duración, Orden, y Temario */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Duración (min)
        </label>
        <input
          type="number"
          value={leccion.duracion}
          onChange={(e) => setLeccion({ ...leccion, duracion: Number(e.target.value) })}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Orden
        </label>
        <input
          type="number"
          value={leccion.orden}
          onChange={(e) => setLeccion({ ...leccion, orden: Number(e.target.value) })}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Temario
        </label>
        <select
          value={leccion.temarioId}
          onChange={(e) => setLeccion({ ...leccion, temarioId: Number(e.target.value) })}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
        >
          {temarios.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.titulo}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Cuarta fila: Botones de acción */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <button
        type="button"
        onClick={() => router.push("/dashboard/lecciones")}
        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-md transition-colors"
      >
        Cancelar
      </button>

      <button
        type="reset"
        onClick={() =>
          setLeccion({
            titulo: "",
            descripcion: "",
            tipo: "video",
            urlRecurso: "",
            duracion: 0,
            orden: 0,
            temarioId: "",
          })
        }
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-md transition-colors"
      >
        Limpiar
      </button>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition-colors"
      >
        Guardar Cambios
      </button>
    </div>
  </form>
</div>

  );
}
