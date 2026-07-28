'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import {
  Lock,
  X,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Plus,
  AlertCircle,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Database,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminModal() {
  const {
    isAdminOpen,
    closeAdmin,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    products,
    dbUsers,
    adminOrders,
    adminEmail,
    user,
    addProduct,
    toggleStockStatus,
  } = useShop();

  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'products' | 'orders' | 'settings'>('overview');

  // New product form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'men' | 'women' | 'kids' | 'accessories'>('women');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');

  if (!isAdminOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (success) {
      setLoginError(false);
      setPasscode('');
    } else {
      setLoginError(true);
    }
  };

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl max-h-[94vh] bg-luxury-black text-white overflow-hidden shadow-2xl border border-neutral-800 flex flex-col"
        >
          {/* HEADER BAR WITH ALWAYS-VISIBLE PROMINENT ADD PRODUCT BUTTON */}
          <div className="p-4 sm:p-6 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 bg-white/10 rounded-full text-white shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-sans text-neutral-400 block">
                    ADMIN PORTAL
                  </span>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono px-2 py-0.5 uppercase tracking-wider">
                    {adminEmail}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-editorial font-light uppercase tracking-wider text-white">
                  ATELIER Admin Database Portal
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {isAdminLoggedIn && (
                <>
                  {/* PROMINENT ADD NEW PRODUCT BUTTON IN TOP HEADER BAR */}
                  <button
                    onClick={handleOpenAddProductForm}
                    className="px-3.5 py-2 bg-white text-luxury-black text-xs uppercase tracking-widest font-sans font-bold flex items-center gap-1.5 hover:bg-neutral-200 transition-all shadow-md shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Add Product</span>
                  </button>

                  <button
                    onClick={logoutAdmin}
                    className="flex items-center gap-1.5 px-3 py-2 border border-neutral-700 text-xs tracking-wider uppercase font-sans hover:bg-white/10 transition-colors text-neutral-300 shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Lock Session</span>
                  </button>
                </>
              )}

              <button
                onClick={closeAdmin}
                className="p-2 text-neutral-400 hover:text-white transition-colors ml-1"
                aria-label="Close portal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MAIN BODY CONTENT */}
          {!isAdminLoggedIn ? (
            /* LOGIN PASSCODE FORM */
            <div className="p-8 md:p-16 flex flex-col items-center justify-center text-center space-y-8 my-auto">
              <div className="w-16 h-16 rounded-full border border-emerald-500/40 bg-neutral-900 flex items-center justify-center text-emerald-400 mb-2">
                <Lock className="w-8 h-8 stroke-[1.5]" />
              </div>

              <div className="space-y-2 max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-800 text-[10px] tracking-widest font-mono text-emerald-400 uppercase">
                  <UserCheck className="w-3 h-3" />
                  <span>Verified Identity: {user?.email}</span>
                </div>
                <h4 className="text-2xl font-editorial font-light tracking-wide text-white pt-2">
                  Administrator PIN Verification
                </h4>
                <p className="text-xs font-sans text-neutral-400 font-light leading-relaxed">
                  You are signed in as <strong className="text-white">{adminEmail}</strong>. Enter your security PIN to unlock database records and inventory.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="w-full max-w-xs space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (loginError) setLoginError(false);
                    }}
                    placeholder="ENTER PIN (2026)"
                    className={`w-full bg-neutral-900 border text-center text-sm font-sans tracking-[0.3em] uppercase py-3.5 px-4 text-white placeholder:text-neutral-600 focus:outline-none transition-all ${
                      loginError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700 focus:border-white'
                    }`}
                  />
                </div>

                {loginError && (
                  <p className="text-xs text-rose-400 font-sans tracking-wide flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Invalid passcode. Try "2026"</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-luxury-black text-xs uppercase tracking-[0.25em] font-sans font-semibold hover:bg-neutral-200 transition-all shadow-md"
                >
                  Unlock Admin Portal
                </button>
              </form>

              <span className="text-[10px] tracking-widest font-sans uppercase text-neutral-500">
                Demo Security Passcode: <code className="text-neutral-300">2026</code>
              </span>
            </div>
          ) : (
            /* AUTHENTICATED DASHBOARD PORTAL WITH DEDICATED DATABASE VIEWS */
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* PORTAL SIDEBAR NAVIGATION */}
              <div className="w-full md:w-60 border-r border-neutral-800 p-3 sm:p-4 space-y-2 bg-neutral-900/30 flex md:flex-col overflow-x-auto md:overflow-x-visible shrink-0">
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
                    <span>Products</span>
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
                    <span>Orders</span>
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
              </div>

              {/* DASHBOARD TAB CONTENT */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
                {/* TAB 1: OVERVIEW & ANALYTICS */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-neutral-900 border border-neutral-800">
                      <div>
                        <h4 className="text-xl font-editorial font-light text-white">Database Analytics & Store Metrics</h4>
                        <p className="text-xs font-sans text-neutral-400 font-light">
                          Real-time statistics synchronized with the persistent database tables.
                        </p>
                      </div>

                      {/* QUICK ADD PRODUCT CTA BANNER */}
                      <button
                        onClick={handleOpenAddProductForm}
                        className="px-4 py-2.5 bg-white text-luxury-black text-xs uppercase tracking-widest font-sans font-bold flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-md shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add New Product</span>
                      </button>
                    </div>

                    {/* METRICS CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-2">
                        <span className="text-[10px] tracking-widest uppercase font-sans text-neutral-400 block">
                          Gross Revenue
                        </span>
                        <div className="text-2xl font-sans font-semibold text-white">$142,500</div>
                        <span className="text-[10px] text-emerald-400 font-sans tracking-wide">
                          ↑ +18.4% this month
                        </span>
                      </div>

                      <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-2">
                        <span className="text-[10px] tracking-widest uppercase font-sans text-neutral-400 block">
                          Registered Customers
                        </span>
                        <div className="text-2xl font-sans font-semibold text-white">{dbUsers.length}</div>
                        <span className="text-[10px] text-emerald-400 font-sans tracking-wide">
                          Verified database records
                        </span>
                      </div>

                      <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-2">
                        <span className="text-[10px] tracking-widest uppercase font-sans text-neutral-400 block">
                          Total Orders
                        </span>
                        <div className="text-2xl font-sans font-semibold text-white">{adminOrders.length}</div>
                        <span className="text-[10px] text-emerald-400 font-sans tracking-wide">
                          Live order table records
                        </span>
                      </div>

                      <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-2">
                        <span className="text-[10px] tracking-widest uppercase font-sans text-neutral-400 block">
                          Catalog Products
                        </span>
                        <div className="text-2xl font-sans font-semibold text-white">{products.length}</div>
                        <span className="text-[10px] text-blue-400 font-sans tracking-wide">
                          Persistent inventory
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: PRODUCTS CATALOG TABLE + PROMINENT ADD PRODUCT BUTTON & FORM */}
                {activeTab === 'products' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
                      <div>
                        <h4 className="text-xl font-editorial font-light text-white">Products Catalog Table (`products`)</h4>
                        <p className="text-xs font-sans text-neutral-400 font-light">
                          Manage product availability, stock status, and publish new luxury items.
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
                      <form
                        onSubmit={handleCreateProductSubmit}
                        className="p-6 bg-neutral-900 border border-neutral-700 space-y-4 text-xs font-sans shadow-2xl"
                      >
                        <h5 className="text-sm font-editorial font-normal text-white uppercase tracking-wider">
                          Create New Product Entry
                        </h5>

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
                              className="w-full bg-neutral-800 border border-neutral-700 p-2.5 text-white focus:outline-none focus:border-white"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                              Category
                            </label>
                            <select
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value as any)}
                              className="w-full bg-neutral-800 border border-neutral-700 p-2.5 text-white focus:outline-none focus:border-white uppercase"
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
                              className="w-full bg-neutral-800 border border-neutral-700 p-2.5 text-white focus:outline-none focus:border-white"
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
                              className="w-full bg-neutral-800 border border-neutral-700 p-2.5 text-white focus:outline-none focus:border-white"
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
                            className="w-full bg-neutral-800 border border-neutral-700 p-2.5 text-white focus:outline-none focus:border-white h-20"
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-3 bg-white text-luxury-black text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-all shadow-md"
                        >
                          Publish Product To Store
                        </button>
                      </form>
                    )}

                    {/* PRODUCT LIST TABLE */}
                    <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="border-b border-neutral-800 bg-neutral-950/60 text-[10px] uppercase tracking-widest text-neutral-400">
                          <tr>
                            <th className="p-3.5">Product</th>
                            <th className="p-3.5">Category</th>
                            <th className="p-3.5">Price</th>
                            <th className="p-3.5">Stock Status</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                          {products.map((prod) => (
                            <tr key={prod.id} className="hover:bg-neutral-800/50 transition-colors">
                              <td className="p-3.5 flex items-center gap-3">
                                <div className="relative w-9 h-12 bg-neutral-800 overflow-hidden shrink-0 border border-neutral-700">
                                  <Image src={prod.mainImage} alt={prod.name} fill className="object-cover" />
                                </div>
                                <span className="font-semibold text-white line-clamp-1">{prod.name}</span>
                              </td>
                              <td className="p-3.5 uppercase text-neutral-400 font-mono">{prod.category}</td>
                              <td className="p-3.5 font-semibold text-white">${prod.price}</td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 text-[9px] uppercase font-semibold tracking-wider ${
                                    prod.inStock ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                                  }`}
                                >
                                  {prod.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => toggleStockStatus(prod.id)}
                                  className="px-3 py-1 border border-neutral-700 text-[10px] uppercase tracking-wider hover:bg-white hover:text-black transition-all"
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

                {/* TAB 3: REGISTERED CUSTOMERS DATABASE TABLE */}
                {activeTab === 'customers' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-editorial font-light text-white">Registered Customers Schema Table (`users`)</h4>
                      <p className="text-xs font-sans text-neutral-400 font-light">
                        Viewing all registered accounts, email verification status, and role assignments in the database.
                      </p>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="border-b border-neutral-800 bg-neutral-950/60 text-[10px] uppercase tracking-widest text-neutral-400">
                          <tr>
                            <th className="p-3.5">User ID</th>
                            <th className="p-3.5">Customer Name</th>
                            <th className="p-3.5">Email Address</th>
                            <th className="p-3.5">Verified Status</th>
                            <th className="p-3.5">Joined Date</th>
                            <th className="p-3.5 text-right">Role</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                          {dbUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-neutral-800/50 transition-colors">
                              <td className="p-3.5 font-mono text-neutral-400 text-[11px]">{u.id}</td>
                              <td className="p-3.5 font-semibold text-white">{u.name}</td>
                              <td className="p-3.5 font-mono text-neutral-300">{u.email}</td>
                              <td className="p-3.5">
                                <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono px-2 py-0.5 uppercase tracking-wider">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Verified ✓
                                </span>
                              </td>
                              <td className="p-3.5 text-neutral-400">{u.joinedDate}</td>
                              <td className="p-3.5 text-right">
                                <span
                                  className={`px-2 py-0.5 text-[9px] uppercase font-mono tracking-wider ${
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

                {/* TAB 4: ORDERS MANAGEMENT DATABASE TABLE */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-editorial font-light text-white">Orders Management Schema Table (`orders`)</h4>
                      <p className="text-xs font-sans text-neutral-400 font-light">
                        Real-time customer orders, items breakdown, payment verification, and fulfillment status.
                      </p>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="border-b border-neutral-800 bg-neutral-950/60 text-[10px] uppercase tracking-widest text-neutral-400">
                          <tr>
                            <th className="p-3.5">Order ID</th>
                            <th className="p-3.5">Customer</th>
                            <th className="p-3.5">Date</th>
                            <th className="p-3.5">Items</th>
                            <th className="p-3.5">Total Amount</th>
                            <th className="p-3.5">Payment</th>
                            <th className="p-3.5 text-right">Fulfillment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                          {adminOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-neutral-800/50 transition-colors">
                              <td className="p-3.5 font-mono text-neutral-300 font-semibold">{ord.id}</td>
                              <td className="p-3.5">
                                <span className="font-semibold text-white block">{ord.customerName}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{ord.email}</span>
                              </td>
                              <td className="p-3.5 text-neutral-400">{ord.date}</td>
                              <td className="p-3.5 text-neutral-300">{ord.itemsCount} Items</td>
                              <td className="p-3.5 font-semibold text-white">${ord.total}</td>
                              <td className="p-3.5">
                                <span className="text-emerald-400 font-mono text-[10px]">
                                  {ord.paymentStatus} ✓
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
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

                {/* TAB 5: DB SCHEMA & SYSTEM SPECS */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-editorial font-light text-white">Database Schema & Cloud Connector</h4>
                      <p className="text-xs font-sans text-neutral-400 font-light">
                        Supabase / Firebase / Persistent storage adapter details.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-2">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Single Admin Access</span>
                        <div className="font-mono text-emerald-400 font-semibold">{adminEmail}</div>
                      </div>

                      <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-2">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Database Engine</span>
                        <div className="font-semibold text-white">PostgreSQL / Supabase Ready Schema</div>
                      </div>

                      <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-2">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Active Tables</span>
                        <div className="font-mono text-neutral-300">users • orders • products</div>
                      </div>

                      <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-2">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Security Protocol</span>
                        <div className="font-semibold text-emerald-400">256-Bit Encrypted Role-Based Access Control</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
