"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, ShieldCheck, Heart, Sparkles, AlertCircle, Trash2, 
  Plus, Minus, X, Check, Lock, Gift, Truck, Smartphone, Star, 
  MapPin, HelpCircle, ArrowRight, Instagram, Phone, Copy
} from "lucide-react";
import { Product, CartItem, Order, NotificationItem } from "../lib/types";
import { INITIAL_PRODUCTS } from "../lib/mockData";
import { db, auth, isFirebaseConfigured } from "../lib/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Image from "next/image";

import BoutiqueHeader from "../components/BoutiqueHeader";
import AdminDashboard from "../components/AdminDashboard";
import AdminLoginGate from "../components/AdminLoginGate";
import LegalDocModal from "../components/LegalDocModal";

export default function BellaDreamsBoutique() {
  // Storefront & Navigation
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [productLikes, setProductLikes] = useState<Record<string, number>>({
    "VEST-01": 28,
    "VEST-02": 14,
    "FRAG-01": 42,
    "FRAG-02": 19,
    "CALZ-01": 25,
    "CALZ-02": 11,
    "ACCE-01": 31,
    "ACCE-02": 15
  });

  const [hasMounted, setHasMounted] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("bella123");

  // Read data from localStorage only after mount
  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== "undefined") {
      const savedPassword = localStorage.getItem("bella_dreams_admin_password");
      if (savedPassword) {
        setAdminPassword(savedPassword);
      }
      const savedProducts = localStorage.getItem("bella_dreams_products");
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          if (parsed && Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        } catch (e) {}
      }
      const savedFavs = localStorage.getItem("bella_dreams_user_favorites");
      if (savedFavs) {
        try {
          const parsed = JSON.parse(savedFavs);
          if (parsed && Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        } catch (e) {}
      }
      const savedLikes = localStorage.getItem("bella_dreams_likes_map");
      if (savedLikes) {
        try {
          const parsed = JSON.parse(savedLikes);
          if (parsed && typeof parsed === "object") {
            setProductLikes(parsed);
          }
        } catch (e) {}
      }
    }
  }, []);

  // Write changes to localStorage, with a hasMounted check to prevent overwriting saved data with default values on load
  useEffect(() => {
    if (hasMounted && typeof window !== "undefined") {
      localStorage.setItem("bella_dreams_products", JSON.stringify(products));
    }
  }, [products, hasMounted]);

  useEffect(() => {
    if (hasMounted && typeof window !== "undefined") {
      localStorage.setItem("bella_dreams_user_favorites", JSON.stringify(favorites));
    }
  }, [favorites, hasMounted]);

  useEffect(() => {
    if (hasMounted && typeof window !== "undefined") {
      localStorage.setItem("bella_dreams_likes_map", JSON.stringify(productLikes));
    }
  }, [productLikes, hasMounted]);

  useEffect(() => {
    if (hasMounted && typeof window !== "undefined") {
      localStorage.setItem("bella_dreams_admin_password", adminPassword);
    }
  }, [adminPassword, hasMounted]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Shopping Cart & Selection (Selective cart billing)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCartSkus, setSelectedCartSkus] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);

  // Checkout inputs
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"express" | "standard" | "pickup">("standard");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"tarjeta" | "transferencia" | "efectivo">("tarjeta");
  const [packingOption, setPackingOption] = useState<"standard" | "premium">("standard");

  // Specific clothes / shoes selections
  const [chosenSize, setChosenSize] = useState<string>("");
  const [chosenColor, setChosenColor] = useState<string>("");

  // Card payment mock fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Orders & Notifications (Durable state synced local-or-firebase)
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);
  
  // Dashboard & Navigation controls
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<"terms" | "privacy" | "shipping" | null>(null);

  // Clear cart interactive confirmation state
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // Clipboard copying feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const handleCopyText = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Fetch Firestore initial collections if configured, else keep simulated local arrays
  useEffect(() => {
    const loadBackendData = async () => {
      if (isFirebaseConfigured && db) {
        try {
          // Sync Orders
          const ordersSnap = await getDocs(collection(db, "orders"));
          const ordersList = ordersSnap.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          } as Order));
          // Sort descending
          ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(ordersList);

          // Sync Notifications
          const notifsSnap = await getDocs(collection(db, "notifications"));
          const notifsList = notifsSnap.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          } as NotificationItem));
          notifsList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setNotifications(notifsList);
        } catch (err) {
          console.error("Error accessing Cloud Firestore datasets. Switched to local offline mode.", err);
        }
      }
    };
    loadBackendData();
  }, []);

  // Sync selection with cart changes
  useEffect(() => {
    const currentSkus = cart.map(it => it.product.sku);
    setSelectedCartSkus((prev) => {
      // Remove Skus that were deleted from cart
      const filtered = prev.filter(sku => currentSkus.includes(sku));
      // Automatically add new cart additions
      const newSkus = currentSkus.filter(sku => !prev.includes(sku));
      return [...filtered, ...newSkus];
    });
  }, [cart]);

  // Helper formats
  const formatPrice = (val: number) => {
    return val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const handleToggleFavorite = (sku: string) => {
    const isLiked = favorites.includes(sku);
    setFavorites((prev) => 
      isLiked ? prev.filter((id) => id !== sku) : [...prev, sku]
    );
    setProductLikes((prev) => ({
      ...prev,
      [sku]: Math.max(0, (prev[sku] || 0) + (isLiked ? -1 : 1))
    }));
  };

  // Cart operations
  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (it) => it.product.sku === product.sku &&
                it.selectedSize === size &&
                it.selectedColor === color
      );
      if (existing) {
        return prev.map((it) => 
          it.product.sku === product.sku && it.selectedSize === size && it.selectedColor === color
            ? { ...it, quantity: it.quantity + 1 }
            : it
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color, isSelected: true }];
    });
    
    // Auto open cart
    setIsCartOpen(true);
    setSelectedProduct(null);
  };

  const handleRemoveFromCart = (sku: string, size?: string, color?: string) => {
    setCart((prev) => prev.filter(
      (it) => !(it.product.sku === sku && it.selectedSize === size && it.selectedColor === color)
    ));
  };

  const handleClearCart = () => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      // Reset confirmation after 4 seconds if not clicked again
      setTimeout(() => {
        setIsConfirmingClear((current) => {
          if (current) return false;
          return current;
        });
      }, 4000);
    } else {
      setCart([]);
      setSelectedCartSkus([]);
      setIsConfirmingClear(false);
    }
  };

  const handleUpdateQty = (sku: string, size: string | undefined, color: string | undefined, delta: number) => {
    setCart((prev) => 
      prev.map((it) => {
        if (it.product.sku === sku && it.selectedSize === size && it.selectedColor === color) {
          const nextQty = it.quantity + delta;
          return { ...it, quantity: nextQty < 1 ? 1 : nextQty };
        }
        return it;
      })
    );
  };

  const handleToggleProductSelectionInCart = (sku: string) => {
    setSelectedCartSkus((prev) => 
      prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku]
    );
  };

  // Digital channels simulation & notification management
  const handleAddNewNotification = async (message: string, channel: "WhatsApp" | "Email" | "Sistema") => {
    const timestampStr = new Date().toLocaleTimeString("es-DO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }) + " " + new Date().toLocaleDateString("es-DO");

    const newNotif = {
      message,
      channel,
      timestamp: timestampStr,
      read: false
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "notifications"), newNotif);
        setNotifications((prev) => [
          { id: docRef.id, ...newNotif },
          ...prev
        ]);
        return;
      } catch (err) {
        console.warn("Firestore error adding notification; proceeding offline.", err);
      }
    }

    // Offline state fallback
    const localNotif: NotificationItem = {
      id: "nt-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
      ...newNotif
    };
    setNotifications((prev) => [localNotif, ...prev]);
  };

  const triggerSpecialConfetti = () => {
    import("canvas-confetti").then((module) => {
      const confettiFn = module.default;
      confettiFn({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#2C2623", "#ffffff", "#FAF6ED"]
      });
    });
  };

  // Calculations for billing
  const selectedItems = cart.filter(item => selectedCartSkus.includes(item.product.sku));
  const subtotalProducts = selectedItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const packingCost = packingOption === "premium" ? 150 : 0; // standard wrapping/funda vs luxury box
  const finalDeliveryCost = deliveryMethod === "express" ? 250 : deliveryMethod === "standard" ? 150 : 0;
  const totalOrderSum = subtotalProducts + packingCost + finalDeliveryCost;

  // Checkout handling
  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;
    if (!clientName.trim() || !clientPhone.trim()) {
      alert("Por favor inserta el Nombre y Teléfono del cliente.");
      return;
    }

    const generatedId = "BD-" + Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toLocaleString("es-DO");

    const orderData = {
      clientName,
      clientPhone,
      clientEmail: clientEmail || "Sin email",
      deliveryMethod,
      deliveryAddress: deliveryMethod === "pickup" ? "Retiro en Oficina / Boutique Principal" : deliveryAddress,
      deliveryCost: finalDeliveryCost,
      paymentMethod,
      paymentSplit: "full" as const,
      partialPercentage: 100,
      partialAmountPaid: totalOrderSum,
      total: totalOrderSum,
      status: "Pendiente" as const,
      items: selectedItems.map((it) => ({
        sku: it.product.sku,
        productName: it.product.name,
        quantity: it.quantity,
        price: it.product.price,
        size: it.selectedSize,
        color: it.selectedColor
      })),
      createdAt: dateStr
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "orders"), orderData);
        setOrders((prev) => [
          { id: docRef.id, ...orderData },
          ...prev
        ]);
        completeCheckoutFlow(generatedId);
        return;
      } catch (err) {
        console.warn("Firestore save failed; compiling local store instead.", err);
      }
    }

    // Offline storage simulation
    const localOrder: Order = {
      id: generatedId,
      ...orderData
    };
    setOrders((prev) => [localOrder, ...prev]);
    completeCheckoutFlow(generatedId);
  };

  const completeCheckoutFlow = (generatedId: string) => {
    triggerSpecialConfetti();
    setOrderSuccessId(generatedId);

    // Notifications triggering via system hooks
    handleAddNewNotification(
      `[Bella Dreams] ¡Hermosa compra #${generatedId}! Su orden por un total de RD$ ${formatPrice(totalOrderSum)} ha sido registrada con éxito. Detalle de envío: ${
        deliveryMethod === "express" ? "🏍️ Delivery Motoconcho Express" : deliveryMethod === "standard" ? "📦 Envío Estándar" : "🏬 Retiro en boutique"
      }. Estaremos notificándole. ¡Gracias por preferirnos!`,
      "WhatsApp"
    );

    handleAddNewNotification(
      `Boutique Confirmación de Orden #${generatedId}. Facturación total emitida por importe de RD$ ${formatPrice(totalOrderSum)} DOP para el cliente ${clientName}. Envío programado mediante ${deliveryMethod}.`,
      "Email"
    );

    // Remove bought items from central bag, but KEEP unselected items of "funda de compra selectiva"
    setCart((prev) => prev.filter(it => !selectedCartSkus.includes(it.product.sku)));
    
    // Clear inputs
    setClientName("");
    setClientPhone("");
    setClientEmail("");
    setDeliveryAddress("");
    setCheckoutMode(false);
  };

  // Status adjustments from Dashboard
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: Order["status"]) => {
    // If order was created in Firebase (length is typical of firestore hash vs BD-XXXX)
    const isFirebaseId = orderId.length > 8;

    if (isFirebaseId && isFirebaseConfigured && db) {
      try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: nextStatus });
        setOrders((prev) => 
          prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o)
        );
        handleAddNewNotification(
          `[Bella Dreams] Pedido #${orderId} actualizó su estatus a: *${nextStatus}*`,
          "Sistema"
        );
        return;
      } catch (err) {
        console.error("Firestore update error; fallback locally.", err);
      }
    }

    // Local update
    setOrders((prev) => 
      prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o)
    );
    handleAddNewNotification(
      `[Bella Dreams Update] El pedido temporal #${orderId} de nuestro cliente ha cambiado al estatus: ${nextStatus}.`,
      "Sistema"
    );
  };

  const handleDeleteOrder = async (orderId: string) => {
    const isFirebaseId = orderId.length > 8;

    if (isFirebaseId && isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        return;
      } catch (err) {
        console.error("Firestore delete error;", err);
      }
    }

    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    handleAddNewNotification(
      `[Bella Dreams Catálogo] Se ha añadido un nuevo producto al catálogo: "${newProd.name}" con SKU: ${newProd.sku}.`,
      "Sistema"
    );
  };

  const handleEditProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => p.sku === updatedProd.sku ? updatedProd : p));
    setCart((prev) => prev.map((it) => it.product.sku === updatedProd.sku ? { ...it, product: updatedProd } : it));
    handleAddNewNotification(
      `[Bella Dreams Catálogo] Se ha modificado el producto: "${updatedProd.name}" (SKU: ${updatedProd.sku}) con nuevo precio RD$ ${formatPrice(updatedProd.price)}.`,
      "Sistema"
    );
  };

  const handleDeleteProduct = (sku: string) => {
    const prodName = products.find((p) => p.sku === sku)?.name || sku;
    setProducts((prev) => prev.filter((p) => p.sku !== sku));
    setCart((prev) => prev.filter((it) => it.product.sku !== sku));
    handleAddNewNotification(
      `[Bella Dreams Catálogo] Se ha eliminado el producto "${prodName}" (SKU: ${sku}) del catálogo.`,
      "Sistema"
    );
  };

  return (
    <div id="boutique-frame-root" className="min-h-screen flex flex-col font-sans selection:bg-[#D4AF37]/30 bg-[#FCFBF7]">
      
      {/* Header */}
      <BoutiqueHeader
        cartCount={cart.reduce((acc, it) => acc + it.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        isAdminOpen={isAdminOpen}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
        favoritesCount={favorites.length}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById("galeria");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />

      {/* ADMIN LEVEL SWITCH BOARD */}
      {isAdminOpen ? (
        !isAdminAuthenticated ? (
          <AdminLoginGate
            correctPasswordHash={adminPassword}
            onAuthenticate={() => setIsAdminAuthenticated(true)}
            onClose={() => setIsAdminOpen(false)}
          />
        ) : (
          <AdminDashboard
            orders={orders}
            notifications={notifications}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onClearNotifications={handleClearNotifications}
            onTriggerNotification={handleAddNewNotification}
            productLikes={productLikes}
            products={products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            adminPassword={adminPassword}
            onUpdateAdminPassword={setAdminPassword}
          />
        )
      ) : (
        <main className="flex-1">
          
          {/* Real-time configuration state alert notice */}
          {!isFirebaseConfigured && (
            <div className="bg-[#FAF6ED] border-b border-[#D4AF37]/15 py-2.5 px-4">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-600 gap-2 font-sans font-medium">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <p>
                    <span className="font-semibold text-gray-800">Conexão Firebase Cloud pendente:</span> Atualmente rodando com banco de dados simulado localmente. O ID de Emissor de Mensagens <span className="font-mono bg-gray-100 text-[#D4AF37] px-1 rounded">1004004063593</span> está integrado no arquivo <span className="font-semibold text-[#2C2623]">/lib/firebase.ts</span>.
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 italic">Configure as chaves do cliente no arquivo .env para persistência contínua.</p>
              </div>
            </div>
          )}

          {/* Hero Banner Showcase */}
          <section id="boutique-hero" className="relative bg-[#FAF6ED] border-b border-[#D4AF37]/10 py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80')`, backgroundSize: "cover" }} />
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative flex flex-col md:flex-row items-center justify-between gap-10">
              
              <div className="space-y-6 max-w-xl text-center md:text-left">
                <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#D4AF37] flex items-center justify-center md:justify-start gap-1.5 shadow-none animate-fadeIn">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Colección de Verano Exclusiva
                </span>
                
                <h2 className="text-3xl md:text-5xl font-serif text-[#2C2623] leading-tight font-light">
                  Encuentra el Esplendor en cada <span className="font-serif italic text-[#D4AF37]">Prenda, Calzado & Aroma</span>
                </h2>
                
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-light">
                  Estilo caribeño refinado con costuras mágicas y esencias de ámbar dominicano. Disfruta de nuestra <strong>Modalidad de Compra Selectiva</strong> que te permite apartar hoy y liquidar luego en boutique.
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <a 
                    href="#galeria"
                    className="bg-[#2C2623] text-white hover:text-[#D4AF37] font-serif font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-lg shadow-md transition hover:-translate-y-0.5"
                  >
                    Explorar Catálogo
                  </a>
                  <button 
                    onClick={() => {
                      setCheckoutMode(false);
                      setIsCartOpen(true);
                    }}
                    className="bg-white border border-gray-250 text-gray-600 hover:text-gray-900 font-sans text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg font-bold transition hover:bg-gray-50 flex items-center gap-2"
                  >
                    Ver Bolsa de Compras
                  </button>
                </div>
              </div>

              {/* Specialized "Día del Profesor" High-Fidelity Promotional Poster Card */}
              <div 
                id="promo-dia-del-profesor" 
                className="w-full max-w-sm md:max-w-md bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F0] to-[#F5ECD2] border border-[#D4AF37]/35 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between shrink-0 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Visual subtle sparkles overlay */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D4AF37]/15 transition-all duration-500" />

                {/* Poster Golden Round Badge Header */}
                <div className="flex flex-col items-center justify-center text-center space-y-1 pb-3 text-[#2C2623]">
                  <div className="border border-[#D4AF37]/30 rounded-full p-2.5 w-24 h-24 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs relative shadow-xs">
                    <span className="text-sm leading-none">👑</span>
                    <span className="font-serif font-black tracking-widest text-xs mt-0.5">B D</span>
                    <span className="text-[8px] font-serif tracking-widest uppercase font-bold">BELLA</span>
                    <span className="text-[6.5px] font-mono tracking-widest uppercase text-gray-400">DREAMS</span>
                    <span className="text-[5.5px] text-[#D4AF37] font-semibold uppercase tracking-[0.2em] mt-0.5">BY ANABEL</span>
                  </div>
                  
                  <div className="mt-3.5 space-y-0.5 select-none text-center">
                    <span className="text-[8.5px] uppercase font-bold tracking-[0.25em] text-gray-500 block">¡ T E N E M O S</span>
                    <h2 className="text-xl md:text-2xl font-serif font-black text-[#D4AF37] tracking-wider uppercase leading-none">OFERTAS</h2>
                    <span className="text-[8.5px] uppercase font-bold tracking-[0.25em] text-gray-400 block pb-1">P O R   E L</span>
                    
                    {/* Ribbon styled banner text */}
                    <div className="bg-gradient-to-r from-[#D4AF37] to-[#B89030] text-white text-[9.5px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg shadow-xs font-sans mx-auto inline-block">
                      🎓 ¡Día del Profesor!
                    </div>
                  </div>
                </div>

                {/* Middle Content Segment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3 items-center">
                  
                  {/* Left block of text & badges */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[9.5px] text-gray-600 leading-relaxed font-semibold">
                        {"\"Porque su dedicación inspira sueños y deja huellas para siempre.\""}
                      </p>
                    </div>

                    <div className="bg-white/80 border border-[#D4AF37]/20 p-2.5 rounded-xl flex items-center gap-2 shadow-3xs">
                      <Gift className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <p className="text-[8px] font-sans font-bold text-[#2C2623] uppercase tracking-wider leading-snug">
                        Sorprende a ese profesor especial con el regalo perfecto.
                      </p>
                    </div>
                  </div>

                  {/* Right block: Book + glasses layout overlay */}
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-[#D4AF37]/15 shadow-2xs bg-gray-50">
                    <Image 
                      src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=450&q=80" 
                      alt="Día del profesor"
                      fill
                      sizes="200px"
                      className="object-cover group-hover:scale-105 transition duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient vignette layer to read text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10 flex flex-col justify-end p-2.5" />
                    
                    {/* Written message overlay */}
                    <div className="absolute bottom-2 left-2 right-2 text-center text-white space-y-0.5">
                      <p className="font-serif italic text-[9px] leading-tight text-[#FAF6ED]">
                        {"\"Gracias por enseñar con el corazón\""}
                      </p>
                      <span className="text-[10px] text-rose-400">❤</span>
                    </div>
                  </div>

                </div>

                {/* Bottom Gold-Brown Ribbon */}
                <div className="bg-[#B89030] text-center py-1.5 px-3 rounded-lg text-white font-sans text-[8px] uppercase font-bold tracking-[0.2em] flex items-center justify-center gap-1 shadow-inner mt-1">
                  <span>Recuerdos que perduran</span>
                  <Heart className="w-2.5 h-2.5 text-white fill-current animate-pulse" />
                </div>

              </div>

            </div>
          </section>

          {/* Catalog & Filter controls */}
          <section id="galeria" className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-10">
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-[#D4AF37]/15 pb-4">
              <div>
                <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">Cápsula de Estilos</span>
                <h3 className="text-xl md:text-2xl font-serif text-[#2C2623] mt-0.5">Nuestra Selección Exclusiva</h3>
              </div>

              {/* Categories Rail */}
              <div className="flex flex-wrap gap-1.5 mt-3.5 md:mt-0 bg-gray-100/75 p-1 rounded-xl">
                {[
                  { key: "todos", label: "✨ Mostrar Todo" },
                  { key: "vestidos", label: "👗 Vestidos" },
                  { key: "fragancias", label: "💎 Fragancias" },
                  { key: "calzados", label: "👠 Calzados" },
                  { key: "accesorios", label: "💍 Accesorios" }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 py-2 rounded-lg text-xs font-sans font-medium capitalize tracking-wide select-none transition cursor-pointer ${
                      selectedCategory === cat.key
                        ? "bg-[#2C2623] text-white shadow-xs font-semibold"
                        : "text-gray-500 hover:bg-gray-205/60 hover:text-gray-900"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter(p => selectedCategory === "todos" || p.category === selectedCategory)
                .map((product) => (
                  <div 
                    key={product.sku}
                    id={`product-card-${product.sku}`}
                    className="group bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    {/* Media Block */}
                    <div 
                      className="relative aspect-square overflow-hidden bg-gray-50 shrink-0 cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setChosenSize(product.sizes ? product.sizes[0] : "");
                        setChosenColor(product.colors ? product.colors[0] : "");
                      }}
                    >
                      <Image 
                        src={product.images[0]} 
                        alt={product.name} 
                        fill 
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition duration-500" 
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Interactive Heart */}
                      <button
                        key={`heart-grid-${product.sku}-${favorites.includes(product.sku)}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Avoid triggering open card modal
                          handleToggleFavorite(product.sku);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full cursor-pointer z-10 transition-all duration-300 transform active:scale-90 hover:scale-110 ${
                          favorites.includes(product.sku) 
                            ? "bg-red-500 text-white shadow-md scale-105" 
                            : "bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 backdrop-blur-xs"
                        }`}
                        title="Agregar a favoritos"
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorites.includes(product.sku) ? "fill-current text-white animate-pulse" : ""}`} />
                      </button>

                      {/* Badges */}
                      {product.stock <= 5 && (
                        <span className="absolute bottom-3 left-3 bg-red-650 text-white font-sans text-[8.5px] uppercase font-black px-2.5 py-0.5 rounded-md tracking-wider">
                          ¡Solo {product.stock} restantes!
                        </span>
                      )}
                      
                      {/* Featured Star */}
                      {product.featured && (
                        <span className="absolute top-3 left-3 bg-[#2C2623] text-[#D4AF37] font-serif text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                          <Star className="w-2.5 h-2.5 fill-current" /> Exclusividad
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* SKU and Category */}
                        <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono uppercase tracking-wider">
                          <span>SKU: {product.sku}</span>
                          <span>{product.category}</span>
                        </div>
                        
                        {/* Name */}
                        <h4 className="font-serif font-bold text-gray-800 text-sm mt-1 limit-2-lines leading-tight group-hover:text-[#D4AF37] transition">
                          {product.name}
                        </h4>
                        
                        {/* Description */}
                        <p className="text-[11px] text-gray-400 leading-snug font-light mt-1 text-ellipsis overflow-hidden line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="space-y-3 dt-product-action-block">
                        {/* Pricing */}
                        <div className="flex items-baseline justify-between">
                          <span className="text-[10px] text-gray-450">Inversión:</span>
                          <span className="text-sm font-serif font-extrabold text-[#2C2623] font-mono">
                            RD$ {formatPrice(product.price)} <span className="text-[9px] font-sans font-light text-gray-400">DOP</span>
                          </span>
                        </div>

                        {/* Interactive Selection Details or Quick purchase buttons */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProduct(product);
                            // Auto reset specific selections
                            setChosenSize(product.sizes ? product.sizes[0] : "");
                            setChosenColor(product.colors ? product.colors[0] : "");
                          }}
                          className="w-full bg-[#2C2623] hover:bg-[#2C2623]/90 text-white hover:text-[#D4AF37] text-[10px] font-serif uppercase tracking-widest font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer focus:outline-hidden"
                        >
                          Elegir Variantes & Añadir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Promo Callout Grid */}
          <section id="promo-guarantees" className="bg-[#FAF6ED]/70 border-y border-[#D4AF37]/15 py-10 mt-16 font-sans">
            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
              
              <div className="space-y-2 p-3">
                <span className="text-2xl" role="img" aria-label="shield">🛡️</span>
                <h4 className="font-serif font-bold text-[#2C2623] text-sm">Funda de Compra Selectiva</h4>
                <p className="text-gray-400 leading-relaxed text-[11px]">
                  Paga solo lo seleccionado ahora. Lo demás se resguarda automáticamente en tu bolso caribeño.
                </p>
              </div>

              <div className="space-y-2 p-3">
                <span className="text-2xl" role="img" aria-label="moto">🏍️</span>
                <h4 className="font-serif font-bold text-[#2C2623] text-sm">Entregas de Alta Velocidad</h4>
                <p className="text-gray-400 leading-relaxed text-[11px]">
                  Garantía de Motoconcho Express en 2-4 horas dentro del Gran Santo Domingo con firmas de control.
                </p>
              </div>

              <div className="space-y-2 p-3">
                <span className="text-2xl" role="img" aria-label="stars">💎</span>
                <h4 className="font-serif font-bold text-[#2C2623] text-sm">Empaque Sostenible</h4>
                <p className="text-gray-400 leading-relaxed text-[11px]">
                  Todos nuestros envíos incluyen envoltura artesanal o cajas de diseño premium reciclable.
                </p>
              </div>

            </div>
          </section>

        </main>
      )}

      {/* FOOTER COB */}
      <footer id="boutique-footer" className="bg-[#2C2623] text-white border-t border-[#D4AF37]/20 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-light text-gray-300">
          
          <div className="space-y-3">
            <h4 className="font-serif text-[#D4AF37] font-semibold text-sm tracking-wide">BELLA DREAMS BOUTIQUE</h4>
            <p className="leading-relaxed">
              Inspirados en la sofisticación de la seda y los secretos orgánicos silvestres de El Cibao. Confecciones auténticas y fragancias exclusivas importadas.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-[#D4AF37] font-semibold text-sm tracking-wide">DOCUMENTOS & LEGALES</h4>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => setLegalModalType("terms")} className="text-left hover:text-white underline cursor-pointer">Términos y Condiciones de Apartados</button>
              <button onClick={() => setLegalModalType("privacy")} className="text-left hover:text-white underline cursor-pointer">Seguridad de Datos de Tarjetas</button>
              <button onClick={() => setLegalModalType("shipping")} className="text-left hover:text-white underline cursor-pointer">Tiempos de Ruta y Envíos Nacionales</button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-[#D4AF37] font-semibold text-sm tracking-wide">CONTACTO & REDES</h4>
            <p className="flex items-start gap-1 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#D4AF37] mt-0.5" /> 
              <span>Av. 25 de febrero, #254, Villa Olímpica - Santo Domingo - RD</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />
              <span>Tel: <a href="tel:+18098170033" className="hover:text-white hover:underline transition font-medium">+1 (809) 817-0033</a></span>
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />
              <span>Soporte: <a href="tel:+18297416351" className="hover:text-white hover:underline transition font-medium">(829) 741-6351</a></span>
            </p>
            <p className="flex items-center gap-1.5 pt-1">
              <Instagram className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />
              <a 
                href="https://www.instagram.com/bella_dreamsbyanabel" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#D4AF37] hover:underline transition font-mono tracking-normal text-[11px]"
              >
                @bella_dreamsbyanabel
              </a>
            </p>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 mt-6 border-t border-white/5 text-center text-[10px] text-gray-500 font-mono">
          © 2026 Bella Dreams Boutique Inc. Reservas caribeñas selectivas. Todos los derechos reservados.
        </div>
      </footer>

      {/* PRODUCT CONFIGURATION POPAL / OVERLAY */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-[#2C2623]/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white border border-[#D4AF37]/35 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-3 right-3 z-10 bg-white/70 backdrop-blur-xs text-gray-500 hover:text-gray-800 p-1.5 rounded-full shadow-xs cursor-pointer focus:outline-hidden"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Col: Media */}
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-96 bg-gray-50 relative">
              <Image 
                src={selectedProduct.images[0]} 
                alt={selectedProduct.name} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right Col: Choices */}
            <div className="w-full md:w-1/2 p-5 flex flex-col justify-between font-sans text-xs">
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 font-mono">SKU: {selectedProduct.sku}</span>
                  <h3 className="font-serif font-bold text-[#2C2623] text-sm mt-0.5">{selectedProduct.name}</h3>
                  <div className="font-serif font-extrabold text-[#D4AF37] font-mono mt-1 text-sm">RD$ {formatPrice(selectedProduct.price)} DOP</div>
                </div>

                <p className="text-[11px] text-gray-400 leading-snug">{selectedProduct.description}</p>

                {/* SIZES PANEL IF EXISTS */}
                {selectedProduct.sizes && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider flex items-center justify-between">
                      <span>Talla Elegida {chosenSize && `(${chosenSize})`}</span>
                      <span className="text-red-500 text-[8.5px] italic font-normal">*Obligatorio</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedProduct.sizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setChosenSize(size)}
                          className={`px-3 py-1.5 rounded-md text-[10px] font-mono text-center font-bold border transition ${
                            chosenSize === size 
                              ? "bg-[#2C2623] text-white border-[#2C2623] shadow-xs" 
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-55"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* COLORS PANEL IF EXISTS */}
                {selectedProduct.colors && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Color Elegido {chosenColor && `(${chosenColor})`}</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedProduct.colors.map(col => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setChosenColor(col)}
                          className={`px-3 py-1.5 rounded-md text-[10px] text-center font-bold border transition ${
                            chosenColor === col 
                              ? "bg-[#D4AF37] text-[#2C2623] border-[#D4AF37] shadow-xs" 
                              : "bg-gray-50 text-gray-600 border-gray-250 hover:bg-gray-100"
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedProduct.sizes && !chosenSize) {
                      alert("Por favor selecciona una talla.");
                      return;
                    }
                    handleAddToCart(selectedProduct, chosenSize || undefined, chosenColor || undefined);
                  }}
                  className="w-full bg-[#2C2623] hover:bg-[#2C2623]/90 text-white font-serif font-black text-[10.5px] uppercase py-3 rounded-lg shadow cursor-pointer transition uppercase tracking-widest block text-center"
                >
                  Agregar a Bolsa Selectiva
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SELECTIVE CHILDS CART SLIDE-OUT PANEL */}
      {isCartOpen && (
        <div 
          id="cart-drawer-backdrop" 
          className="fixed inset-0 bg-[#2C2623]/60 backdrop-blur-xs z-50 flex justify-end animate-fadeIn"
          onClick={() => setIsCartOpen(false)}
        >
          <div 
            id="cart-drawer-content"
            className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col justify-between overflow-hidden animate-slideUp border-l border-[#D4AF37]/20"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header bag indicator */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#FAF6ED]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#2C2623]">Funda de Compras Selectiva</h3>
                  <p className="text-[10px] text-gray-500">{cart.length} artículos agregados</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-250/20 cursor-pointer transition"
                title="Cerrar bolsa"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive lists / Checkout flow */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              
              {!checkoutMode ? (
                <>
                  {/* Selective shopping help notice */}
                  <div className="bg-white border border-[#D4AF37]/20 p-3 rounded-lg text-[10px] font-sans text-gray-600 leading-relaxed shadow-xs flex items-start gap-2">
                    <span className="text-base select-none shrink-0" role="img" aria-label="carro">🛒</span>
                    <div>
                      <span className="font-semibold text-gray-800 block text-[11px] mb-0.5">Modalidad de Funda Selectiva</span>
                      Marca únicamente las prendas y fragancias que deseas pagar hoy. Los productos restantes se guardarán automáticamente en tu funda de compras caribeña para después.
                    </div>
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-sans space-y-3">
                      <ShoppingBag className="w-10 h-10 mx-auto text-gray-300" />
                      <p className="text-xs">Tu bolsa de compra se encuentra vacía.</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="bg-[#2C2623] text-[#D4AF37] font-serif uppercase tracking-wider text-[9px] px-4 py-2 rounded font-bold hover:bg-[#2C2623]/90 cursor-pointer"
                      >
                        Navegar Tienda
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      
                      {/* Controller selector all/none */}
                      <div className="flex justify-between items-center bg-gray-50 border border-gray-150 rounded-xl p-2.5 text-[10px] font-sans">
                        <span className="text-gray-500 font-medium font-sans">
                          {selectedCartSkus.length} de {cart.length} seleccionados
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCartSkus(cart.map(it => it.product.sku))}
                            className="text-[#D4AF37] hover:text-[#2C2623] cursor-pointer font-bold uppercase transition tracking-wider"
                          >
                            Seleccionar Todo
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            type="button"
                            onClick={() => setSelectedCartSkus([])}
                            className="text-gray-400 hover:text-red-650 cursor-pointer font-bold uppercase transition tracking-wider"
                          >
                            Ninguno
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      {cart.map((item, index) => (
                        <div 
                          key={`${item.product.sku}-${index}`} 
                          className={`flex items-start gap-3 border-b border-gray-100 pb-3 transition ${
                            selectedCartSkus.includes(item.product.sku) ? "opacity-100" : "opacity-45"
                          }`}
                        >
                          {/* Checked Checkbox selection */}
                          <div className="self-center pr-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleProductSelectionInCart(item.product.sku)}
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition cursor-pointer ${
                                selectedCartSkus.includes(item.product.sku)
                                  ? "bg-[#2C2623] text-[#D4AF37] border-[#2C2623]"
                                  : "bg-white border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              {selectedCartSkus.includes(item.product.sku) && <Check className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* Image */}
                          <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border relative">
                            <Image 
                              src={item.product.images[0]} 
                              alt={item.product.name} 
                              fill 
                              sizes="64px"
                              className="object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-1">
                            <h4 className="font-serif font-bold text-gray-800 text-xs truncate leading-none">
                              {item.product.name}
                            </h4>
                            
                            {(item.selectedSize || item.selectedColor) && (
                              <div className="text-[9px] text-[#D4AF37] font-sans font-medium">
                                {item.selectedSize && `Talla: ${item.selectedSize}`} {item.selectedColor && `| Color: ${item.selectedColor}`}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono font-bold text-gray-800">
                                RD$ {formatPrice(item.product.price)}
                              </span>

                              {/* Qty adjustments */}
                              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                <button 
                                  onClick={() => handleUpdateQty(item.product.sku, item.selectedSize, item.selectedColor, -1)}
                                  className="px-2 py-1 text-gray-500 hover:text-[#2C2623] cursor-pointer"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="px-1.5 text-[10px] font-mono font-bold text-[#2C2623]">{item.quantity}</span>
                                <button 
                                  onClick={() => handleUpdateQty(item.product.sku, item.selectedSize, item.selectedColor, 1)}
                                  className="px-2 py-1 text-gray-500 hover:text-[#2C2623] cursor-pointer"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Trash button */}
                          <button
                            onClick={() => handleRemoveFromCart(item.product.sku, item.selectedSize, item.selectedColor)}
                            className="text-gray-400 hover:text-red-600 p-1.5 self-center transition cursor-pointer hover:bg-red-55/45 rounded-lg"
                            title="Eliminar artículo de la funda"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      ))}

                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4 animate-slideUp text-xs font-sans">
                  
                  {/* Receipt Back Indicator */}
                  <button
                    onClick={() => setCheckoutMode(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    ← Modificar Carro Selectivo
                  </button>

                  <h4 className="font-serif font-bold text-[#2C2623] text-sm border-b pb-2">Información de Factura & Despacho</h4>

                  <form onSubmit={handleProcessCheckout} className="space-y-3.5">
                    
                    {/* Basic details */}
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Nombre Completo del Cliente <span className="text-red-650">*</span></label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ej: Sofía Pérez"
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Teléfono Móvil <span className="text-red-650">*</span></label>
                        <input
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="809-555-1234"
                          className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37] font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">E-mail (Factura Digital)</label>
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="sofia@gmail.com"
                          className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    {/* Method of Delivery */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 block">Tipo de Envío Dominiano</label>
                      <div className="grid grid-cols-3 gap-1.5 text-[9px]">
                        
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod("pickup")}
                          className={`p-2.5 border rounded-lg text-center font-bold tracking-wide transition leading-tight flex flex-col items-center justify-center ${
                            deliveryMethod === "pickup"
                              ? "bg-[#2C2623] text-[#D4AF37] border-[#D4AF37]"
                              : "bg-white text-gray-650 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <span>🏬 Retiro</span>
                          <span>(RD$ 0)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeliveryMethod("standard")}
                          className={`p-2.5 border rounded-lg text-center font-bold tracking-wide transition leading-tight flex flex-col items-center justify-center ${
                            deliveryMethod === "standard"
                              ? "bg-[#2C2623] text-white border-[#2C2623]"
                              : "bg-white text-gray-650 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <span>📦 Estándar</span>
                          <span>(RD$ 150)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeliveryMethod("express")}
                          className={`p-2.5 border rounded-lg text-center font-bold tracking-wide transition leading-tight flex flex-col items-center justify-center ${
                            deliveryMethod === "express"
                              ? "bg-[#2C2623] text-white border-[#2C2623]"
                              : "bg-white text-gray-650 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <span>🏍️ Motoconcho</span>
                          <span>(RD$ 250)</span>
                        </button>

                      </div>
                    </div>

                    {/* Address unless physical pickup */}
                    {deliveryMethod !== "pickup" && (
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Dirección de Despacho Completa</label>
                        <textarea
                          rows={2}
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Calle, sector, No. de Apto, Santo Domingo, RD o Provincia."
                          className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
                        />
                      </div>
                    )}

                    {/* Packing options */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 block">Empaque de Regalo</label>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setPackingOption("standard")}
                          className={`p-2 rounded-lg border font-bold text-center transition flex items-center justify-center gap-1 ${
                            packingOption === "standard"
                              ? "bg-gray-150 border-gray-300 text-gray-800"
                              : "bg-white border-gray-200 hover:bg-gray-50 text-gray-500"
                          }`}
                        >
                          Funda Artesanal (Incluida)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPackingOption("premium")}
                          className={`p-2 rounded-lg border font-bold text-center transition flex items-center justify-center gap-1 ${
                            packingOption === "premium"
                              ? "bg-[#D4AF37]/15 border-[#D4AF37] text-amber-800"
                              : "bg-white border-gray-200 hover:bg-gray-50 text-gray-500"
                          }`}
                        >
                          <Gift className="w-3.5 h-3.5 text-[#D4AF37]" /> Caja Luxury (+RD$ 150)
                        </button>
                      </div>
                    </div>

                    {/* Method of payment */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 block">Modalidad de Pago</label>
                      <div className="grid grid-cols-3 gap-1.5 text-[9px] font-bold">
                        
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("tarjeta")}
                          className={`p-2 border rounded-lg text-center transition ${
                            paymentMethod === "tarjeta" ? "bg-[#2C2623] text-[#D4AF37] border-[#D4AF37]" : "bg-white text-gray-500 border-gray-200"
                          }`}
                        >
                          💳 Tarjeta
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("transferencia")}
                          className={`p-2 border rounded-lg text-center transition ${
                            paymentMethod === "transferencia" ? "bg-[#2C2623] text-white border-[#2C2623]" : "bg-white text-gray-500 border-gray-200"
                          }`}
                        >
                          🏦 Banco / ACH
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("efectivo")}
                          className={`p-2 border rounded-lg text-center transition ${
                            paymentMethod === "efectivo" ? "bg-[#2C2623] text-white border-[#2C2623]" : "bg-white text-gray-500 border-gray-200"
                          }`}
                        >
                          💵 Contra-Pago
                        </button>

                      </div>
                    </div>

                    {/* Credit Card inputs */}
                    {paymentMethod === "tarjeta" && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-150 space-y-2.5 animate-fadeIn">
                        <div className="flex items-center gap-1 text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider mb-1">
                          <Lock className="w-3 h-3" /> Pasarela Sercil Protegida
                        </div>
                        <div>
                          <label className="text-[8.5px] uppercase font-black text-gray-450 block mb-0.5">Número de Tarjeta</label>
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                            placeholder="4000 1234 5678 9010"
                            className="w-full text-xs p-2 border border-gray-200 rounded bg-white font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[8.5px] uppercase font-black text-gray-450 block mb-0.5">Expira</label>
                            <input
                              type="text"
                              required
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/AA"
                              className="w-full text-xs p-2 border border-gray-200 rounded bg-white font-mono text-center"
                            />
                          </div>
                          <div>
                            <label className="text-[8.5px] uppercase font-black text-gray-450 block mb-0.5">CVV</label>
                            <input
                              type="password"
                              required
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="***"
                              className="w-full text-xs p-2 border border-gray-200 rounded bg-white font-mono text-center"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "transferencia" && (
                      <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#D4AF37]/30 text-[10px] text-[#2C2623] leading-relaxed space-y-3.5 animate-fadeIn">
                        
                        <div className="text-center space-y-1 pb-1 border-b border-[#D4AF37]/15">
                          <div className="font-serif font-black tracking-widest text-[#D4AF37] text-xs uppercase flex items-center justify-center gap-1">
                            👑 Información Bancaria
                          </div>
                          <p className="text-[8.5px] uppercase font-bold tracking-wider text-gray-400">
                            Aceptamos Transferencias • Depósitos • Pagos Móviles
                          </p>
                        </div>

                        {/* Banco Popular Card */}
                        <div className="bg-white border border-gray-150 rounded-xl p-3 space-y-2.5 shadow-3xs relative overflow-hidden">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                            <span className="font-bold text-blue-800 tracking-wide text-[10.5px] flex items-center gap-1">
                              🏦 Banco Popular Dominicano
                            </span>
                            <span className="bg-blue-50 text-blue-700 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded">Ahorro</span>
                          </div>

                          <div className="space-y-1.5 text-[10px]">
                            {/* Account Number */}
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-gray-450 uppercase text-[8px] font-bold">Número de cuenta:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-gray-800 text-[10.5px]">794859231</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText("794859231", "pop_acc")}
                                  className="text-gray-400 hover:text-[#D4AF37] transition p-1 hover:bg-gray-50 rounded cursor-pointer"
                                  title="Copiar cuenta"
                                >
                                  {copiedField === "pop_acc" ? (
                                    <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1 rounded animate-fadeIn">¡Copiado!</span>
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Titular */}
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-gray-450 uppercase text-[8px] font-bold">Titular:</span>
                              <span className="font-medium text-gray-700 uppercase text-[9px]">Anabel Rondon nicasio</span>
                            </div>

                            {/* Cédula */}
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-gray-450 uppercase text-[8px] font-bold">Cédula:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-semibold text-gray-700 text-[9.5px]">402-2414861-5</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText("402-2414861-5", "pop_id")}
                                  className="text-gray-400 hover:text-[#D4AF37] transition p-1 hover:bg-gray-50 rounded cursor-pointer"
                                  title="Copiar cédula"
                                >
                                  {copiedField === "pop_id" ? (
                                    <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1 rounded animate-fadeIn">¡Copiado!</span>
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Banco BHD Card */}
                        <div className="bg-white border border-gray-150 rounded-xl p-3 space-y-2.5 shadow-3xs relative overflow-hidden">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                            <span className="font-bold text-green-700 tracking-wide text-[10.5px] flex items-center gap-1">
                              🏦 Banco BHD
                            </span>
                            <span className="bg-green-50 text-green-700 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded">Ahorro</span>
                          </div>

                          <div className="space-y-1.5 text-[10px]">
                            {/* Account Number */}
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-gray-450 uppercase text-[8px] font-bold">Número de cuenta:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-gray-800 text-[10.5px]">24693670018</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText("24693670018", "bhd_acc")}
                                  className="text-gray-400 hover:text-[#D4AF37] transition p-1 hover:bg-gray-50 rounded cursor-pointer"
                                  title="Copiar cuenta"
                                >
                                  {copiedField === "bhd_acc" ? (
                                    <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1 rounded animate-fadeIn">¡Copiado!</span>
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Titular */}
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-gray-450 uppercase text-[8px] font-bold">Titular:</span>
                              <span className="font-medium text-gray-700 uppercase text-[9px]">Anabel Rondon nicasio</span>
                            </div>

                            {/* Cédula */}
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-gray-450 uppercase text-[8px] font-bold">Cédula:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-semibold text-gray-700 text-[9.5px]">402-2414861-5</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText("402-2414861-5", "bhd_id")}
                                  className="text-gray-400 hover:text-[#D4AF37] transition p-1 hover:bg-gray-50 rounded cursor-pointer"
                                  title="Copiar cédula"
                                >
                                  {copiedField === "bhd_id" ? (
                                    <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1 rounded animate-fadeIn">¡Copiado!</span>
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Alert / Important Message */}
                        <div className="bg-[#FAF6ED] border border-[#D4AF37]/25 p-2.5 rounded-xl flex items-start gap-2">
                          <span className="text-xs mt-0.5" role="img" aria-label="bell">🔔</span>
                          <p className="text-[9px] text-gray-600 leading-snug">
                            <strong className="text-gray-800 font-bold uppercase">IMPORTANTE:</strong> Una vez realizado tu pago, por favor envía tu comprobante por DM de Instagram <a href="https://www.instagram.com/bella_dreamsbyanabel" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline hover:text-[#B89030] font-bold">@bella_dreamsbyanabel</a> o WhatsApp al <a href="https://wa.me/18098170033" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline hover:text-[#B89030] font-bold">+1 (809) 817-0033</a>.
                          </p>
                        </div>

                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-[#2C2623] hover:bg-[#2C2623]/95 text-[#D4AF37] hover:text-white font-serif font-black text-xs uppercase tracking-widest py-3.5 rounded-lg shadow-md transition cursor-pointer"
                    >
                      Confirmar & Pagar RD$ {formatPrice(totalOrderSum)} DOP
                    </button>

                  </form>

                </div>
              )}

            </div>

            {/* Total order summary & controls footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-[#D4AF37]/15 bg-[#FAF6ED]/50 space-y-3.5 shrink-0">
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal de artículos seleccionados:</span>
                    <span>RD$ {formatPrice(subtotalProducts)} DOP</span>
                  </div>
                  {packingCost > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>Empaque Premium:</span>
                      <span>RD$ {formatPrice(packingCost)} DOP</span>
                    </div>
                  )}
                  {checkoutMode && finalDeliveryCost > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>Tarifa de Envío:</span>
                      <span>RD$ {formatPrice(finalDeliveryCost)} DOP</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-serif font-bold text-gray-800 border-t border-gray-100 pt-1.5">
                    <span>Monto Total de Compra:</span>
                    <span className="text-[#2C2623]">RD$ {formatPrice(totalOrderSum)} DOP</span>
                  </div>
                </div>

                {!checkoutMode ? (
                  <div className="space-y-2">
                    <button
                      disabled={selectedItems.length === 0}
                      onClick={() => setCheckoutMode(true)}
                      className="w-full bg-[#2C2623] hover:bg-neutral-800 disabled:bg-gray-250 disabled:text-gray-400 disabled:cursor-not-allowed text-white hover:text-[#D4AF37] font-serif font-black text-[10.5px] uppercase tracking-widest py-3.5 rounded-lg shadow transition cursor-pointer text-center block"
                    >
                      Proceder al Pago
                    </button>
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className={`w-full font-serif font-bold text-[9.5px] uppercase tracking-widest py-2 rounded-lg transition cursor-pointer text-center flex items-center justify-center gap-1.5 border transition-all duration-300 ${
                        isConfirmingClear 
                          ? "bg-red-600 hover:bg-red-700 text-white border-red-700 animate-pulse font-black" 
                          : "bg-red-50 hover:bg-red-100 text-red-600 border-red-200/40"
                      }`}
                    >
                      <Trash2 className="w-3 h-3" /> 
                      {isConfirmingClear ? "⚠️ ¿CONFIRMAR VACIAR FUNDA? (CLIC DE NUEVO)" : "Vaciar / Cancelar Funda"}
                    </button>
                  </div>
                ) : null}

              </div>
            )}

          </div>
        </div>
      )}

      {/* POPUP ORDER REGISTRATION SUCCESS DIALOG */}
      {orderSuccessId && (
        <div className="fixed inset-0 bg-[#2C2623]/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#D4AF37]/35 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-6 text-center space-y-4 animate-scaleIn">
            
            <div className="h-12 w-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto text-xl">
              ✓
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-[#D4AF37] tracking-wider block">Transacción Completada</span>
              <h3 className="font-serif font-bold text-gray-900 text-base">¡Bella Dreams Registró su Pedido!</h3>
              <p className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded inline-block">#{orderSuccessId}</p>
            </div>

            <p className="text-[11px] text-gray-550 leading-relaxed font-sans">
              Su orden se ha procesado con total seguridad. Hemos sincronizado las solicitudes y enviado simulaciones de alerta a los portales de mensajería (visibles en Panel Admin).
            </p>

            <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setOrderSuccessId(null);
                  setIsCartOpen(false);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans font-bold text-[10px] py-2.5 rounded-lg transition"
              >
                Seguir Comprando
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrderSuccessId(null);
                  setIsCartOpen(false);
                  setIsAdminOpen(true);
                }}
                className="bg-[#2C2623] hover:bg-[#2C2623]/90 text-white font-serif font-extrabold text-[10px] py-2.5 rounded-lg transition shadow"
              >
                Ver Panel Admin
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LEGAL DOC MODALS BINDINGS */}
      {legalModalType && (
        <LegalDocModal
          isOpen={!!legalModalType}
          onClose={() => setLegalModalType(null)}
          type={legalModalType}
        />
      )}

    </div>
  );
}
