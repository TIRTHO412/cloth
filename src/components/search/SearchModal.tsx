'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchModal() {
  const { products, isSearchOpen, closeSearch, openQuickView } = useShop();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredProducts = products.filter((product) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)
    );
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md overflow-y-auto p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* HEADER CLOSE BUTTON */}
          <div className="flex justify-between items-center border-b border-neutral-200 pb-6">
            <span className="text-xs tracking-[0.3em] font-sans uppercase text-luxury-gray">
              ATELIER SEARCH DIRECTORY
            </span>
            <button
              onClick={closeSearch}
              className="p-2 text-luxury-black hover:opacity-60 transition-opacity bg-neutral-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* INPUT FIELD */}
          <div className="relative flex items-center border-b-2 border-luxury-black pb-4">
            <Search className="w-6 h-6 text-luxury-black mr-4 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH CASHMERE, OVERCOAT, DENIM, SUITS..."
              className="w-full bg-transparent text-xl md:text-3xl font-editorial tracking-wider uppercase text-luxury-black placeholder:text-neutral-300 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs tracking-widest font-sans uppercase text-neutral-400 hover:text-luxury-black"
              >
                Clear
              </button>
            )}
          </div>

          {/* SEARCH SUGGESTIONS OR RESULTS */}
          {!query.trim() ? (
            <div className="space-y-6">
              <span className="text-xs tracking-[0.25em] font-sans uppercase font-semibold text-neutral-400 block">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-3">
                {['Architectural Overcoat', 'Linen Suit', 'Cashmere Knit', 'Leather Shoulder Bag', 'Raw Denim', 'Silk Slip'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-neutral-100 text-luxury-black text-xs uppercase tracking-wider font-sans hover:bg-luxury-black hover:text-white transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs font-sans tracking-widest uppercase text-neutral-400">
                <span>Search Results</span>
                <span>{filteredProducts.length} Products Found</span>
              </div>

              {filteredProducts.length === 0 ? (
                <p className="text-sm font-sans text-luxury-gray py-8">
                  No products matched your search "{query}". Try checking for spelling errors or search for broader categories.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        closeSearch();
                        openQuickView(product);
                      }}
                      className="group flex gap-4 p-3 bg-neutral-50 border border-neutral-200 cursor-pointer hover:border-luxury-black transition-all"
                    >
                      <div className="relative w-16 aspect-[3/4] bg-neutral-200 shrink-0 overflow-hidden">
                        <Image
                          src={product.mainImage}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <span className="text-[9px] tracking-widest font-sans uppercase text-neutral-400">
                            {product.category}
                          </span>
                          <h4 className="text-xs font-sans font-medium text-luxury-black line-clamp-1 group-hover:underline">
                            {product.name}
                          </h4>
                        </div>
                        <span className="text-xs font-sans font-semibold text-luxury-black">
                          ${product.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
