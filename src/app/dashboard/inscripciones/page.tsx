import InscripcionTable from "../../../components/inscripciones/InscripcionTable";

export default function InscripcionesPage() {
  return (
    <div className="p-8">
      <InscripcionTable apiUrl={process.env.NEXT_PUBLIC_BACKEND_URL!} />
    </div>
  );
}
