import React from "react";
import Link from "next/link";
import { LuLogOut } from "react-icons/lu";
import { useRouter } from "next/router"; // Importa el hook useRouter de Next.js

export default function Header() {
  const router = useRouter(); // Obtén el objeto router de Next.js

  const handleLogout = () => {
    // Borrar el token del almacenamiento local
    localStorage.removeItem("token");

    // Redirigir al usuario a la página de inicio de sesión (puedes ajustar la URL según sea necesario)
    router.push("/");
  };

  return (
    <>
      <nav className="flex h-16 items-center px-4 fixed z-[100] w-screen">
        <Link href="/">
          <img src="/a.png" className="max-h-20 cursor-pointer" alt="Solana" />
        </Link>

        <nav className="flex items-center mx-6 space-x-4 lg:space-x-6"></nav>
        <div
          className="flex items-center ml-auto mr-5 space-x-4 hover:cursor-pointer"
          onClick={handleLogout}
        >
          <p>Cerrar sesión</p>
          <LuLogOut />
        </div>
      </nav>
    </>
  );
}
