"use client";

import { useEffect, useState } from "react";
import { Eye, Download } from "lucide-react";

interface Certificado {
  id: number;
  codigo_certificado: string;
  url_pdf: string;
  fecha_emision: string;
  inscripcion?: {
    usuario?: { name: string };
    curso?: { titulo: string };
  };
}

export default function CertificadosList() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(5);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchCertificados = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/certificados`);
        if (!res.ok) throw new Error("Error al obtener certificados");
        const data = await res.json();
        setCertificados(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando certificados:", err);
        setCertificados([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificados();
  }, [API_URL]);

  const certificadosFiltrados = certificados.filter(
    (c) =>
      c.codigo_certificado.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.inscripcion?.usuario?.name?.toLowerCase().includes(busqueda.toLowerCase() || "") ||
      c.inscripcion?.curso?.titulo?.toLowerCase().includes(busqueda.toLowerCase() || "")
  );

  const totalPaginas = Math.ceil(certificadosFiltrados.length / porPagina);
  const certificadosPagina = certificadosFiltrados.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Buscar certificado o usuario..."
          className="bg-gray-700 px-3 py-2 rounded-md w-1/3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Cargando certificados...</p>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-left">
                <th className="p-3 border-b border-gray-700">Código</th>
                <th className="p-3 border-b border-gray-700">Usuario</th>
                <th className="p-3 border-b border-gray-700">Curso</th>
                <th className="p-3 border-b border-gray-700">Fecha emisión</th>
                <th className="p-3 border-b border-gray-700 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {certificadosPagina.length > 0 ? (
                certificadosPagina.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-800">
                    <td className="p-3 border-b border-gray-700">{c.codigo_certificado}</td>
                    <td className="p-3 border-b border-gray-700">
                      {c.inscripcion?.usuario?.name || "—"}
                    </td>
                    <td className="p-3 border-b border-gray-700">
                      {c.inscripcion?.curso?.titulo || "—"}
                    </td>
                    <td className="p-3 border-b border-gray-700">
                      {new Date(c.fecha_emision).toLocaleDateString()}
                    </td>
                    <td className="p-3 border-b border-gray-700 text-center space-x-2">
                      <button
                        onClick={() => window.open(c.url_pdf, "_blank")}
                        className="p-2 rounded-md bg-blue-600 hover:bg-blue-700"
                        title="Ver certificado"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = c.url_pdf;
                          link.download = `${c.codigo_certificado}.pdf`;
                          link.click();
                        }}
                        className="p-2 rounded-md bg-green-600 hover:bg-green-700"
                        title="Descargar PDF"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-400 italic"
                  >
                    No hay certificados generados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-400">
              Página {pagina} de {totalPaginas || 1}
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagina === 1}
                onClick={() => setPagina(pagina - 1)}
                className="bg-gray-700 px-3 py-1 rounded-md disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={pagina === totalPaginas || totalPaginas === 0}
                onClick={() => setPagina(pagina + 1)}
                className="bg-gray-700 px-3 py-1 rounded-md disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
