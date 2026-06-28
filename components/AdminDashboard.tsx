"use client";

import React, { useState } from "react";
import { 
  ClipboardList, CheckCircle2, Truck, AlertCircle, Search, 
  Trash2, RefreshCw, Smartphone, TrendingUp, DollarSign, Archive, Mail, Eye,
  Heart, Plus, Edit, Star, Package, X, Lock, Check
} from "lucide-react";
import { Order, NotificationItem, Product } from "../lib/types";
import Image from "next/image";

interface AdminDashboardProps {
  orders: Order[];
  notifications: NotificationItem[];
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void;
  onDeleteOrder: (orderId: string) => void;
  onClearNotifications: () => void;
  onTriggerNotification: (message: string, channel: "WhatsApp" | "Email" | "Sistema") => void;
  productLikes?: Record<string, number>;
  // Dynamic catalog management props
  products: Product[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (sku: string) => void;
  adminPassword?: string;
  onUpdateAdminPassword?: (newPassword: string) => void;
}

export default function AdminDashboard({
  orders,
  notifications,
  onUpdateOrderStatus,
  onDeleteOrder,
  onClearNotifications,
  onTriggerNotification,
  productLikes = {},
  products = [],
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  adminPassword = "bella123",
  onUpdateAdminPassword
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"pedidos" | "productos">("pedidos");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const [customNotificationText, setCustomNotificationText] = useState("");
  const [chosenChannel, setChosenChannel] = useState<"WhatsApp" | "Email" | "Sistema">("WhatsApp");

  // Admin password update states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [passwordChangedSuccess, setPasswordChangedSuccess] = useState(false);

  // Product Catalog management states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [prodSearch, setProdSearch] = useState("");
  const [prodCategoryFilter, setProdCategoryFilter] = useState("todos");

  // Product form fields
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(1000);
  const [category, setCategory] = useState<"vestidos" | "calzados" | "fragancias" | "accesorios">("vestidos");
  const [imageInput, setImageInput] = useState("");
  const [sizesInput, setSizesInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");
  const [stock, setStock] = useState(10);
  const [featured, setFeatured] = useState(false);
  const [formError, setFormError] = useState("");

  // Orders Calculations
  const totalReceivedSales = orders
    .filter(o => o.status !== "Cancelado")
    .reduce((acc, o) => acc + o.partialAmountPaid, 0);

  const totalPendingBalance = orders
    .filter(o => o.status !== "Cancelado")
    .reduce((acc, o) => acc + (o.total - o.partialAmountPaid), 0);

  const activeOrdersCount = orders.filter(o => o.status !== "Entregado" && o.status !== "Cancelado").length;

  // Filter & Search Orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "Todos" || order.status === filterStatus;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Filter & Search Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = prodCategoryFilter === "todos" || p.category === prodCategoryFilter;
    const matchesSearch = 
      p.sku.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(prodSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: Order["status"]) => {
    const styles = {
      Pendiente: "bg-amber-100 text-amber-800 border-amber-200",
      Preparado: "bg-indigo-100 text-indigo-800 border-indigo-200",
      "En camino": "bg-blue-100 text-blue-800 border-blue-200",
      Entregado: "bg-green-100 text-green-800 border-green-200",
      Cancelado: "bg-rose-100 text-rose-800 border-rose-200"
    };

    const icons = {
      Pendiente: <AlertCircle className="w-3 h-3 text-amber-700" />,
      Preparado: <Archive className="w-3 h-3 text-indigo-700" />,
      "En camino": <Truck className="w-3 h-3 text-blue-700" />,
      Entregado: <CheckCircle2 className="w-3 h-3 text-green-700" />,
      Cancelado: <AlertCircle className="w-3 h-3 text-rose-700" />
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold border ${styles[status]}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  const handleSendCustomNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNotificationText.trim()) return;
    onTriggerNotification(customNotificationText, chosenChannel);
    setCustomNotificationText("");
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsAddingNew(false);
    setSku(prod.sku);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price);
    setCategory(prod.category);
    setImageInput(prod.images[0] || "");
    setSizesInput(prod.sizes ? prod.sizes.join(", ") : "");
    setColorsInput(prod.colors ? prod.colors.join(", ") : "");
    setStock(prod.stock);
    setFeatured(prod.featured || false);
    setFormError("");
  };

  const startAddNewProduct = () => {
    setIsAddingNew(true);
    setEditingProduct(null);
    setSku("PROD-" + Math.floor(1000 + Math.random() * 9000));
    setName("");
    setDescription("");
    setPrice(1500);
    setCategory("vestidos");
    setImageInput("https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80");
    setSizesInput("S, M, L");
    setColorsInput("Negro, Blanco, Rosa");
    setStock(10);
    setFeatured(false);
    setFormError("");
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("O nome do produto é obrigatório.");
      return;
    }
    if (!sku.trim()) {
      setFormError("O SKU é obrigatório.");
      return;
    }
    if (price <= 0) {
      setFormError("O preço do produto deve ser maior que 0.");
      return;
    }
    if (stock < 0) {
      setFormError("O stock do produto não pode ser negativo.");
      return;
    }

    const sizesArr = sizesInput ? sizesInput.split(",").map(s => s.trim()).filter(Boolean) : undefined;
    const colorsArr = colorsInput ? colorsInput.split(",").map(c => c.trim()).filter(Boolean) : undefined;

    if (isAddingNew && products.some(p => p.sku.toLowerCase() === sku.toLowerCase())) {
      setFormError("Já existe outro produto registrado com este SKU.");
      return;
    }

    const savedProduct: Product = {
      sku,
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      images: [imageInput.trim() || "/placeholder.png"],
      sizes: sizesArr,
      colors: colorsArr,
      stock: Number(stock),
      featured
    };

    if (isAddingNew) {
      onAddProduct(savedProduct);
      setIsAddingNew(false);
    } else {
      onEditProduct(savedProduct);
      setEditingProduct(null);
    }
    setFormError("");
  };

  return (
    <div id="admin-dashboard" className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8 animate-fadeIn font-sans">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-gray-100 pb-5 gap-3">
        <div>
          <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">Painel Administrativo Bella Dreams</span>
          <h2 className="text-2xl font-serif text-[#2C2623] mt-0.5">Controle & Gerenciamento da Boutique</h2>
        </div>
        
        {/* Navigation Tabs & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto select-none">
          <div className="flex bg-gray-100/85 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("pedidos")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "pedidos"
                  ? "bg-[#2C2623] text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Pedidos ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("productos")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "productos"
                  ? "bg-[#2C2623] text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Produtos ({products.length})
            </button>
          </div>

          <button
            onClick={() => {
              setIsChangingPassword(true);
              setNewPasswordInput("");
              setPasswordChangedSuccess(false);
              setPasswordChangeError("");
            }}
            className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-250 hover:border-[#D4AF37] text-gray-500 hover:text-[#2C2623] transition-all bg-white cursor-pointer flex items-center gap-1.5 shadow-2xs font-sans"
            title="Alterar contrassenha do admin"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Alterar Senha</span>
          </button>
        </div>
      </div>

      {activeTab === "pedidos" ? (
        <>
          {/* KPI Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-[#FAF6ED] p-5 rounded-2xl border border-[#D4AF37]/15 flex items-center gap-4">
              <div className="p-3 bg-[#D4AF37]/10 rounded-xl text-[#D4AF37]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">Ingressos Recebidos</span>
                <span className="text-lg font-serif font-bold text-[#2C2623]">RD$ {totalReceivedSales.toLocaleString()} DOP</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">Por adiantamentos efetuados</span>
              </div>
            </div>

            <div className="bg-[#FAF6ED] p-5 rounded-2xl border border-[#D4AF37]/15 flex items-center gap-4">
              <div className="p-3 bg-[#2C2623]/5 rounded-xl text-[#2C2623]">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">Pendente de Cobrança</span>
                <span className="text-lg font-serif font-bold text-[#D4AF37]">RD$ {totalPendingBalance.toLocaleString()} DOP</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">Contra entrega ou envios</span>
              </div>
            </div>

            <div className="bg-[#FAF6ED] p-5 rounded-2xl border border-[#D4AF37]/15 flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-700">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">Pedidos Ativos</span>
                <span className="text-lg font-serif font-bold text-[#2C2623]">{activeOrdersCount} pendentes</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">Exclui cancelados/entregues</span>
              </div>
            </div>

            <div className="bg-[#FAF6ED] p-5 rounded-2xl border border-[#D4AF37]/15 flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-700">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider block">Alertas Enviadas</span>
                <span className="text-lg font-serif font-bold text-[#2C2623]">{notifications.length} transmissões</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">Log integrado de disparos</span>
              </div>
            </div>

          </div>

          {/* Main Grid: Orders & Logs split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column (Orders List): Span 2 */}
            <div className="lg:col-span-2 space-y-5 bg-white border border-gray-150 rounded-2xl p-4 md:p-6 shadow-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="font-serif font-bold text-[#2C2623] text-sm flex items-center gap-2">
                  📂 Histórico de Pedidos Efetuados ({filteredOrders.length})
                </h3>
                
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrar cliente, id, fone..."
                    className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs w-full sm:w-56 focus:outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Quick status filters */}
              <div className="flex flex-wrap gap-1 bg-gray-50 p-1 rounded-xl">
                {["Todos", "Pendiente", "Preparado", "En camino", "Entregado", "Cancelado"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider select-none transition cursor-pointer ${
                      filterStatus === status
                        ? "bg-[#2C2623] text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {status === "Todos" ? "Todos" : status}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  Nenhum pedido atende aos filtros selecionados.
                </div>
              ) : (
                <div className="overflow-x-auto text-nowrap select-none">
                  <table className="w-full text-left text-xs text-gray-500">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                        <th className="py-3 px-2">Pedido</th>
                        <th className="py-3 px-2">Cliente</th>
                        <th className="py-3 px-2">Logística</th>
                        <th className="py-3 px-2">Valor</th>
                        <th className="py-3 px-2">Abono</th>
                        <th className="py-3 px-2">Estatus</th>
                        <th className="py-3 px-2 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((order) => (
                        <tr 
                          key={order.id} 
                          className={`hover:bg-[#FAF6ED]/30 cursor-pointer ${selectedOrder?.id === order.id ? "bg-[#FAF6ED]/60" : ""}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="py-3 px-2 font-mono font-bold text-[#D4AF37]">#{order.id}</td>
                          <td className="py-3 px-2">
                            <div className="font-semibold text-gray-800">{order.clientName}</div>
                            <div className="text-[9px] text-gray-400 font-mono">{order.clientPhone}</div>
                          </td>
                          <td className="py-3 px-2 font-medium capitalize text-gray-600">
                            {order.deliveryMethod === "express" ? "🏍️ Express" : order.deliveryMethod === "standard" ? "📦 Padrão" : "🏬 Retirada"}
                          </td>
                          <td className="py-3 px-2 font-bold text-gray-800 font-mono">
                            RD$ {order.total.toLocaleString()}
                          </td>
                          <td className="py-3 px-2">
                            {order.paymentSplit === "partial" ? (
                              <div className="flex flex-col leading-tight">
                                <span className="text-[9px] font-bold text-indigo-700">Parcial {order.partialPercentage}%</span>
                                <span className="text-[8px] text-gray-400">Paga: RD$ {order.partialAmountPaid}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-green-700">100% Pago</span>
                            )}
                          </td>
                          <td className="py-3 px-2">{getStatusBadge(order.status)}</td>
                          <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="p-1 text-gray-400 hover:text-[#2C2623] rounded-md hover:bg-gray-100 cursor-pointer transition"
                                title="Ver detalhes"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteOrder(order.id)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100 cursor-pointer transition"
                                title="Descartar histórico"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

            {/* Right Column: Order Detail & Dispatch Management */}
            <div className="space-y-6">
              
              {selectedOrder ? (
                <div className="bg-[#FAF6ED]/70 border border-[#D4AF37]/25 p-5 rounded-2xl space-y-4 animate-slideUp">
                  
                  <div className="flex justify-between items-start border-b border-gray-250 pb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 block">Detalhamento do Pedido</span>
                      <span className="font-serif font-bold text-sm text-[#2C2623] font-mono">#{selectedOrder.id}</span>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-xs text-gray-400 hover:text-gray-600 underline font-semibold cursor-pointer text-[10px]"
                    >
                      Recolher
                    </button>
                  </div>

                  {/* Items summarized */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest block">Peças Solicitadas</span>
                    <div className="divide-y divide-gray-200 max-h-40 overflow-y-auto pr-1">
                      {selectedOrder.items.map((it, i) => (
                        <div key={i} className="py-1.5 flex justify-between text-[11px] font-sans">
                          <div>
                            <div className="font-semibold text-gray-800">{it.productName}</div>
                            {(it.color || it.size) && (
                              <div className="text-[9px] text-[#D4AF37] mt-0.5">
                                {it.size && `Tamanho: ${it.size}`} {it.color && `| Filtro: ${it.color}`}
                              </div>
                            )}
                            <div className="text-[9px] text-gray-400 font-mono">SKU: {it.sku}</div>
                          </div>
                          <div className="text-right font-mono self-start ml-2 shrink-0 text-gray-700">
                            <span className="text-gray-400 text-[10px]">{it.quantity}x</span> RD$ {it.price.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Data */}
                  <div className="bg-white p-3 rounded-xl border border-[#D4AF37]/10 space-y-1.5 text-[11px]">
                    <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider">Endereço de Envio</span>
                    <div className="text-gray-700 leading-tight">
                      <div className="font-semibold text-[#2C2623]">{selectedOrder.clientName}</div>
                      <div className="font-mono mt-0.5 select-all">{selectedOrder.clientPhone}</div>
                      <p className="mt-1 bg-gray-50 p-2 rounded text-[10px] border border-gray-500/10 text-gray-500 max-h-16 overflow-y-auto whitespace-pre-wrap select-all">
                        {selectedOrder.deliveryAddress}
                      </p>
                    </div>
                  </div>

                  {/* Controls to shift status */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider block">Alterar Status Logs em Tempo Real</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(["Pendiente", "Preparado", "En camino", "Entregado", "Cancelado"] as Order["status"][]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(selectedOrder.id, st);
                            setSelectedOrder({ ...selectedOrder, status: st });
                          }}
                          className={`py-1.5 px-1.5 rounded-lg text-[9px] font-bold text-center border transition select-none cursor-pointer ${
                            selectedOrder.status === st
                              ? "bg-[#2C2623] text-white border-[#2C2623] shadow-xs"
                              : "bg-white text-gray-650 border-gray-200 hover:bg-gray-105"
                          }`}
                        >
                          {st === "Pendiente" ? "Pendente" : st === "Preparado" ? "Preparado" : st === "En camino" ? "Em trânsito" : st === "Entregado" ? "Entregue" : "Cancelado"}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-gray-50 border border-dashed border-gray-250 p-6 rounded-2xl text-center text-xs text-gray-400 h-64 flex flex-col items-center justify-center gap-1.5">
                  <ClipboardList className="w-8 h-8 text-gray-300" />
                  <span>Escolha um pedido da lista para atualizar embalagem, logística ou status de entrega live.</span>
                </div>
              )}

              {/* Quick manual triggers (Client communication simulations) */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#2C2623] flex items-center gap-1.5">
                  📣 Disparador de Alertas (Notificadora)
                </h4>
                
                <form onSubmit={handleSendCustomNotification} className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-1">Conteúdo do Alerta</label>
                    <textarea
                      rows={2}
                      value={customNotificationText}
                      onChange={(e) => setCustomNotificationText(e.target.value)}
                      placeholder="Ex: [Bella Dreams] Seu vestido está pronto na boutique!"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37] font-sans"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setChosenChannel("WhatsApp")}
                        className={`px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider rounded-md border cursor-pointer ${
                          chosenChannel === "WhatsApp" ? "bg-green-100 text-green-800 border-green-200" : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => setChosenChannel("Email")}
                        className={`px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider rounded-md border cursor-pointer ${
                          chosenChannel === "Email" ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        Email
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#2C2623] hover:bg-[#2C2623]/90 text-white font-serif font-bold text-[10px] px-4 py-1.5 rounded-lg flex items-center gap-1 transition shadow-xs cursor-pointer"
                    >
                      Disparar live
                    </button>
                  </div>
                </form>
              </div>

            </div>

          </div>

          {/* Analytics & Communication Split Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8Tier">
            
            {/* Left Col: Broadcaster Notification History log */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h4 className="font-serif font-semibold text-xs text-[#2C2623] flex items-center gap-2">
                  📧 Histórico de Comunicações Digitais ({notifications.length})
                </h4>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[10px] text-gray-400 hover:text-red-650 flex items-center gap-0.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Limpar Bitácora
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="text-[10.5px] text-gray-400 italic text-center py-10 animate-fade">
                  Nenhuma mensagem eletrônica disparada no navegador nesta sessão.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className="p-3 bg-gray-50 rounded-xl flex items-start gap-3 border border-gray-100 text-[10px] font-sans"
                    >
                      <div className={`p-1.5 rounded-md shrink-0 ${
                        notif.channel === "WhatsApp" ? "bg-green-100 text-green-700" : notif.channel === "Email" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-605"
                      }`}>
                        {notif.channel === "WhatsApp" ? <Smartphone className="w-3.5 h-3.5" /> : notif.channel === "Email" ? <Mail className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      </div>
                      <div className="space-y-0.5 flex-1 select-all">
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-gray-800">{notif.channel === "WhatsApp" ? "💬 WhatsApp API Gateway" : "📧 SMTP Mail Service"}</span>
                          <span className="text-[9px] text-gray-400 font-mono font-normal">{notif.timestamp}</span>
                        </div>
                        <p className="text-gray-500 text-[10.5px] leading-relaxed break-words whitespace-pre-wrap">{notif.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: 💖 Product Likes Report */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h4 className="font-serif font-semibold text-xs text-[#2C2623] flex items-center gap-2">
                  💖 Relatório de Likes e Desejos do Cliente
                </h4>
                <span className="text-[9px] uppercase font-black text-[#D4AF37] tracking-wider font-mono">Feedback ao Vivo</span>
              </div>

              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {products.slice(0, 10).map((prod) => {
                  const count = productLikes[prod.sku] || 0;
                  const maxLikes = Math.max(...Object.values(productLikes), 1);
                  const pct = Math.min(100, (count / maxLikes) * 100);
                  
                  return (
                    <div key={prod.sku} className="flex items-center gap-3 text-xs">
                      <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-50 border shrink-0">
                        <Image 
                          src={prod.images[0]} 
                          alt={prod.name} 
                          fill
                          sizes="40px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-gray-800 font-sans truncate pr-2 font-semibold" title={prod.name}>
                            {prod.name}
                          </span>
                          <div className="flex items-center gap-1 shrink-0 font-bold text-rose-600 font-mono text-[9px] bg-rose-50 px-2 py-0.5 rounded-full select-none">
                            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                            <span>{count}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1 select-none">
                          <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[8px] text-gray-400 font-mono uppercase tracking-wider shrink-0">
                            {prod.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sum Report Footer */}
              <div className="pt-2.5 border-t border-gray-100 flex justify-between items-center text-[10.5px] text-gray-500 font-sans font-medium">
                <span>Engajamento do Cliente</span>
                <span className="font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-0.5 rounded-md text-[10px] font-sans">
                  💖 {Object.values(productLikes).reduce((sum, itemVal) => sum + itemVal, 0)} Reações de Amore
                </span>
              </div>
            </div>

          </div>
        </>
      ) : (
        /* PRODUCT CATALOG MANAGEMENT VIEW */
        <div className="space-y-6 animate-slideUp">
          
          {/* Action Header bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-gray-150 p-4 rounded-2xl gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-serif font-bold text-[#2C2623] text-sm flex items-center gap-1.5">
                💎 Catálogo Geral de Produtos ({filteredProducts.length})
              </h3>
              
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
                {["todos", "vestidos", "fragancias", "calzados", "accesorios"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProdCategoryFilter(cat)}
                    className={`px-3 py-1 rounded text-[9px] uppercase font-bold tracking-wider cursor-pointer ${
                      prodCategoryFilter === cat ? "bg-[#2C2623] text-white" : "text-gray-500 hover:text-[#2C2623]"
                    }`}
                  >
                    {cat === "todos" ? "Todos" : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                  placeholder="Pesquisar por SKU, nome..."
                  className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs w-full sm:w-48 focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              {!isAddingNew && !editingProduct && (
                <button
                  onClick={startAddNewProduct}
                  className="bg-[#2C2623] hover:bg-[#2C2623]/90 text-[#D4AF37] font-serif font-bold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer select-none"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Incluir Produto
                </button>
              )}
            </div>
          </div>

          {/* Create or Edit dynamic forms layout wrapper */}
          {(isAddingNew || editingProduct) && (
            <div className="bg-[#FAF6ED]/70 border border-[#D4AF37]/30 p-5 rounded-3xl grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slideDown">
              
              {/* Form fields col */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-3">
                  <h4 className="font-serif font-bold text-sm text-[#2C2623]">
                    {isAddingNew ? "✨ Cadastrar Novo Produto Premium" : `✏️ Editar Produto: ${editingProduct?.sku}`}
                  </h4>
                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingProduct(null);
                      setFormError("");
                    }}
                    className="p-1 rounded-full bg-gray-200/50 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold flex items-center gap-1.5 border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProductForm} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* SKU */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider">SKU Único (Identificador)</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      disabled={!!editingProduct}
                      placeholder="Ex: VEST-99"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37] font-mono uppercase bg-white disabled:bg-gray-100 disabled:text-gray-450"
                    />
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Nome do Produto</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Vestido de Crepe Elegance"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37] font-sans"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Valor / Preço (DOP)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold font-mono">RD$</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                        placeholder="3500"
                        className="pl-12 pr-3 py-2.5 border border-gray-200 rounded-lg text-xs w-full focus:outline-hidden focus:border-[#D4AF37] font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Quantidade em Stock (Disponibilidade)</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Math.max(0, Number(e.target.value)))}
                      placeholder="10"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37] font-mono"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider block">Categoria</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37] bg-white"
                    >
                      <option value="vestidos">Vestidos 👗</option>
                      <option value="calzados">Calçados 👠</option>
                      <option value="fragancias">Fragrâncias 💎</option>
                      <option value="accesorios">Acessórios 💍</option>
                    </select>
                  </div>

                  {/* Featured */}
                  <div className="space-y-1 flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="rounded accent-amber-500 w-4 h-4"
                      />
                      <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        Produto em Destaque
                      </span>
                    </label>
                  </div>

                  {/* Image link */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider">URL da Imagem de Alta Qualidade (Unsplash, etc.)</label>
                    <input
                      type="text"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37] font-mono"
                    />
                  </div>

                  {/* Sizes (sizes tags) */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Variantes de Tamanho (Separados por vírgula)</label>
                    <input
                      type="text"
                      value={sizesInput}
                      onChange={(e) => setSizesInput(e.target.value)}
                      placeholder="S, M, L, XL"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Colors */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Variantes de Cor (Separados por vírgula)</label>
                    <input
                      type="text"
                      value={colorsInput}
                      onChange={(e) => setColorsInput(e.target.value)}
                      placeholder="Marfim, Esmeralda, Preto"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Descrição das Roupas ou Fragrâncias</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descrição detalhada sobre estilo, caimento, tecidos, ou notas de topo da fragrância elegante..."
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Save/Cancel actions row */}
                  <div className="sm:col-span-2 pt-2 border-t border-gray-205 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNew(false);
                        setEditingProduct(null);
                        setFormError("");
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-500 hover:bg-gray-100 rounded-xl text-xs font-serif uppercase tracking-widest transition cursor-pointer select-none"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#2C2623] hover:bg-[#2C2623]/95 text-white hover:text-[#D4AF37] font-serif font-bold rounded-xl text-xs uppercase tracking-widest transition cursor-pointer select-none"
                    >
                      Salvar Produto
                    </button>
                  </div>

                </form>
              </div>

              {/* Live Preview right col */}
              <div className="bg-white border border-[#D4AF37]/20 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider border-b pb-2 block">
                  👁️ Pré-visualização na Loja virtual
                </span>

                {/* Simulated Grid Item card */}
                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-xs flex flex-col bg-[#FAF9F5]/40 select-none">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {/* Image block */}
                    {imageInput.trim() ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={imageInput.trim()} 
                        alt="Preview" 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as any).src = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-400 text-xs">
                        Sem Imagem
                      </div>
                    )}
                    
                    {/* Featured star badge */}
                    {featured && (
                      <span className="absolute top-2 left-2 bg-[#2C2623] text-[#D4AF37] text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Star className="w-2 h-2 fill-current" /> Exclusividade
                      </span>
                    )}

                    {/* Stock alert badge */}
                    {stock <= 5 && (
                      <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[8px] uppercase font-black px-2 py-0.5 rounded-md tracking-wider">
                        ¡Solo {stock} restantes!
                      </span>
                    )}
                  </div>

                  <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[8px] text-gray-400 font-mono uppercase">
                        <span>SKU: {sku || "PENDENTE"}</span>
                        <span>{category}</span>
                      </div>
                      
                      <h4 className="font-serif font-bold text-gray-800 text-xs truncate mt-0.5">
                        {name || "Vestido Sem Nome"}
                      </h4>
                      
                      <p className="text-[10px] text-gray-400 line-clamp-1 italic leading-tight">
                        {description || "Sem descrição adicionada..."}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[9px] text-gray-450 font-sans">Investimento:</span>
                      <span className="text-xs font-serif font-extrabold text-[#2C2623] font-mono">
                        RD$ {price.toLocaleString()} <span className="text-[8px] font-sans font-light text-gray-400">DOP</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[9.5px] text-gray-400 italic text-center leading-normal">
                  Este card demonstra a renderização automática estética do seu produto no catálogo Bella Dreams.
                </div>
              </div>

            </div>
          )}

          {/* Catalog grid database */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400 text-sm select-none">
              Nenhum produto cadastrado corresponde aos critérios de pesquisa e filtros do catálogo.
            </div>
          ) : (
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto text-nowrap">
                <table className="w-full text-left text-xs text-gray-500">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                      <th className="py-3 px-4">Artigo</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4">Inversão (Valor)</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Variações</th>
                      <th className="py-3 px-4">Exclusivo</th>
                      <th className="py-3 px-4 text-right">Ações de Gestão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.sku} className="hover:bg-gray-50/50">
                        
                        {/* Article photo + name */}
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-100 border shrink-0">
                            <Image 
                              src={p.images[0]} 
                              alt={p.name} 
                              fill
                              sizes="40px"
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 font-sans block max-w-xs truncate" title={p.name}>
                              {p.name}
                            </span>
                            <span className="text-[10px] text-gray-400 block max-w-xs truncate font-serif italic">
                              {p.description}
                            </span>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="py-3 px-4 font-mono font-bold text-gray-650">{p.sku}</td>

                        {/* Category */}
                        <td className="py-3 px-4 capitalize font-medium text-gray-550">
                          {p.category === "vestidos" ? "👗 Vestidos" : p.category === "calzados" ? "👠 Calçados" : p.category === "fragancias" ? "💎 Fragrâncias" : "💍 Acessórios"}
                        </td>

                        {/* Investment Value */}
                        <td className="py-3 px-4 font-mono font-bold text-gray-800 text-sm">
                          RD$ {p.price.toLocaleString()} DOP
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4 font-mono">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.stock <= 0 
                              ? "bg-red-50 text-red-700 border-red-150" 
                              : p.stock <= 5 
                              ? "bg-amber-50 text-amber-700 border-amber-150" 
                              : "bg-green-50 text-green-700 border-green-150"
                          }`}>
                            {p.stock} peças
                          </span>
                        </td>

                        {/* Sizes & Colors tags */}
                        <td className="py-3 px-4 text-[10px] space-y-0.5">
                          {p.sizes && p.sizes.length > 0 && (
                            <div className="text-gray-500 font-sans leading-none">
                              Tamanhos: <span className="font-bold text-gray-700 font-mono text-[9px] bg-gray-100 px-1 py-0.2 rounded">{p.sizes.join(", ")}</span>
                            </div>
                          )}
                          {p.colors && p.colors.length > 0 && (
                            <div className="text-gray-500 font-sans leading-none">
                              Filtros: <span className="font-bold text-gray-700 font-mono text-[9px] bg-gray-100 px-1 py-0.2 rounded">{p.colors.join(", ")}</span>
                            </div>
                          )}
                          {!p.sizes && !p.colors && (
                            <span className="text-gray-400 italic">Padrão universal</span>
                          )}
                        </td>

                        {/* Exclusivo featured star */}
                        <td className="py-3 px-4">
                          {p.featured ? (
                            <span className="flex items-center gap-1 font-bold text-[#D4AF37] text-[10px] uppercase font-serif tracking-wider bg-amber-50/50 border border-amber-150 px-2.5 py-0.5 rounded-md w-max">
                              <Star className="w-3 h-3 fill-current" /> Sim
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => startEditProduct(p)}
                              className="p-1 px-2.5 text-xs text-indigo-600 hover:bg-indigo-50 border border-indigo-150 rounded-lg cursor-pointer transition flex items-center gap-1 font-medium font-serif uppercase tracking-wider"
                              title="Editar valor e detalhes"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Deseja realmente excluir o produto "${p.name}" (SKU: ${p.sku})?`)) {
                                  onDeleteProduct(p.sku);
                                }
                              }}
                              className="p-1 px-2.5 text-xs text-red-650 hover:bg-red-50 border border-red-150 rounded-lg cursor-pointer transition flex items-center gap-1 font-semibold font-serif uppercase tracking-wider"
                              title="Remover produto do catálogo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Excluir
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Password Change Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#D4AF37]/20 rounded-3xl p-6 max-w-sm w-full shadow-xl animate-scaleIn space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FAF6ED] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-sm text-[#2C2623]">Alterar Senha Admin</h4>
                  <p className="text-[9px] text-[#D4AF37] font-sans uppercase font-bold tracking-wider">Segurança do Painel</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChangingPassword(false)}
                className="text-gray-400 hover:text-[#2C2623] p-1 rounded-lg cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordChangedSuccess ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-200">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-green-800">Sua contrassenha foi atualizada com sucesso!</p>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="w-full bg-[#2C2623] hover:bg-[#2C2623]/95 text-[#D4AF37] font-serif font-bold text-xs uppercase tracking-widest py-2.5 rounded-xl transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newPasswordInput.trim().length < 4) {
                    setPasswordChangeError("A senha precisa ter pelo menos 4 caracteres.");
                    return;
                  }
                  if (onUpdateAdminPassword) {
                    onUpdateAdminPassword(newPasswordInput.trim());
                  }
                  setPasswordChangedSuccess(true);
                  setPasswordChangeError("");
                }}
                className="space-y-3.5"
              >
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-gray-500 tracking-wider block">Nova Contrassenha</label>
                  <input
                    type="text"
                    value={newPasswordInput}
                    onChange={(e) => {
                      setNewPasswordInput(e.target.value);
                      if (passwordChangeError) setPasswordChangeError("");
                    }}
                    placeholder="Mínimo 4 caracteres..."
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#D4AF37]"
                    required
                  />
                  {passwordChangeError && (
                    <p className="text-[10px] text-rose-600 font-medium">{passwordChangeError}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs py-2.5 rounded-xl border border-gray-200 transition font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#2C2623] hover:bg-[#2C2623]/95 text-[#D4AF37] text-xs py-2.5 rounded-xl transition font-serif font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
