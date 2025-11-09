"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CursoCard from "../../../components/cursos/CursoCard";

export default function CursosPage() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cursos`);
        const data = await res.json();
        setCursos(data);
      } catch (err) {
        console.error("Error al obtener cursos:", err);
      }
    };
    fetchCursos();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Cursos</h2>
        <Link
          href="/dashboard/cursos/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          + Nuevo Curso
        </Link>
      </div>

      {cursos.length === 0 ? (
        <p className="text-gray-500">No hay cursos registrados.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cursos.map((curso: any) => (
            <CursoCard key={curso.id} curso={curso} />
          ))}
        </div>
      )}
    </div>
  );
}
