"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface InscripcionTableProps {
  apiUrl: string;
}

export default function InscripcionTable({ apiUrl }: InscripcionTableProps) {
  const router = useRouter();
  const [inscripciones, setInscripciones] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/inscripciones`);
      const data = await res.json();
      setInscripciones(data);
    } catch (err) {
      console.error("Error al cargar inscripciones:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const eliminar = async (id: number) => {
    if (!confirm("¿Desea eliminar esta inscripción?")) return;
    try {
      await fetch(`${apiUrl}/inscripciones/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-800 p-6 rounded-xl shadow-md">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-xl font-bold text-white">Lista de Inscripciones</h2>
        <button
          onClick={() => router.push("/dashboard/inscripciones/new")}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white"
        >
          + Nueva
        </button>
      </div>

      <table className="w-full border border-gray-700 rounded-md">
        <thead className="bg-gray-700 text-gray-300">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Usuario</th>
            <th className="px-4 py-2 text-left">Curso</th>
            <th className="px-4 py-2 text-left">Progreso</th>
            <th className="px-4 py-2 text-left">Completado</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inscripciones.map((i: any) => (
            <tr key={i.id} className="border-t border-gray-700">
              <td className="px-4 py-2">{i.id}</td>
              <td className="px-4 py-2">{i.usuario?.nombre}</td>
              <td className="px-4 py-2">{i.curso?.titulo}</td>
              <td className="px-4 py-2">{i.progreso}%</td>
              <td className="px-4 py-2">
                {i.completado ? "✅ Sí" : "❌ No"}
              </td>
              <td className="px-4 py-2 flex justify-center gap-3">
                <button
                  onClick={() =>
                    router.push(`/dashboard/inscripciones/edit/${i.id}`)
                  }
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-white"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminar(i.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {inscripciones.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-gray-400 py-4">
                No hay inscripciones registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
