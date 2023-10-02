import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const apiUrl = process.env.API_URL;

    // Fetch data from the API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitudes`)
      .then((response) => response.json())
      .then((data) => {
        setSolicitudes(data); // Update the state with the fetched data
        setLoading(false); // Set loading to false once data is loaded
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []);

  const handleCopyEmail = (email: string) => {
    // Copy email to clipboard
    navigator.clipboard.writeText(email);

    // Update copied status
    setCopiedEmails((prevCopiedEmails) => ({
      ...prevCopiedEmails,
      [email]: true,
    }));

    // Reset copied status after 2 seconds (2000 milliseconds)
    setTimeout(() => {
      setCopiedEmails((prevCopiedEmails) => ({
        ...prevCopiedEmails,
        [email]: false,
      }));
    }, 2000);
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-[90%] mx-auto mt-4">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg border rounded-xl">
            <table className="w-full text-sm text-left text-white bg-black">
              {/* Table header */}
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
                {/* Map over the 'solicitudes' array and render table rows */}
                {solicitudes.map((solicitud) => (
                  <tr
                    key={solicitud.id}
                    className="bg-black border-b border-white"
                  >
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
                          className={`ml-10 mr-4 w-14 h-8 px-1 text-xs font-semibold bg-black text-white rounded ${
                            copiedEmails[solicitud.email]
                              ? "bg-gray-300 cursor-default"
                              : "hover:bg-white hover:text-black cursor-pointer"
                          }`}
                        >
                          {copiedEmails[solicitud.email] ? "Copiado" : "Copiar"}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 border border-white">
                      {solicitud.detalle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
