import React from "react";
import Logo from "../components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center">
      <Logo size="lg" className="mb-6" />
      <h1 className="font-serif text-3xl md:text-4xl text-[#2C2623] mb-4 font-semibold">
        Página no encontrada
      </h1>
      <p className="text-gray-600 mb-8 max-w-md font-sans text-sm">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="px-6 py-3 bg-[#2C2623] text-white hover:text-[#D4AF37] rounded-md shadow hover:bg-[#2C2623]/90 transition duration-300 text-sm font-sans uppercase font-medium tracking-wider"
      >
        Volver al Inicio
      </a>
    </div>
  );
}
