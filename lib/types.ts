export interface Product {
  sku: string;
  name: string;
  description: string;
  price: number;
  category: "vestidos" | "calzados" | "fragancias" | "accesorios";
  images: string[];
  sizes?: string[];
  colors?: string[];
  stock: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  isSelected?: boolean; // For selective cart billing
}

export interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  deliveryMethod: "express" | "standard" | "pickup";
  deliveryAddress: string;
  deliveryCost: number;
  paymentMethod: "tarjeta" | "transferencia" | "efectivo";
  paymentSplit: "full" | "partial";
  partialPercentage: number;
  partialAmountPaid: number;
  total: number;
  status: "Pendiente" | "Preparado" | "En camino" | "Entregado" | "Cancelado";
  items: {
    sku: string;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  message: string;
  channel: "WhatsApp" | "Email" | "Sistema";
  timestamp: string;
  read: boolean;
}
