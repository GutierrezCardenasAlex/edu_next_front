"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import TemarioTable from "../../../components/temarios/TemarioTable";

export default function TemariosPage() {
  const [temarios, setTemarios] = useState([]);

  const fetchTemarios = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/temarios`);
      const data = await res.json();
      setTemarios(data);
    } catch (error) {
      console.error("Error al obtener temarios:", error);
    }
  };

  useEffect(() => {
    fetchTemarios();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Deseas eliminar este temario?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/temarios/${id}`, {
        method: "DELETE",
      });
      fetchTemarios();
    } catch (error) {
      console.error("Error al eliminar temario:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lista de Temarios</h2>
        <Link
          href="/dashboard/temarios/new"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium transition"
        >
          + Nuevo Temario
        </Link>
      </div>

      <TemarioTable temarios={temarios} onDelete={handleDelete} />
    </div>
  );
}
