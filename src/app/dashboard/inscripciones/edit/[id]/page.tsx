"use client";
import { useParams } from "next/navigation";
import InscripcionForm from "../../../../../components/inscripciones/InscripcionForm";

export default function EditInscripcionPage() {
  const { id } = useParams();

  return (
    <InscripcionForm
      apiUrl={process.env.NEXT_PUBLIC_BACKEND_URL!}
      id={id as string}
      mode="edit"
    />
  );
}
