"use client";

import React from "react";
import { ShoppingBag, ShieldAlert, Heart, Menu, X } from "lucide-react";
import Logo from "./Logo";

interface BoutiqueHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  isAdminOpen: boolean;
  onToggleAdmin: () => void;
  favoritesCount?: number;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export default function BoutiqueHeader({
  cartCount,
  onOpenCart,
  isAdminOpen,
  onToggleAdmin,
  favoritesCount = 0,
  selectedCategory,
  onSelectCategory
}: BoutiqueHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header 
      id="boutique-navbar" 
      className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-[#D4AF37]/15 z-40 transition-all duration-300 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-18 flex items-center justify-between">
        
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-700 hover:text-[#D4AF37] p-1.5 focus:outline-hidden"
          title="Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Identity */}
        <Logo size="md" className="shrink-0" />

        {/* Center navigation links */}
        <nav className="hidden md:flex items-center gap-6 font-sans text-xs uppercase font-light tracking-[0.15em] text-gray-600">
          {[
            { key: "vestidos", label: "Vestidos" },
            { key: "fragancias", label: "Fragancias" },
            { key: "calzados", label: "Calzados" },
            { key: "accesorios", label: "Accesorios" }
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={(e) => {
                e.preventDefault();
                if (onSelectCategory) onSelectCategory(cat.key);
              }}
              className={`hover:text-[#D4AF37] transition font-medium tracking-widest cursor-pointer select-none border-b-2 pb-1 ${
                selectedCategory === cat.key 
                  ? "text-[#D4AF37] font-semibold border-[#D4AF37]" 
                  : "border-transparent text-gray-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 md:gap-3">
          
          {/* Admin Switch */}
          <button
            onClick={onToggleAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition border cursor-pointer font-sans select-none ${
              isAdminOpen 
                ? "bg-[#2C2623] text-[#D4AF37] border-[#D4AF37] font-semibold"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-[#2C2623]"
            }`}
            title="Administración de Pedidos"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-sans text-[10px] uppercase font-bold tracking-wider">
              {isAdminOpen ? "Ver Tienda" : "Panel Admin"}
            </span>
          </button>

          {/* Favorites */}
          <div className="relative text-gray-500 hover:text-red-500 p-2 cursor-pointer transition hidden sm:block">
            <Heart className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white font-mono text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-white">
                {favoritesCount}
              </span>
            )}
          </div>

          {/* Cart Bag */}
          <button
            onClick={onOpenCart}
            className="relative bg-[#2C2623] hover:bg-[#2C2623]/90 text-white hover:text-[#D4AF37] p-2.5 rounded-full shadow cursor-pointer transition flex items-center justify-center"
            title="Bolsa de Compras (Funda Selectiva)"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#D4AF37] text-[#2C2623] font-mono text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-scaleIn">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Mobile submenu modal indicator */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#D4AF37]/10 bg-[#FAF6ED] px-6 py-4 space-y-3 font-sans text-xs uppercase tracking-widest text-[#2C2623] font-medium transition animate-slideDown flex flex-col items-start">
          {[
            { key: "vestidos", label: "Vestidos de Gala" },
            { key: "fragancias", label: "Fragancias Seleccionadas" },
            { key: "calzados", label: "Zapatos & Sandalias" },
            { key: "accesorios", label: "Joyas & Accesorios" }
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onSelectCategory) onSelectCategory(cat.key);
              }}
              className={`block w-full text-left py-1 hover:text-[#D4AF37] cursor-pointer select-none font-medium leading-normal bg-transparent border-none ${
                selectedCategory === cat.key ? "text-[#D4AF37] font-semibold" : "text-[#2C2623]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
