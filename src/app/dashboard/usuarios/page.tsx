"use client";
import { useEffect, useState } from "react";
import { Usuario } from "@/types/usuario";
import Link from "next/link";

export default function UsuariosPage() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`);
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Deseas eliminar este usuario?")) return;

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`, {
      method: "DELETE",
    });

    setUsers(users.filter((u) => u.id !== id));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-gray-700 font-bold">Usuarios</h1>
        <Link
          href="/dashboard/usuarios/crear"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition"
        >
          + Nuevo Usuario
        </Link>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Password</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Rol</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 border-b">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm text-gray-600 border-b">{index + 1}</td>
                  <td className="px-6 py-3 text-sm text-gray-800 border-b">{user.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-800 border-b">{user.email}</td>
                  <td className="px-6 py-3 text-sm text-gray-500 border-b">••••••••</td>
                  <td className="px-6 py-3 text-sm text-gray-800 border-b">{user.role}</td>
                  <td className="px-6 py-3 text-center text-sm text-gray-800 border-b">
                    <div className="flex justify-center gap-3">
                      <Link
                        href={`/dashboard/usuarios/editar/${user.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-gray-600 border-b"
                >
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
