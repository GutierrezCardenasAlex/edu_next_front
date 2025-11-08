"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewLeccionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo: "video",
    urlRecurso: "",
    duracion: 0,
    orden: 0,
    temarioId: "",
  });
  const [temarios, setTemarios] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/temarios`)
      .then((res) => res.json())
      .then((data) => setTemarios(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lecciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) router.push("/dashboard/lecciones");
    else alert("Error al guardar la lección");
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Nueva Lección</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          required
        />

        <textarea
          placeholder="Descripción"
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        />

        <select
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        >
          <option value="video">Video</option>
          <option value="documento">Documento</option>
          <option value="enlace">Enlace</option>
          <option value="quiz">Quiz</option>
        </select>

        <input
          type="text"
          placeholder="URL recurso (opcional)"
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
          value={form.urlRecurso}
          onChange={(e) => setForm({ ...form, urlRecurso: e.target.value })}
        />

        <input
          type="number"
          placeholder="Duración (min)"
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
          value={form.duracion}
          onChange={(e) => setForm({ ...form, duracion: Number(e.target.value) })}
        />

        <input
          type="number"
          placeholder="Orden"
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
          value={form.orden}
          onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
        />

        <select
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
          value={form.temarioId}
          onChange={(e) => setForm({ ...form, temarioId: e.target.value })}
        >
          <option value="">Seleccione Temario</option>
          {temarios.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.titulo}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/lecciones")}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
