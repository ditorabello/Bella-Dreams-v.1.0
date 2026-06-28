"use client";

import React from "react";
import { X, ShieldCheck, Scale, FileText } from "lucide-react";

interface LegalDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "terms" | "privacy" | "shipping";
}

export default function LegalDocModal({ isOpen, onClose, type }: LegalDocModalProps) {
  if (!isOpen) return null;

  const contentMap = {
    terms: {
      title: "Términos del Servicio",
      icon: <Scale className="w-5 h-5 text-[#D4AF37]" />,
      desc: "Condiciones de compra y reservas de Bella Dreams.",
      body: (
        <div className="space-y-4 text-[11px] text-gray-600 font-sans leading-relaxed">
          <p className="font-bold text-gray-800 text-xs border-b border-gray-100 pb-1">1. Reservas y Apartados (Abonos)</p>
          <p>
            Al utilizar nuestra plataforma de boutique, tienes la opción de reservar prendas exclusivas mediante pagos parciales o abonos. El monto mínimo de abono es del 30% del valor total del pedido. Una vez efectuado el abono, el producto se retirará de forma automática del inventario público y se guardará bajo tu nombre por un plazo máximo de 30 días calendario.
          </p>
          <p className="font-bold text-gray-800 text-xs border-b border-gray-100 pb-1">2. Liquidación de Balances</p>
          <p>
            El saldo restante de todo producto en modalidad de apartado deberá ser liquidado en su totalidad al momento del retiro en tienda física o previo al despacho mediante servicio express de delivery (Motoconcho) o envío estándar nacional.
          </p>
          <p className="font-bold text-gray-800 text-xs border-b border-gray-100 pb-1">3. Política de Cancelación</p>
          <p>
            Si decides cancelar una reserva o no liquidas el balance pendiente en el plazo estipulado de 30 días, Bella Dreams retendrá un 10% del total de la prenda por concepto de almacenamiento y pérdida de oportunidad de venta. El saldo restante te será devuelto en forma de crédito de tienda aplicable a nuevas adquisiciones.
          </p>
        </div>
      )
    },
    privacy: {
      title: "Políticas de Privacidad",
      icon: <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />,
      desc: "Tratamiento de datos personales en nuestra plataforma.",
      body: (
        <div className="space-y-4 text-[11px] text-gray-600 font-sans leading-relaxed">
          <p className="font-bold text-gray-800 text-xs border-b border-gray-100 pb-1">1. Consentimiento de Tratamiento</p>
          <p>
            En Bella Dreams respetamos profundamente tu privacidad. La información recopilada mediante nuestro portal de pago y registro (nombre, teléfono de contacto, correo y dirección de entrega) se utilizará única y exclusivamente para procesar tus pedidos, coordinar el servicio de despacho caribeño y enviarte notificaciones personalizadas sobre el estatus de tu pedido.
          </p>
          <p className="font-bold text-gray-800 text-xs border-b border-gray-100 pb-1">2. Seguridad en Medios de Pago</p>
          <p>
            No almacenamos información crediticia directa o CVVs de tarjetas de crédito/débito en nuestros servidores locales. El procesamiento de transacciones digitales se realiza a través de pasarelas de pago seguras cifradas de extremo a extremo que cumplen con el estándar internacional PCI-DSS.
          </p>
        </div>
      )
    },
    shipping: {
      title: "Métodos de Envío & Despacho",
      icon: <FileText className="w-5 h-5 text-[#D4AF37]" />,
      desc: "Garantía de entrega rápida y segura en República Dominicana.",
      body: (
        <div className="space-y-4 text-[11px] text-gray-600 font-sans leading-relaxed">
          <p className="font-bold text-gray-800 text-xs border-b border-gray-100 pb-1">1. Envío Express por Motoconcho</p>
          <p>
            Disponible para el Gran Santo Domingo con entregas garantizadas en un rango de 2 a 4 horas laborables. Tiene una tarifa única fija de RD$ 250 DOP. El mensajero requerirá la firma de entrega física y validación de identidad para descargar el pedido de forma óptima.
          </p>
          <p className="font-bold text-gray-800 text-xs border-b border-gray-100 pb-1">2. Envío Nacional Estándar</p>
          <p>
            Despachos a todas las provincias de la República Dominicana (Santiago, Higüey, Puerto Plata, La Romana, etc.) a través de mensajería certificada Express nacional o Caribe Pack. El tiempo estimado de entrega ronda entre las 24 y 48 horas hábiles por una tarifa fija de RD$ 150 DOP.
          </p>
          <p className="font-bold text-gray-800 text-xs border-b border-gray-100 pb-1">3. Retiro Físico en Boutique (Gratuito)</p>
          <p>
            Puedes retirar tus prendas directamente en nuestra sucursal de Santo Domingo sin cargos adicionales. Simplemente presenta el número de pedido registrado o el comprobante generado digitalmente tras el checkout.
          </p>
        </div>
      )
    }
  };

  const activeDoc = contentMap[type] || contentMap.terms;

  return (
    <div 
      id="legal-doc-modal-backdrop" 
      className="fixed inset-0 bg-[#2C2623]/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="legal-doc-modal-body"
        className="bg-white border border-[#D4AF37]/35 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-slideUp font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#FAF6ED]">
          <div className="flex items-center gap-2">
            {activeDoc.icon}
            <div>
              <h3 className="font-serif font-bold text-sm text-[#2C2623]">{activeDoc.title}</h3>
              <p className="text-[10px] text-gray-500">{activeDoc.desc}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 p-1 rounded-full cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto max-h-[55vh] leading-relaxed">
          {activeDoc.body}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#2C2623] hover:bg-[#2C2623]/90 text-white font-serif font-semibold text-xs px-5 py-2 rounded-lg cursor-pointer transition shadow"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
