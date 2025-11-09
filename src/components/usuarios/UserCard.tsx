"use client";
import { Usuario } from "@/types/usuario";
import Link from "next/link";

interface UserCardProps {
  user: Usuario;
  onDelete?: (id: number) => void;
}

export default function UserCard({ user, onDelete }: UserCardProps) {
  return (
    <div className="border rounded-lg shadow p-4 flex justify-between items-center bg-white hover:shadow-md transition">
      <div>
        <h2 className="font-semibold text-gray-800">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <span className="text-xs text-blue-600 font-medium">{user.role}</span>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/usuarios/editar/${user.id}`}
          className="bg-yellow-400 text-white px-3 py-1 rounded-md text-sm"
        >
          Editar
        </Link>
        <Link
          href={`/usuarios/detalles/${user.id}`}
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
        >
          Ver
        </Link>
        <button
          onClick={() => onDelete && onDelete(user.id)}
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}