"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  parent_id?: number;
}

export default function CategoriaForm({ editMode = false }: { editMode?: boolean }) {
  const router = useRouter();
  const { id } = useParams();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<Categoria>({
    nombre: "",
    descripcion: "",
    parent_id: undefined,
  });
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const loadCategorias = async () => {
      const res = await fetch(`${API_URL}/categorias`);
      const data = await res.json();
      setCategorias(Array.isArray(data) ? data : data.data || []);
    };
    loadCategorias();

    if (editMode && id) {
      fetch(`${API_URL}/categorias/${id}`)
        .then((res) => res.json())
        .then((data) => setForm(data));
    }
  }, [API_URL, editMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const method = editMode ? "PATCH" : "POST";
        const url = editMode
        ? `${API_URL}/categorias/${id}`
        : `${API_URL}/categorias`;

        // Solo los campos válidos del DTO
        const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        parent_id: form.parent_id || null,
        };

        const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });

        if (!res.ok) {
        const err = await res.json();
        console.error("Error del servidor:", err);
        throw new Error("Error al guardar categoría");
        }

        alert(`Categoría ${editMode ? "actualizada" : "creada"} correctamente`);
        router.push("/dashboard/categorias");
    } catch (err) {
        console.error(err);
        alert("Error al guardar la categoría");
    } finally {
        setLoading(false);
    }
    };


  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg mt-8 text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {editMode ? "Editar Categoría" : "Nueva Categoría"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full bg-gray-700 px-3 py-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="w-full bg-gray-700 px-3 py-2 rounded-md"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Categoría Padre (opcional)</label>
          <select
            className="w-full bg-gray-700 px-3 py-2 rounded-md"
            value={form.parent_id || ""}
            onChange={(e) =>
              setForm({
                ...form,
                parent_id: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          >
            <option value="">Sin padre</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/categorias")}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
