"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterPage = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const responseAPI = await res.json();

    if (!res.ok) {
      setErrors(responseAPI.message);
      return;
    }

    const responseNextAuth = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      setErrors(responseNextAuth.error.split(","));
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
      Register
    </h1>

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nombre"
        name="name"
        className="w-full border border-gray-300 rounded-md text-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        name="email"
        className="w-full border border-gray-300 rounded-md text-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        name="password"
        className="w-full border border-gray-300 rounded-md text-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-md transition-colors"
      >
        Register
      </button>
    </form>

    {errors.length > 0 && (
      <div className="bg-red-100 border border-red-400 text-red-700 mt-4 px-4 py-3 rounded-md">
        <ul className="list-disc list-inside text-sm">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>

    </div>
  );
};
export default RegisterPage;