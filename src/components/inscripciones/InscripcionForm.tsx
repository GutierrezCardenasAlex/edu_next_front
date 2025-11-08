"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface InscripcionFormProps {
  apiUrl: string;
  id?: string;
  mode: "create" | "edit";
}

export default function InscripcionForm({ apiUrl, id, mode }: InscripcionFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    usuarioId: "",
    cursoId: "",
    progreso: 0,
    completado: false,
  });
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${apiUrl}/users`).then((r) => r.json()),
      fetch(`${apiUrl}/cursos`).then((r) => r.json()),
    ])
      .then(([users, cursos]) => {
        setUsuarios(users);
        setCursos(cursos);
      })
      .catch((err) => console.error("Error al cargar datos:", err));

    if (mode === "edit" && id) {
      fetch(`${apiUrl}/inscripciones/${id}`)
        .then((r) => r.json())
        .then((data) =>
          setForm({
            usuarioId: data.usuario?.id ?? "",
            cursoId: data.curso?.id ?? "",
            progreso: data.progreso ?? 0,
            completado: data.completado ?? false,
          })
        );
    }
  }, [id, mode, apiUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      usuarioId: Number(form.usuarioId),
      cursoId: Number(form.cursoId),
      progreso: Number(form.progreso),
      completado: Boolean(form.completado),
    };

    const url =
      mode === "create"
        ? `${apiUrl}/inscripciones`
        : `${apiUrl}/inscripciones/${id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error:", err);
        alert("Error al guardar la inscripción");
        return;
      }

      router.push("/dashboard/inscripciones");
    } catch (err) {
      console.error("Error al enviar formulario:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {mode === "create" ? "Nueva Inscripción" : "Editar Inscripción"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Usuario */}
        <div>
          <label className="block text-gray-300 mb-1">Usuario</label>
          <select
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
            value={form.usuarioId}
            onChange={(e) => setForm({ ...form, usuarioId: e.target.value })}
            required
          >
            <option value="">Seleccione usuario</option>
            {usuarios.map((u: any) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Curso */}
        <div>
          <label className="block text-gray-300 mb-1">Curso</label>
          <select
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
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

        {/* Progreso */}
        <div>
          <label className="block text-gray-300 mb-1">Progreso (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
            value={form.progreso}
            onChange={(e) => setForm({ ...form, progreso: Number(e.target.value) })}
          />
        </div>

        {/* Completado */}
        <div className="flex items-center gap-2 mt-7">
          <input
            type="checkbox"
            checked={form.completado}
            onChange={(e) => setForm({ ...form, completado: e.target.checked })}
          />
          <label className="text-gray-300">Completado</label>
        </div>

        {/* Botones */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/inscripciones")}
            className="px-4 py-2 bg-gray-500 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-md text-white ${
              mode === "create"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {mode === "create" ? "Guardar" : "Actualizar"}
          </button>
        </div>
      </form>
    </div>
  );
}
