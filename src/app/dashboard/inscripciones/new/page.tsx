import InscripcionForm from "../../../../components/inscripciones/InscripcionForm";

export default function NewInscripcionPage() {
  return (
    <InscripcionForm
      apiUrl={process.env.NEXT_PUBLIC_BACKEND_URL!}
      mode="create"
    />
  );
}
