"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { Usuario } from "@/types/usuario";

interface UserFormProps {
  initialData?: Usuario;
  isEdit?: boolean;
}

export default function UserForm({ initialData, isEdit }: UserFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [role, setRole] = useState(initialData?.role || "user");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      const session = await getSession();
      console.log("🔐 Sesión actual:", session);
      const token = session?.accessToken;

      if (!token) {
        setErrors(["No se encontró token de autenticación"]);
        return;
      }

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${initialData?.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`;

      const bodyData = isEdit
        ? { name, email, role }
        : { name, email, password, role };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(Array.isArray(data.message) ? data.message : [data.message]);
        return;
      }

      router.push("/dashboard/usuarios");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setErrors(["Error al procesar la solicitud."]);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-gray-800 max-w-md mx-auto mt-10">
      <h2 className="text-xl text-gray-800 font-semibold text-center mb-4">
        {isEdit ? "Editar Usuario" : "Registrar Usuario"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full border px-3 py-2 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo"
          className="w-full border px-3 py-2 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!isEdit && (
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border px-3 py-2 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        <select
          className="w-full border px-3 py-2 rounded-md"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          {isEdit ? "Actualizar" : "Registrar"}
        </button>
      </form>

      {errors.length > 0 && (
        <div className="bg-red-100 text-red-700 mt-4 p-3 rounded-md">
          {errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
