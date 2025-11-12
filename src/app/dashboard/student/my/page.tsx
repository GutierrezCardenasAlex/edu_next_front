"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/SessionWrapper";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, DollarSign, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";

export default function StudentMy() {
  const { token, isUser } = useAuth();
  const [citas, setCitas] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/appointments/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setCitas);
  }, [token]);

  const pagar = async (id: number) => {
    const proof = prompt("Pega la URL del comprobante (QR, foto, etc.)");
    if (!proof) return;

    const res = await fetch(`${API_URL}/appointments/${id}/pay`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ method: "qr", proof }),
    });

    if (res.ok) {
      alert("Pago enviado. Espera aprobación del admin.");
      setCitas(citas.map((c) => (c.id === id ? { ...c, status: "paid" } : c)));
    }
  };

  if (!isUser) return <p className="p-8 text-red-600">Acceso denegado</p>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reserved": return "bg-orange-100 text-orange-800";
      case "paid": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-amber-800 mb-10">Mis Citas</h1>

        <div className="space-y-6">
          {citas.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow-xl p-6 border border-amber-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {format(new Date(c.date), "dd MMM yyyy - HH:mm")} hs
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Precio: <strong>${c.price}</strong></p>

                  <div className="flex items-center gap-4 mt-3">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(c.status)}`}>
                      {c.status === "reserved" && <Clock className="w-4 h-4" />}
                      {c.status === "paid" && <AlertCircle className="w-4 h-4" />}
                      {c.status === "confirmed" && <CheckCircle className="w-4 h-4" />}
                      {c.status === "cancelled" && <XCircle className="w-4 h-4" />}
                      {c.status.toUpperCase()}
                    </span>

                    {c.payments[0] && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        c.payments[0].status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        c.payments[0].status === "approved" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        PAGO: {c.payments[0].status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {c.status === "reserved" && (
                  <button
                    onClick={() => pagar(c.id)}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all flex items-center gap-2"
                  >
                    <DollarSign className="w-5 h-5" />
                    Pagar Ahora
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}