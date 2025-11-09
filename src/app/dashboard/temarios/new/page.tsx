"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewTemarioPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: "",
    orden: 0,
    cursoId: "", 
  });
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cursos`)
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch((err) => console.error("Error al cargar cursos:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      titulo: form.titulo,
      orden: Number(form.orden),
      cursoId: Number(form.cursoId), 
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/temarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al crear temario:", errorData);
        alert("Error al guardar el temario. Revisa la consola para más detalles.");
        return;
      }

      router.push("/dashboard/temarios");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Nuevo Temario
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Primera fila: dos columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                Título
                </label>
                <input
                type="text"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                Orden
                </label>
                <input
                type="number"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.orden}
                onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
                />
            </div>
            </div>

            {/* Segunda fila: una columna completa */}
            <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
                Curso
            </label>
            <select
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.cursoId}
                onChange={(e) => setForm({ ...form, cursoId: e.target.value })}
                required
            >
                <option value="">Seleccione curso</option>
                {cursos.map((c: any) => (
                <option key={c.id} value={c.id}>
                    {c.titulo}
                </option>
                ))}
            </select>
            </div>

            {/* Tercera fila: tres columnas para acciones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <button
                type="button"
                onClick={() => router.push("/dashboard/temarios")}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-md transition-colors"
            >
                Cancelar
            </button>

            <button
                type="reset"
                onClick={() => setForm({ titulo: "", orden: 0, cursoId: "" })}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-md transition-colors"
            >
                Limpiar
            </button>

            <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition-colors"
            >
                Guardar
            </button>
            </div>
        </form>
    </div>

  );
}
