'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '@/context/ShopContext';
import { ShoppingBag, Heart, CheckCircle2, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useShop();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center justify-between gap-3 p-4 bg-luxury-black text-white shadow-2xl border border-white/10 backdrop-blur-md rounded-none"
          >
            <div className="flex items-center gap-3">
              {toast.type === 'cart' && <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'wishlist' && <Heart className="w-4 h-4 text-rose-400 shrink-0 fill-rose-400" />}
              {toast.type === 'info' && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
              <span className="text-xs tracking-wide font-sans text-neutral-200">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
