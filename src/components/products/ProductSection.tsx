'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FilterCategory, Product, ProductColor } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductSection() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const { products, toggleWishlist, isInWishlist, addToCart, openQuickView } = useShop();

  const filterTabs: { label: string; value: FilterCategory }[] = [
    { label: 'All Collection', value: 'all' },
    { label: 'Women', value: 'women' },
    { label: 'Men', value: 'men' },
    { label: 'Kids', value: 'kids' },
    { label: 'Accessories', value: 'accessories' },
  ];

  const filteredProducts = products.filter((product) => {
    if (activeCategory === 'all') return true;
    return product.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <section id="products" className="py-24 bg-canvas border-t border-luxury-border/60">
      <div className="w-full px-6 md:px-12 lg:px-16">
        {/* SECTION HEADER & TABS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-left">
          <div>
            <span className="text-[10px] tracking-[0.3em] font-sans uppercase text-luxury-gray block mb-2">
              NEW ARRIVALS 2026
            </span>
            <h2 className="text-4xl md:text-5xl font-editorial font-light text-luxury-black">
              The Wardrobe
            </h2>
          </div>

          {/* Filter Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={`px-4 py-2 text-xs tracking-widest uppercase font-sans transition-all relative ${
                  activeCategory === tab.value
                    ? 'text-luxury-black font-semibold'
                    : 'text-luxury-gray hover:text-luxury-black'
                }`}
              >
                {tab.label}
                {activeCategory === tab.value && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-luxury-black"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID (4 Desktop / 2 Tablet / 1 Mobile) */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// INDIVIDUAL PRODUCT CARD COMPONENT
function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isInWishlist, addToCart, openQuickView } = useShop();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { name: 'Standard', hex: '#111111' });
  const [isHovered, setIsHovered] = useState(false);
  const isSaved = isInWishlist(product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group flex flex-col justify-between bg-white border border-neutral-200/70 p-4 shadow-sm hover:shadow-xl transition-all duration-500 text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* IMAGE CONTAINER WITH HOVER SWITCH & QUICK ACTION OVERLAYS */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-4">
          <Image
            src={isHovered && product.hoverImage ? product.hoverImage : product.mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center filter brightness-[0.98] group-hover:scale-105 transition-all duration-700 ease-out"
          />

          {/* NEW / BESTSELLER / STOCK BADGES */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.isNew && (
              <span className="bg-luxury-black text-white text-[9px] tracking-widest uppercase font-sans font-semibold px-2 py-0.5">
                NEW
              </span>
            )}
            {product.isBestseller && (
              <span className="bg-white/90 backdrop-blur-md text-luxury-black text-[9px] tracking-widest uppercase font-sans font-semibold px-2 py-0.5 border border-neutral-200">
                BESTSELLER
              </span>
            )}
            {!product.inStock && (
              <span className="bg-rose-600 text-white text-[9px] tracking-widest uppercase font-sans font-semibold px-2 py-0.5">
                OUT OF STOCK
              </span>
            )}
          </div>

          {/* WISHLIST HEART ICON */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 flex items-center justify-center text-luxury-black hover:bg-luxury-black hover:text-white transition-all shadow-sm"
            aria-label="Wishlist"
            data-cursor="Save"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* OVERLAY BUTTONS (Quick View & Add to Cart on Hover) */}
          <div className="absolute inset-x-3 bottom-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={() => openQuickView(product)}
              className="w-full py-2.5 bg-white/90 backdrop-blur-md hover:bg-white text-luxury-black text-[10px] tracking-[0.2em] font-sans uppercase font-semibold flex items-center justify-center gap-2 border border-neutral-200 shadow-sm transition-all"
              data-cursor="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>

            <button
              onClick={() => addToCart(product, selectedColor, product.sizes[0] || 'M', 1)}
              disabled={!product.inStock}
              className={`w-full py-2.5 text-[10px] tracking-[0.2em] font-sans uppercase font-semibold flex items-center justify-center gap-2 shadow-md transition-all ${
                product.inStock
                  ? 'bg-luxury-black text-white hover:bg-neutral-800'
                  : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              }`}
              data-cursor={product.inStock ? "Add" : "Unavailable"}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{product.inStock ? 'Add To Cart' : 'Out of Stock'}</span>
            </button>
          </div>
        </div>

        {/* CARD DETAILS */}
        <div className="space-y-2">
          {/* COLOR SELECTOR SWATCHES */}
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color.hex }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColor.name === color.name
                    ? 'ring-2 ring-luxury-black ring-offset-1 border-transparent scale-110'
                    : 'border-neutral-300 opacity-80 hover:opacity-100'
                }`}
                title={color.name}
              />
            ))}
          </div>

          {/* TITLE */}
          <h3 className="text-sm font-sans font-medium text-luxury-black tracking-tight line-clamp-1 group-hover:text-neutral-600 transition-colors">
            {product.name}
          </h3>
        </div>
      </div>

      {/* PRICE DISPLAY */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-sans font-semibold text-luxury-black">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs font-sans text-neutral-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <span className="text-[10px] font-sans tracking-widest text-neutral-400 uppercase">
          {product.category}
        </span>
      </div>
    </motion.div>
  );
}
