import React, { useEffect, useState } from "react";

import { MdOutlineDeleteOutline } from "react-icons/md";
interface Solicitud {
  id: number;
  nombre: string;
  empresa: string;
  email: string;
  detalle: string;
}

interface CopiedEmails {
  [key: string]: boolean;
}

export default function Table() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedEmails, setCopiedEmails] = useState<CopiedEmails>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Inicialmente, 4 elementos por página

  useEffect(() => {
    const apiUrl = process.env.API_URL;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitudes`)
      .then((response) => response.json())
      .then((data) => {
        setSolicitudes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmails((prevCopiedEmails) => ({
      ...prevCopiedEmails,
      [email]: true,
    }));

    setTimeout(() => {
      setCopiedEmails((prevCopiedEmails) => ({
        ...prevCopiedEmails,
        [email]: false,
      }));
    }, 2000);
  };

  // Función para eliminar una solicitud por su ID
  const deleteSolicitud = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/solicitudes/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        // Eliminación exitosa, actualiza la lista de solicitudes
        const updatedSolicitudes = solicitudes.filter(
          (solicitud) => solicitud.id !== id
        );
        setSolicitudes(updatedSolicitudes);
      } else {
        console.error("Error al eliminar la solicitud.");
      }
    } catch (error) {
      console.error("Error al eliminar la solicitud:", error);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(solicitudes.length / itemsPerPage);

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-[90%] mx-auto mt-4">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg border rounded-xl">
            <div
              className="max-h-[400px] overflow-y-auto"
              style={{ minHeight: "200px" }}
            >
              <table className="w-full text-sm text-left text-white bg-black">
                {/* Encabezado de la tabla */}
                <thead className="text-xs text-gray-50 bg-black">
                  <tr>
                    <th scope="col" className="px-6 py-3 border border-white">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3 border border-white">
                      Empresa
                    </th>
                    <th scope="col" className="px-6 py-3 border border-white">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 border border-white">
                      Detalle
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.slice(startIndex, endIndex).map((solicitud) => (
                    <tr
                      key={solicitud.id}
                      className="bg-black border-b border-white"
                    >
                      {/* Contenido de la tabla */}
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium whitespace-nowrap"
                      >
                        {solicitud.nombre}
                      </th>
                      <td className="px-6 py-4 border border-white">
                        {solicitud.empresa}
                      </td>
                      <td className="px-6 py-4 border border-white">
                        <div className="flex items-center justify-between">
                          <span>{solicitud.email}</span>
                          <button
                            onClick={() => handleCopyEmail(solicitud.email)}
                            className={`ml-10 mr-4 w-14 h-8 px-1 text-xs font-semibold bg-white text-black rounded ${
                              copiedEmails[solicitud.email]
                                ? "bg-gray-300 cursor-default"
                                : "hover:bg-black hover:text-white cursor-pointer"
                            }`}
                          >
                            {copiedEmails[solicitud.email]
                              ? "Copiado"
                              : "Copiar"}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 border border-white flex items-center">
                        <div className="flex-grow">{solicitud.detalle}</div>
                        {/* Agregar botón de eliminación al final */}
                        <button
                          onClick={() => deleteSolicitud(solicitud.id)}
                          className="w-10 h-9 ml-4 px-2 py-1 text-lg font-semibold bg-black text-white rounded-xl border border-white hover:bg-red-700 cursor-pointer"
                        >
                          <MdOutlineDeleteOutline className="text-xl" />{" "}
                          {/* Ajusta el tamaño del icono aquí */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white text-black px-4 py-2 rounded-l-md"
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-white text-black px-4 py-2 rounded-r-md"
              >
                Siguiente
              </button>
            </div>
            <div className="flex items-center">
              <span className="text-white pr-2">Registros por página:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="bg-black text-white border border-white rounded"
              >
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={10}>10</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
