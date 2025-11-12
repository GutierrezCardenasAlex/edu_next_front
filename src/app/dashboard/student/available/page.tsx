"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/SessionWrapper";
import { format } from "date-fns";
import { Calendar, DollarSign, Clock, UserCheck, QrCode } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";

export default function StudentAvailable() {
  const { token, isUser } = useAuth();
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/appointments/available`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setCitas(data);
        setLoading(false);
      });
  }, [token]);

  const reservar = async (id: number) => {
    const res = await fetch(`${API_URL}/appointments/${id}/reserve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      alert("¡Reservada! Ve a 'Mis Citas' para pagar.");
      setCitas(citas.filter((c) => c.id !== id));
    }
  };

  if (!isUser) return <p className="p-8 text-red-600">Acceso denegado</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-teal-800 mb-10">Citas Disponibles</h1>

        {loading ? (
          <p className="text-center text-gray-600">Cargando...</p>
        ) : citas.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No hay citas disponibles</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {citas.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl shadow-xl p-6 border border-teal-200 hover:shadow-2xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-teal-700">
                    <Calendar className="w-5 h-5" />
                    <span className="font-bold text-lg">
                      {format(new Date(c.date), "dd MMM yyyy")}
                    </span>
                  </div>
                  <Clock className="w-5 h-5 text-gray-500" />
                </div>

                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {format(new Date(c.date), "HH:mm")} hs
                </p>

                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-xl font-semibold">${c.price}</span>
                </div>

                <div className="flex items-center gap-2 text-blue-600 mb-6">
                  <QrCode className="w-5 h-5" />
                  <span className="font-medium">{c.paymentMethod.toUpperCase()}</span>
                </div>

                <button
                  onClick={() => reservar(c.id)}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-xl font-bold hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-5 h-5" />
                  Reservar Ahora
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}