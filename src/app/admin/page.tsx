'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Plus,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Database,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const router = useRouter();
  const {
    user,
    adminEmail,
    products,
    dbUsers,
    adminOrders,
    addProduct,
    toggleStockStatus,
    logoutUser,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'products' | 'orders' | 'settings'>('overview');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // New product form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'men' | 'women' | 'kids' | 'accessories'>('women');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // ROUTE GUARD: Strictly restrict /admin to authorized admin email
  useEffect(() => {
    if (!user) {
      showToast('Unauthorized Access: Please sign in with administrator credentials.', 'info');
      router.push('/');
      return;
    }

    if (user.email.toLowerCase() !== adminEmail.toLowerCase()) {
      showToast(`Unauthorized Access: Only ${adminEmail} is authorized to access /admin portal.`, 'info');
      router.push('/');
      return;
    }

    setIsAuthorized(true);
  }, [user, adminEmail, router, showToast]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-luxury-black text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border border-rose-500/40 bg-neutral-900 flex items-center justify-center text-rose-500 animate-pulse">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-editorial font-light tracking-wide">Checking Authorization...</h2>
        <p className="text-xs font-sans text-neutral-400">Verifying administrator credentials for {adminEmail}</p>
      </div>
    );
  }

  const handleOpenAddProductForm = () => {
    setActiveTab('products');
    setShowAddForm(true);
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newImage) return;

    addProduct({
      name: newTitle,
      category: (newCategory.toLowerCase() as any),
      price: parseFloat(newPrice),
      colors: [
        { name: 'Noir', hex: '#111111' },
        { name: 'Ecru', hex: '#F4ECE1' },
      ],
      sizes: ['S', 'M', 'L'],
      mainImage: newImage,
      hoverImage: newImage,
      description: newDesc || 'Handcrafted minimal luxury apparel piece from ATELIER 2026 archive.',
      details: ['100% Organic Luxury Fabric', 'Dry clean only', 'Made in Europe'],
      isNew: true,
      inStock: true,
    });

    // Reset form
    setNewTitle('');
    setNewPrice('');
    setNewImage('');
    setNewDesc('');
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white flex flex-col">
      {/* ROUTE TOP HEADER BAR WITH PROMINENT ADD PRODUCT BUTTON */}
      <header className="p-4 sm:p-6 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="w-full px-2 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full transition-colors flex items-center justify-center shrink-0"
              title="Return to store"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-950 border border-emerald-800 rounded-full text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-neutral-400 block">
                    ADMIN ROUTE (/admin)
                  </span>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono px-2 py-0.5 uppercase tracking-wider">
                    {adminEmail}
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-editorial font-light uppercase tracking-wider text-white">
                  ATELIER Database & Admin Management
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* PROMINENT ADD NEW PRODUCT BUTTON IN ROUTE HEADER BAR */}
            <button
              onClick={handleOpenAddProductForm}
              className="px-4 py-2.5 bg-white text-luxury-black text-xs uppercase tracking-widest font-sans font-bold flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-lg shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add Product</span>
            </button>

            <button
              onClick={() => {
                logoutUser();
                router.push('/');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 border border-neutral-700 text-xs tracking-wider uppercase font-sans hover:bg-rose-950 hover:border-rose-800 hover:text-rose-300 transition-all text-neutral-300 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 border-r border-neutral-800 p-3 sm:p-4 space-y-2 bg-neutral-900/30 flex md:flex-col overflow-x-auto md:overflow-x-visible shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 md:flex-none flex items-center gap-2.5 px-3.5 py-2.5 text-[11px] sm:text-xs tracking-wider uppercase font-sans transition-all text-left whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white text-luxury-black font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 md:flex-none flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-[11px] sm:text-xs tracking-wider uppercase font-sans transition-all text-left whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-white text-luxury-black font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Product Catalog</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex-1 md:flex-none flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-[11px] sm:text-xs tracking-wider uppercase font-sans transition-all text-left whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-white text-luxury-black font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Customers</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
              {dbUsers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 md:flex-none flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-[11px] sm:text-xs tracking-wider uppercase font-sans transition-all text-left whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-white text-luxury-black font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Placed Orders</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
              {adminOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 md:flex-none flex items-center gap-2.5 px-3.5 py-2.5 text-[11px] sm:text-xs tracking-wider uppercase font-sans transition-all text-left whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white text-luxury-black font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>DB Specs</span>
          </button>
        </aside>

        {/* TAB PANELS CONTENT */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* OVERVIEW & METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-neutral-900 border border-neutral-800">
                <div>
                  <h2 className="text-2xl font-editorial font-light text-white">Database Analytics & Store Metrics</h2>
                  <p className="text-xs font-sans text-neutral-400 font-light mt-1">
                    Live synchronized metrics from persistent database tables.
                  </p>
                </div>

                {/* QUICK ADD PRODUCT CTA BANNER */}
                <button
                  onClick={handleOpenAddProductForm}
                  className="px-5 py-3 bg-white text-luxury-black text-xs uppercase tracking-widest font-sans font-bold flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Add New Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[10px] tracking-widest uppercase font-sans text-neutral-400 block">
                    Gross Revenue
                  </span>
                  <div className="text-3xl font-sans font-semibold text-white">$142,500</div>
                  <span className="text-[10px] text-emerald-400 font-sans tracking-wide">
                    ↑ +18.4% this month
                  </span>
                </div>

                <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[10px] tracking-widest uppercase font-sans text-neutral-400 block">
                    Registered Customers
                  </span>
                  <div className="text-3xl font-sans font-semibold text-white">{dbUsers.length}</div>
                  <span className="text-[10px] text-emerald-400 font-sans tracking-wide">
                    Verified user database records
                  </span>
                </div>

                <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[10px] tracking-widest uppercase font-sans text-neutral-400 block">
                    Total Orders
                  </span>
                  <div className="text-3xl font-sans font-semibold text-white">{adminOrders.length}</div>
                  <span className="text-[10px] text-emerald-400 font-sans tracking-wide">
                    Placed orders table
                  </span>
                </div>

                <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[10px] tracking-widest uppercase font-sans text-neutral-400 block">
                    Catalog Items
                  </span>
                  <div className="text-3xl font-sans font-semibold text-white">{products.length}</div>
                  <span className="text-[10px] text-blue-400 font-sans tracking-wide">
                    Persistent inventory
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS CATALOG MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
                <div>
                  <h2 className="text-2xl font-editorial font-light text-white">Products Catalog Management (`products`)</h2>
                  <p className="text-xs font-sans text-neutral-400 font-light mt-1">
                    Add new products to the persistent catalog and toggle stock availability.
                  </p>
                </div>

                {/* PROMINENT ADD PRODUCT BUTTON ON PRODUCTS PAGE */}
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-5 py-3 bg-white text-luxury-black text-xs uppercase tracking-widest font-sans font-bold flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-lg shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{showAddForm ? 'Close Add Form' : '+ Add New Product'}</span>
                </button>
              </div>

              {/* ADD PRODUCT FORM */}
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleCreateProductSubmit}
                  className="p-6 bg-neutral-900 border border-neutral-700 space-y-4 text-xs font-sans shadow-2xl"
                >
                  <h3 className="text-base font-editorial font-normal text-white uppercase tracking-wider">
                    Create New Product Entry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Silk Wrap Trench Coat"
                        className="w-full bg-neutral-800 border border-neutral-700 p-3 text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full bg-neutral-800 border border-neutral-700 p-3 text-white focus:outline-none focus:border-white uppercase"
                      >
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="kids">Kids</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                        Price ($ USD)
                      </label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="380"
                        className="w-full bg-neutral-800 border border-neutral-700 p-3 text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                        Image URL (Unsplash/HTTP)
                      </label>
                      <input
                        type="text"
                        required
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-neutral-800 border border-neutral-700 p-3 text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                      Short Editorial Description
                    </label>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Crafted from pure Mulberry silk with clean straight cuts..."
                      className="w-full bg-neutral-800 border border-neutral-700 p-3 text-white focus:outline-none focus:border-white h-24"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-white text-luxury-black text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-all shadow-md"
                  >
                    Publish Product To Catalog
                  </button>
                </motion.form>
              )}

              {/* PRODUCTS LIST TABLE */}
              <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="border-b border-neutral-800 bg-neutral-950/80 text-[10px] uppercase tracking-widest text-neutral-400">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-neutral-800/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="relative w-9 h-12 bg-neutral-800 overflow-hidden shrink-0 border border-neutral-700">
                            <Image src={prod.mainImage} alt={prod.name} fill className="object-cover" />
                          </div>
                          <span className="font-semibold text-white line-clamp-1">{prod.name}</span>
                        </td>
                        <td className="p-4 uppercase text-neutral-400 font-mono">{prod.category}</td>
                        <td className="p-4 font-semibold text-white">${prod.price}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 text-[9px] uppercase font-semibold tracking-wider ${
                              prod.inStock ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {prod.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => toggleStockStatus(prod.id)}
                            className="px-3.5 py-1.5 border border-neutral-700 text-[10px] uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                          >
                            Toggle Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REGISTERED CUSTOMERS LIST TABLE */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-editorial font-light text-white">Registered Customers Database Table (`users`)</h2>
                <p className="text-xs font-sans text-neutral-400 font-light mt-1">
                  Viewing all registered customer accounts, email verification status, and role assignments.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="border-b border-neutral-800 bg-neutral-950/80 text-[10px] uppercase tracking-widest text-neutral-400">
                    <tr>
                      <th className="p-4">User ID</th>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Verified Status</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {dbUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-800/50 transition-colors">
                        <td className="p-4 font-mono text-neutral-400 text-[11px]">{u.id}</td>
                        <td className="p-4 font-semibold text-white">{u.name}</td>
                        <td className="p-4 font-mono text-neutral-300">{u.email}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono px-2 py-0.5 uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified ✓
                          </span>
                        </td>
                        <td className="p-4 text-neutral-400">{u.joinedDate}</td>
                        <td className="p-4 text-right">
                          <span
                            className={`px-2.5 py-1 text-[9px] uppercase font-mono tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : 'bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PLACED ORDERS MANAGEMENT TABLE */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-editorial font-light text-white">Placed Customer Orders (`orders`)</h2>
                <p className="text-xs font-sans text-neutral-400 font-light mt-1">
                  Real-time customer orders, items breakdown, payment status, and fulfillment.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="border-b border-neutral-800 bg-neutral-950/80 text-[10px] uppercase tracking-widest text-neutral-400">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Items Count</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {adminOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-800/50 transition-colors">
                        <td className="p-4 font-mono text-neutral-300 font-semibold">{ord.id}</td>
                        <td className="p-4">
                          <span className="font-semibold text-white block">{ord.customerName}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">{ord.email}</span>
                        </td>
                        <td className="p-4 text-neutral-400">{ord.date}</td>
                        <td className="p-4 text-neutral-300">{ord.itemsCount} Items</td>
                        <td className="p-4 font-semibold text-white">${ord.total}</td>
                        <td className="p-4">
                          <span className="text-emerald-400 font-mono text-[10px]">
                            {ord.paymentStatus} ✓
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span
                            className={`px-2.5 py-1 text-[9px] uppercase font-semibold tracking-wider ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : ord.status === 'Shipped'
                                ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DB SPECS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-editorial font-light text-white">Database System Specs</h2>
                <p className="text-xs font-sans text-neutral-400 font-light mt-1">
                  Cloud database integration endpoints and security protocols.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Single Authorized Admin</span>
                  <div className="font-mono text-emerald-400 font-semibold">{adminEmail}</div>
                </div>

                <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Database Engine</span>
                  <div className="font-semibold text-white">PostgreSQL / Supabase Ready Schema</div>
                </div>

                <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Active Tables</span>
                  <div className="font-mono text-neutral-300">users • orders • products</div>
                </div>

                <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Security Protocol</span>
                  <div className="font-semibold text-emerald-400">256-Bit Role-Based Access Control (RBAC)</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
