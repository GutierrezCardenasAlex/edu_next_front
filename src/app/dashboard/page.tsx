"use client";
import CoursesList from "@/components/CoursesList";
import DashboardCard from "@/components/DashboardCard";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { BookOpen, User, DollarSign, Clock } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

    console.log(session);
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

  const getCats = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.token}`,
      },
    });
    const data = await res.json();
    console.log(data);
  };

  if (!session) return <p>Access denied</p>;

  return (
    <div>

      <div className="flex bg-gray-100 min-h-screen">
      
      <div className="flex-1 flex flex-col md:ml-0">
        {/* {<DashboardHeader />} */}
        <main className="p-6 md:p-10">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <DashboardCard title="Cursos Activos" value="12" icon={<BookOpen />} color="border-blue-500" />
            <DashboardCard title="Estudiantes" value="245" icon={<User />} color="border-green-500" />
            <DashboardCard title="Ingresos" value="$1,280" icon={<DollarSign />} color="border-yellow-500" />
            <DashboardCard title="Horas Totales" value="48h" icon={<Clock />} color="border-purple-500" />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Mis Cursos</h2>
            <CoursesList />
          </section>
        </main>
      </div>
    </div>
    </div>
  );
}
