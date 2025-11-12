// src/components/appointments/AppointmentForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2, Calendar, DollarSign, CreditCard, QrCode, AlertCircle, Lock, CheckCircle, Copy, Wifi, WifiOff } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/context/SessionWrapper";

// URL CORRECTA: NestJS con prefix api/v1
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";

interface Appointment {
  id: number;
  date: string;
  price: string; // ← string, como viene del backend
  paymentMethod: "cash" | "card" | "qr";
  status: string;
  payment_status: string;
  user: { id: number; name: string; email: string };
  payments: { method: string; amount: string }[];
}

export default function AppointmentForm() {
  const { user, token, isInstructor, status } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [backendConnected, setBackendConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    price: "",
    paymentMethod: "cash" as "cash" | "card" | "qr",
  });

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchAppointments = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Error ${res.status}`);
      }

      const data = await res.json();
      setAppointments(data);
      setBackendConnected(true);
    } catch (err: any) {
      console.error("Error cargando citas:", err);
      setError(
        err.message.includes("401")
          ? "Sesión expirada. Inicia sesión."
          : err.message.includes("404")
          ? "API no encontrada. Verifica el backend."
          : err.message
      );
      setBackendConnected(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && isInstructor && token) {
      fetchAppointments();
    }
  }, [status, isInstructor, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !token) {
      setError("Falta autenticación");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      date: new Date(formData.date).toISOString(),
      price: Number(formData.price),
      paymentMethod: formData.paymentMethod,
    };

    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || `Error ${res.status}`);
      }

      setSuccess("¡Cita creada con éxito!");
      setFormData({ date: "", price: "", paymentMethod: "cash" });
      fetchAppointments();
    } catch (err: any) {
      setError(
        err.message.includes("401")
          ? "Token inválido. Inicia sesión nuevamente."
          : err.message.includes("403")
          ? "No tienes permiso para crear citas."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-lg font-medium text-gray-700">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isInstructor || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Acceso Restringido</h2>
          <p className="text-gray-600 mt-2">
            {token ? "Solo instructores pueden gestionar citas." : "Debes iniciar sesión."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header con Token */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-purple-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || "I"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Citas</h1>
                <p className="text-sm font-medium text-purple-700">
                  Instructor: <span className="font-bold">{user?.name || user?.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${backendConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {backendConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {backendConnected ? "Conectado" : "Desconectado"}
              </div>

              <button
                onClick={copyToken}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium text-sm hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado" : "Token"}
              </button>
            </div>
          </div>

          {process.env.NODE_ENV === "development" && token && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-xs font-medium text-gray-600 mb-1">Token JWT (dev):</p>
              <p className="text-xs font-mono bg-white p-2 rounded border border-gray-300 break-all">
                {token}
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Formulario */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              Crear Nueva Cita
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Fecha y Hora</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-5 py-3.5 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  placeholder="150.00"
                  className="w-full px-5 py-3.5 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Método de Pago</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "cash", label: "Efectivo", icon: <DollarSign className="w-6 h-6" />, color: "from-green-500 to-emerald-600" },
                    { value: "card", label: "Tarjeta", icon: <CreditCard className="w-6 h-6" />, color: "from-blue-500 to-cyan-600" },
                    { value: "qr", label: "QR", icon: <QrCode className="w-6 h-6" />, color: "from-purple-500 to-pink-600" },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.value as any })}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 font-semibold text-white shadow-lg ${
                        formData.paymentMethod === method.value
                          ? `bg-gradient-to-br ${method.color} border-transparent scale-105`
                          : "bg-gray-100 text-gray-600 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {method.icon}
                      <span className="text-sm">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Creando cita...
                  </>
                ) : (
                  "Crear Cita"
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-5 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 text-red-700">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="mt-6 p-5 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center gap-3 text-green-700">
                <CheckCircle className="w-6 h-6" />
                <p className="font-medium">{success}</p>
              </div>
            )}
          </div>

          {/* Lista de Citas */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Mis Citas
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Aún no tienes citas</p>
                  <p className="text-sm text-gray-400 mt-1">Crea tu primera cita arriba</p>
                </div>
              ) : (
                appointments
                  .filter((apt) => apt.user.id === Number(user?.id)) // ← CORREGIDO: == y Number()
                  .map((apt) => (
                    <div key={apt.id} className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">
                            {format(new Date(apt.date), "dd MMM yyyy")}
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {format(new Date(apt.date), "HH:mm")} hs
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">Paciente:</span> {apt.user.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Precio:</span> ${parseFloat(apt.price).toFixed(2)} |{" "}
                            <span className="font-semibold">Método:</span>{" "}
                            {apt.payments?.[0]?.method.toUpperCase() || apt.paymentMethod.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1.5 text-sm font-bold rounded-full ${
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
                          <p className="text-xs font-medium text-gray-500 mt-2">
                            Pago: {apt.payment_status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}