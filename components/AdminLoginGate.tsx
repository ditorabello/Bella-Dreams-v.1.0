"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";

interface AdminLoginGateProps {
  correctPasswordHash: string; // The correct admin password to check against
  onAuthenticate: () => void;
  onClose: () => void;
}

export default function AdminLoginGate({
  correctPasswordHash,
  onAuthenticate,
  onClose
}: AdminLoginGateProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPasswordHash) {
      setError("");
      onAuthenticate();
    } else {
      setError("Senha incorreta. Por favor, tente novamente.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fadeIn font-sans">
      <div className="bg-white border border-[#D4AF37]/25 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
        
        {/* Luxury top accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2C2623] via-[#D4AF37] to-[#2C2623]" />

        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#2C2623] transition mb-6 cursor-pointer select-none font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para a Loja
        </button>

        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto w-12 h-12 bg-[#FAF6ED] border border-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">Acesso Restrito</span>
            <h3 className="text-xl font-serif text-[#2C2623] mt-0.5">Painel Administrativo</h3>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
            Insira a contrassenha de segurança para gerenciar pedidos, visualizar relatórios de interesse e modificar produtos.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-800 text-xs font-medium mb-5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider block">
              Contrassenha de Acesso
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Insira a senha do admin..."
                className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#D4AF37] pr-10 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2C2623] hover:bg-[#2C2623]/95 text-[#D4AF37] font-serif font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer select-none shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            Entrar no Painel
          </button>
        </form>

        {/* Informative credentials hint box */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <div className="inline-block bg-[#FAF6ED] border border-[#D4AF37]/10 rounded-xl px-4 py-2 text-[10.5px] text-gray-500 font-sans leading-relaxed">
            <span className="font-semibold text-gray-700 block">Dica de Acesso:</span>
            A contrassenha padrão é <strong className="font-mono text-[#D4AF37] bg-white px-1.5 py-0.5 rounded border border-gray-200 mt-0.5 inline-block select-all">bella123</strong>
            <span className="block text-[9.5px] text-gray-400 mt-1 italic">
              (Você pode alterar esta senha de acesso no próprio painel admin após logar)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
