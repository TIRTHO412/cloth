'use client';

import React from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    freeShippingThreshold,
    cartCount,
  } = useShop();

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-screen max-w-md bg-white text-luxury-black shadow-2xl flex flex-col justify-between"
          >
            {/* DRAWER HEADER */}
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-luxury-black" />
                <h3 className="text-lg font-editorial font-light uppercase tracking-wider">
                  Shopping Bag ({cartCount})
                </h3>
              </div>
              <button
                onClick={closeCart}
                className="p-1 text-luxury-black hover:opacity-60 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FREE SHIPPING PROGRESS BAR */}
            <div className="bg-neutral-50 p-4 border-b border-neutral-200 space-y-2">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="font-medium text-luxury-black">
                  {amountToFreeShipping === 0
                    ? '🎉 You unlocked Complimentary Express Shipping!'
                    : `Add $${amountToFreeShipping.toFixed(0)} more for Free Shipping`}
                </span>
                <span className="text-neutral-400 font-semibold">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-luxury-black transition-all duration-500"
                />
              </div>
            </div>

            {/* CART ITEMS LIST */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 stroke-[1]" />
                  <p className="text-sm font-sans font-light text-luxury-gray">
                    Your shopping bag is currently empty.
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 bg-luxury-black text-white text-xs uppercase tracking-widest font-sans"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-6 border-b border-neutral-100 last:border-0">
                    {/* PRODUCT THUMBNAIL */}
                    <div className="relative w-20 aspect-[3/4] bg-neutral-100 shrink-0 border border-neutral-200 overflow-hidden">
                      <Image
                        src={item.product.mainImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-sans font-semibold text-luxury-black line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-neutral-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[10px] font-sans text-neutral-500 tracking-wide uppercase">
                          Size: {item.selectedSize} • Color: {item.selectedColor.name}
                        </div>
                        <div className="text-xs font-sans font-semibold text-luxury-black pt-1">
                          ${item.product.price}
                        </div>
                      </div>

                      {/* QUANTITY CONTROLLER */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-neutral-200">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="p-1 hover:bg-neutral-100 text-luxury-black"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-sans font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="p-1 hover:bg-neutral-100 text-luxury-black"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-sans font-semibold text-luxury-black">
                          ${item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* DRAWER FOOTER (CHECKOUT) */}
            {cart.length > 0 && (
              <div className="p-6 bg-neutral-50 border-t border-neutral-200 space-y-4">
                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between text-luxury-gray">
                    <span>Subtotal</span>
                    <span className="font-semibold text-luxury-black">${cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-luxury-gray">
                    <span>Shipping</span>
                    <span>{amountToFreeShipping === 0 ? 'COMPLIMENTARY' : 'Calculated at checkout'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-luxury-black pt-2 border-t border-neutral-200">
                    <span>Total</span>
                    <span>${cartSubtotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('Proceeding to Luxury Secure Checkout...')}
                  className="w-full py-4 bg-luxury-black text-white text-xs uppercase tracking-[0.25em] font-sans font-medium hover:bg-neutral-800 transition-all flex items-center justify-center gap-3"
                >
                  <span>Proceed To Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-sans tracking-wider uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>256-Bit Encrypted Secure Checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
