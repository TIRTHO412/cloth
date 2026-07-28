'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, LogOut, Package } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    user,
    cartCount,
    wishlist,
    openCart,
    openWishlist,
    openSearch,
    openAuth,
    openAdmin,
    logoutUser,
  } = useShop();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Men', href: '#products' },
    { name: 'Women', href: '#products' },
    { name: 'Kids', href: '#products' },
    { name: 'Beauty', href: '#products' },
  ];

  const handleUserIconClick = () => {
    if (user) {
      setUserDropdownOpen((prev) => !prev);
    } else {
      openAuth();
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-neutral-200/60 py-4 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="w-full px-6 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Left Navigation Links & Logo */}
          <div className="flex items-center space-x-12">
            <Link
              href="/"
              className="text-2xl md:text-3xl tracking-[0.35em] font-light font-editorial uppercase text-luxury-black hover:opacity-80 transition-opacity"
            >
              ATELIER
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="group relative text-xs tracking-[0.2em] uppercase font-sans font-medium text-luxury-black transition-colors"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-luxury-black transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1 text-luxury-black focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-5 md:space-x-6">
            <button
              onClick={openSearch}
              className="p-1 text-luxury-black hover:opacity-60 transition-opacity"
              aria-label="Search"
              data-cursor="Search"
            >
              <Search className="w-4 h-4 md:w-4.5 md:h-4.5" />
            </button>

            {/* USER ICON / ACCOUNT DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleUserIconClick}
                className="p-1 text-luxury-black hover:opacity-60 transition-opacity flex items-center gap-1.5"
                aria-label="Account"
                data-cursor={user ? "Profile" : "Sign In"}
              >
                <UserIcon className="w-4 h-4 md:w-4.5 md:h-4.5" />
                {user && (
                  <span className="hidden lg:inline text-[11px] font-sans font-medium uppercase tracking-wider text-luxury-black line-clamp-1">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {/* LOGGED IN USER DROPDOWN */}
              <AnimatePresence>
                {userDropdownOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 bg-white text-luxury-black border border-neutral-200 shadow-2xl p-5 space-y-4 z-50"
                  >
                    <div className="pb-3 border-b border-neutral-100 space-y-1">
                      <span className="text-[9px] tracking-[0.25em] font-sans uppercase text-neutral-400 block">
                        CLIENT PROFILE
                      </span>
                      <p className="text-sm font-sans font-semibold text-luxury-black line-clamp-1">
                        {user.name}
                      </p>
                      <p className="text-[11px] font-sans text-neutral-400 font-light truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs font-sans">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openWishlist();
                        }}
                        className="w-full flex items-center gap-2 px-2 py-2 hover:bg-neutral-50 transition-colors text-left"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>Saved Wishlist ({wishlist.length})</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openCart();
                        }}
                        className="w-full flex items-center gap-2 px-2 py-2 hover:bg-neutral-50 transition-colors text-left"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-luxury-black" />
                        <span>Shopping Bag ({cartCount})</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openAdmin();
                        }}
                        className="w-full flex items-center gap-2 px-2 py-2 hover:bg-neutral-50 transition-colors text-left"
                      >
                        <Package className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Order History & Admin</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-neutral-100">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logoutUser();
                        }}
                        className="w-full flex items-center gap-2 px-2 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-xs font-sans text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={openWishlist}
              className="relative p-1 text-luxury-black hover:opacity-60 transition-opacity"
              aria-label="Wishlist"
              data-cursor="Saved"
            >
              <Heart className="w-4 h-4 md:w-4.5 md:h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-luxury-black text-[9px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={openCart}
              className="relative p-1 text-luxury-black hover:opacity-60 transition-opacity flex items-center gap-1.5"
              aria-label="Shopping Cart"
              data-cursor="Cart"
            >
              <ShoppingBag className="w-4 h-4 md:w-4.5 md:h-4.5" />
              {cartCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-luxury-black text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-4/5 max-w-sm h-full bg-canvas p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-12">
                  <span className="text-xl tracking-[0.3em] font-light font-editorial uppercase">
                    ATELIER
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-luxury-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col space-y-6">
                  {/* Account Action in Mobile Drawer */}
                  <div className="pb-4 border-b border-neutral-200">
                    {user ? (
                      <div className="space-y-2">
                        <span className="text-[9px] tracking-widest font-sans uppercase text-neutral-400 block">
                          LOGGED IN AS
                        </span>
                        <p className="text-sm font-sans font-semibold text-luxury-black">
                          {user.name}
                        </p>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            logoutUser();
                          }}
                          className="text-xs font-sans text-rose-600 underline"
                        >
                          Log Out
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          openAuth();
                        }}
                        className="w-full py-3 bg-luxury-black text-white text-xs uppercase tracking-widest font-sans font-semibold"
                      >
                        Client Sign In / Register
                      </button>
                    )}
                  </div>

                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg tracking-widest font-sans font-light uppercase border-b border-neutral-200 pb-3"
                    >
                      {link.name}
                    </a>
                  ))}
                  <a
                    href="#lookbook"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg tracking-widest font-sans font-light uppercase border-b border-neutral-200 pb-3"
                  >
                    Lookbook 2026
                  </a>
                </div>
              </div>

              <div className="text-xs tracking-widest uppercase text-neutral-400">
                © 2026 ATELIER COUTURE. ALL RIGHTS RESERVED.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
