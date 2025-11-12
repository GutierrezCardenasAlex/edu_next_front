"use client";
import { useState } from "react";
import { useAuth } from "@/context/SessionWrapper";
import { Calendar, DollarSign, CreditCard, QrCode } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";

export default function InstructorCreate() {
  const { token, isInstructor } = useAuth();
  const [form, setForm] = useState({ date: "", price: "", paymentMethod: "cash" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/appointments/instructor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date: new Date(form.date).toISOString(),
        price: Number(form.price),
        paymentMethod: form.paymentMethod,
      }),
    });
    if (res.ok) {
      setMsg("¡Cita creada con éxito!");
      setForm({ date: "", price: "", paymentMethod: "cash" });
    } else {
      setMsg("Error al crear");
    }
  };

  if (!isInstructor) return <p className="p-8 text-red-600">Acceso denegado</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">Crear Cita Disponible</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Fecha y Hora
            </label>
            <input
              type="datetime-local"
              className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Precio
            </label>
            <input
              type="number"
              placeholder="150.00"
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Método de Pago
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none"
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="qr">QR</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Crear Cita
          </button>
        </form>
        {msg && <p className="mt-6 text-center font-semibold text-green-600">{msg}</p>}
      </div>
    </div>
  );
}