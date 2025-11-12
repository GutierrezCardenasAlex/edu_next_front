"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/SessionWrapper";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, User, DollarSign, Link2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";

export default function AdminPayments() {
  const { token, isAdmin } = useAuth();
  const [pagos, setPagos] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/appointments/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setPagos(data.filter((c: any) => c.status === "paid")));
  }, [token]);

  const approve = async (id: number) => {
    await fetch(`${API_URL}/appointments/${id}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPagos(pagos.filter((p) => p.id !== id));
    alert("Pago aprobado");
  };

  const reject = async (id: number) => {
    await fetch(`${API_URL}/appointments/${id}/reject`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPagos(pagos.filter((p) => p.id !== id));
    alert("Pago rechazado");
  };

  if (!isAdmin) return <p className="p-8 text-red-600">Acceso denegado</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-rose-800 mb-10">Pagos Pendientes de Aprobación</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {pagos.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow-xl p-6 border border-rose-200">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-rose-600" />
                <p className="text-lg font-bold text-gray-900">{c.user?.name}</p>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <strong>Fecha:</strong> {format(new Date(c.date), "dd MMM yyyy - HH:mm")} hs
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Precio:</strong> ${c.price} | <strong>Método:</strong> {c.paymentMethod.toUpperCase()}
              </p>

              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Comprobante:
                </p>
                <a
                  href={c.payments[0].proof}
                  target="_blank"
                  className="text-blue-600 underline text-sm break-all"
                >
                  {c.payments[0].proof}
                </a>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => approve(c.id)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Aprobar
                </button>
                <button
                  onClick={() => reject(c.id)}
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-2 rounded-xl font-bold hover:from-red-700 hover:to-rose-700 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}