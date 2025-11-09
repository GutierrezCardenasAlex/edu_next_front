import LeccionesTable from "../../../components/lecciones/LeccionesTable";

export default function LeccionesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-6 text-center">
        Gestión de Lecciones
      </h1>
      <LeccionesTable />
    </div>
  );
}
