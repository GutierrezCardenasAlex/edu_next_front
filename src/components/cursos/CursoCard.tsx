"use client";
import Link from "next/link";

export default function CursoCard({ curso }: { curso: any }) {
  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-md">
      <img
        src={curso.imagen_portada || "/no-image.jpg"}
        alt={curso.titulo}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
      <h3 className="font-semibold text-gray-800">{curso.titulo}</h3>
      <p className="text-gray-600 text-sm">{curso.descripcion}</p>
      <p className="text-gray-500 text-xs mt-2">Nivel: {curso.nivel}</p>
      <p className="text-gray-500 text-xs">Precio: Bs {curso.precio}</p>
      <div className="mt-3 flex justify-between">
        <Link
          href={`/dashboard/cursos/edit/${curso.id}`}
          className="text-blue-600 hover:underline text-sm"
        >
          Editar
        </Link>
      </div>
    </div>
  );
}
