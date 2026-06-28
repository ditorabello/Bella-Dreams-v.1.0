import { Product } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    sku: "VEST-01",
    name: "Vestido de Seda Floral Esplendor",
    description: "Vestido fluido de seda premium con pliegues florais elegantes y hombros descubiertos. Ideal para cócteles y eventos mágicos bajo el atardecer caribeño.",
    price: 3800,
    category: "vestidos",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Rojo Rosas", "Marfil Oro", "Esmeralda"],
    stock: 12,
    featured: true
  },
  {
    sku: "VEST-02",
    name: "Vestido Midi Cacao Rústico",
    description: "Vestido midi de lino puro 100% transpirable con finas tiras cruzadas en la espalda. Texturas suaves y naturales inspiradas en la costa dominicana.",
    price: 2950,
    category: "vestidos",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"],
    sizes: ["S", "M", "L"],
    colors: ["Marrón Cacao", "Arena Blanca"],
    stock: 8,
    featured: false
  },
  {
    sku: "FRAG-01",
    name: "Bella de Noche - Premium Parfum",
    description: "Una fragancia embriagadora con notas medias de jazmín nocturno, cacao orgánico dominicano, vainilla dulce y un sutil fondo de cedro.",
    price: 4500,
    category: "fragancias",
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"],
    stock: 5,
    featured: true
  },
  {
    sku: "FRAG-02",
    name: "Ambar Caribe - Eau de Toilette",
    description: "Esencia fresca de mandarina, coco tropical y base de ámbar puro que evoca la calidez de las playas dominicanas.",
    price: 3900,
    category: "fragancias",
    images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80"],
    stock: 15,
    featured: false
  },
  {
    sku: "CALZ-01",
    name: "Zapatillas Bella Tacón Nude",
    description: "Tacones de gamuza suave con tiras delgadas de sujeción al tobillo y plantilla acolchada para máxima comodidad durante la noche.",
    price: 4100,
    category: "calzados",
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"],
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["Nude Classic", "Negro Profundo"],
    stock: 10,
    featured: true
  },
  {
    sku: "CALZ-02",
    name: "Sandalias Brisa Dorada",
    description: "Sandalias bajas de cuero suave con detalles de filigrana metálica dorada. Perfectas para un paseo casual o una cena informal.",
    price: 2600,
    category: "calzados",
    images: ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80"],
    sizes: ["36", "37", "38", "39"],
    colors: ["Oro", "Bronce"],
    stock: 14,
    featured: false
  },
  {
    sku: "ACCE-01",
    name: "Cartera Clutch Imperial Brocado",
    description: "Exquisita cartera de mano forrada con brocado de seda dorado y broche magnético de pedrería fina. Cabe tu móvil, perfume y labial preferidos.",
    price: 3200,
    category: "accesorios",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80"],
    colors: ["Dorado Imperial", "Plata Diamante"],
    stock: 6,
    featured: true
  },
  {
    sku: "ACCE-02",
    name: "Aretes Solsticio de Verano",
    description: "Pendientes colgantes asimétricos bañados en oro de 18 quilates con microperlas cultivadas naturales. Elegancia caribeña inconfundible.",
    price: 1850,
    category: "accesorios",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"],
    stock: 20,
    featured: false
  }
];
