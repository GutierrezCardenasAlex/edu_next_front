// app/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal con margen para el sidebar */}
      <main className="flex-1 ml-64 p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}