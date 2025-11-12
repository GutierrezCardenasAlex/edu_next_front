"use client";

import { useState, useEffect } from "react";
import { Loader2, Calendar, DollarSign, CheckCircle, AlertCircle, User, Clock, Eye, BadgeCheck, Lock } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/context/SessionWrapper";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";

interface Appointment {
  id: string;
  date: string;
  price: string;
  status: "pending" | "confirmed" | "completed";
  payment_status: "pending" | "paid" | "failed";
  paymentMethod: "cash" | "card" | "qr";
  user: { id: string; name: string; email: string; role: string };
  payments: { method: string; amount: string; status: string }[];
  createdAt: string;
}

export default function AdminAppointmentsPanel() {
  const { user, token, isAdmin, status } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState("");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchAllAppointments = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/appointments/admin`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.statusCode === 403) {
          setError("Acceso denegado. Solo administradores pueden ver todas las citas.");
        }
        throw new Error(err.message || `Error ${res.status}`);
      }

      const data = await res.json();
      setAppointments(data);
      setError("");
    } catch (err: any) {
      console.error("Error cargando citas:", err);
      setError(err.message || "Error al cargar citas");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (appointmentId: string) => {
    if (!token) return;

    setConfirmLoading({ ...confirmLoading, [appointmentId]: true });

    try {
      const res = await fetch(`${API_URL}/appointments/${appointmentId}/confirm`, {
        method: "PATCH",
        headers: getHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Error ${res.status}`);
      }

      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId
            ? {
                ...apt,
                status: "confirmed",
                payment_status: "paid",
                payments: apt.payments.map(p => ({ ...p, status: "completed" })),
              }
            : apt
        )
      );

      alert("¡Cita confirmada con éxito!");
    } catch (err: any) {
      setError(err.message || "Error al confirmar cita");
    } finally {
      setConfirmLoading({ ...confirmLoading, [appointmentId]: false });
    }
  };

  useEffect(() => {
    if (status === "authenticated" && isAdmin && token) {
      fetchAllAppointments();
    }
  }, [status, isAdmin, token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-lg font-medium text-gray-700">Cargando panel admin...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Acceso Admin Restringido</h2>
          <p className="text-gray-600 mt-2">Solo administradores pueden gestionar todas las citas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              A
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel Admin - Gestión de Citas</h1>
              <p className="text-sm font-medium text-blue-700">
                Total citas: <span className="font-bold">{appointments.length}</span> | 
                Usuario: <span className="font-bold">{user?.name || user?.email}</span>
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600" />
              Todas las Citas
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando citas...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No hay citas registradas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Fecha/Hora</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Paciente</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Método</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Estado Cita</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Estado Pago</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-200">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {format(new Date(apt.date), "dd MMM yyyy")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(apt.date), "HH:mm")} hs
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{apt.user.name}</p>
                            <p className="text-xs text-gray-500">{apt.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <DollarSign className="w-4 h-4 inline ml-1 text-green-600" />
                        ${parseFloat(apt.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {apt.payments?.[0]?.method?.toUpperCase() || apt.paymentMethod.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                            apt.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : apt.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : apt.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {apt.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                            apt.payment_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : apt.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {apt.payment_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {apt.status === "pending" ? (
                          <button
                            onClick={() => handleConfirm(apt.id)}
                            disabled={confirmLoading[apt.id]}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {confirmLoading[apt.id] ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Confirmando...
                              </>
                            ) : (
                              <>
                                <BadgeCheck className="w-4 h-4 mr-2" />
                                Confirmar
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            {apt.status === "completed" ? "Completada" : "Confirmada"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}