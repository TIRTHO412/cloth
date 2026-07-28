'use client';

import React from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, closeWishlist, toggleWishlist, addToCart } = useShop();

  if (!isWishlistOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeWishlist}
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
            {/* HEADER */}
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="text-lg font-editorial font-light uppercase tracking-wider">
                  Saved Wishlist ({wishlist.length})
                </h3>
              </div>
              <button
                onClick={closeWishlist}
                className="p-1 text-luxury-black hover:opacity-60 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* WISHLIST ITEMS */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <Heart className="w-12 h-12 text-neutral-300 stroke-[1]" />
                  <p className="text-sm font-sans font-light text-luxury-gray">
                    You haven't saved any items yet.
                  </p>
                  <button
                    onClick={closeWishlist}
                    className="px-6 py-3 bg-luxury-black text-white text-xs uppercase tracking-widest font-sans"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 pb-6 border-b border-neutral-100 last:border-0"
                  >
                    <div className="relative w-20 aspect-[3/4] bg-neutral-100 shrink-0 border border-neutral-200 overflow-hidden">
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-sans font-semibold text-luxury-black line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => toggleWishlist(product)}
                            className="text-neutral-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs font-sans font-semibold text-luxury-black">
                          ${product.price}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(product, product.colors[0], product.sizes[0], 1);
                          toggleWishlist(product);
                        }}
                        className="w-full py-2 bg-luxury-black text-white text-[10px] uppercase tracking-widest font-sans font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all mt-2"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
