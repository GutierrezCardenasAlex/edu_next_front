"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Usuario } from "@/types/usuario";

export default function DetalleUsuarioPage() {
  const params = useParams();
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${params.id}`
      );
      const data = await res.json();
      setUser(data);
    };
    fetchUser();
  }, [params.id]);

  if (!user) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        {user.name}
      </h2>
      <p className="text-gray-600">{user.email}</p>
      <p className="text-sm text-blue-500 font-semibold mt-2">{user.role}</p>
      <p className="text-xs text-gray-400 mt-2">
        Creado: {new Date(user.createdAt || "").toLocaleDateString()}
      </p>
    </div>
  );
}