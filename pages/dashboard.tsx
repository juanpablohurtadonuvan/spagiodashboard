import React, { useEffect, useState } from "react";
import Table from "@/components/Table";
import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function Dashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated (has a token)
    const token = localStorage.getItem("token");

    if (!token) {
      // If there is no token, redirect the user to the login page
      router.push("/");
    } else {
      // If there is a token, the user is authenticated
      setAuthenticated(true);
    }
  }, [router]);

  return (
    <>
      {authenticated ? (
        <div>
          <Header/>
          <div className="flex flex-col items-center justify-center h-screen">
            
            <h1 className="text-3xl font-semibold mb-4">
              Spagio - Panel Administrativo
            </h1>
            <p className="text-gray-400">
              Solicitudes de empresas para cotizacion de boleteria NFT.
            </p>
            <div className="mt-4">
              <Table />
            </div>
          </div>
        </div>
      ) : (
        <div></div> // You can replace this with a loading indicator or placeholder content
      )}
    </>
  );
}
