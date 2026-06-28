import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bella Dreams - Boutique",
  description: "Boutique elegantemente estilizada para a sua seleção exclusiva de roupas e fragrâncias premium",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased min-h-screen bg-[#FAF9F5] text-[#2C2623] selection:bg-[#D4AF37]/20">
        {children}
      </body>
    </html>
  );
}
