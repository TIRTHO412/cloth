'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FilterCategory, Product, ProductColor } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductSection() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const { products } = useShop();

  const filterTabs: { label: string; value: FilterCategory }[] = [
    { label: 'All Collection', value: 'all' },
    { label: 'Women', value: 'women' },
    { label: 'Men', value: 'men' },
    { label: 'Kids', value: 'kids' },
    { label: 'Accessories', value: 'accessories' },
  ];

  const filteredProducts = products.filter((product) => {
    if (activeCategory === 'all') return true;
    return product.category?.trim().toLowerCase() === activeCategory.trim().toLowerCase();
  });

  return (
    <section id="products" className="py-16 md:py-24 bg-canvas border-t border-luxury-border/60 w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16">
        {/* SECTION HEADER & RESPONSIVE SCROLLING TABS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6 text-left w-full">
          <div>
            <span className="text-[10px] tracking-[0.3em] font-sans uppercase text-luxury-gray block mb-2">
              NEW ARRIVALS 2026
            </span>
            <h2 className="text-3xl md:text-5xl font-editorial font-light text-luxury-black">
              The Wardrobe
            </h2>
          </div>

          {/* Filter Category Tabs (Horizontal Scrollable on Mobile) */}
          <div className="flex items-center gap-1 sm:gap-2 border-b border-neutral-200 pb-2 overflow-x-auto whitespace-nowrap scrollbar-none w-full md:w-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={`px-3.5 py-2 text-[11px] sm:text-xs tracking-widest uppercase font-sans transition-all shrink-0 relative ${
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

        {/* FULLY RESPONSIVE PRODUCTS GRID (1 Mobile / 2 Tablet / 3 Medium / 4 Large) */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* EMPTY STATE IF NO PRODUCTS MATCH FILTER */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 space-y-3 bg-white border border-neutral-200 p-8 my-6">
            <h4 className="text-lg font-editorial text-luxury-black">No Products Found</h4>
            <p className="text-xs font-sans text-neutral-400">
              There are currently no items in this category. Add a new item from the Admin Portal.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// INDIVIDUAL PRODUCT CARD COMPONENT (Mobile Friendly Action Buttons)
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
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group flex flex-col justify-between bg-white border border-neutral-200/80 p-3.5 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-300 text-left w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-3.5">
          <Image
            src={isHovered && product.hoverImage ? product.hoverImage : product.mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center filter brightness-[0.98] group-hover:scale-105 transition-all duration-700 ease-out"
          />

          {/* BADGES */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {product.isNew && (
              <span className="bg-luxury-black text-white text-[8px] sm:text-[9px] tracking-widest uppercase font-sans font-semibold px-2 py-0.5">
                NEW
              </span>
            )}
            {product.isBestseller && (
              <span className="bg-white/90 backdrop-blur-md text-luxury-black text-[8px] sm:text-[9px] tracking-widest uppercase font-sans font-semibold px-2 py-0.5 border border-neutral-200">
                BESTSELLER
              </span>
            )}
            {!product.inStock && (
              <span className="bg-rose-600 text-white text-[8px] sm:text-[9px] tracking-widest uppercase font-sans font-semibold px-2 py-0.5">
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
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 flex items-center justify-center text-luxury-black hover:bg-luxury-black hover:text-white transition-all shadow-sm"
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* ACTION OVERLAY BUTTONS (Visible on Mobile Touch Devices + Hover on Desktop) */}
          <div className="absolute inset-x-2.5 bottom-2.5 z-10 flex flex-col gap-1.5 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 opacity-100 translate-y-0 transition-all duration-300">
            <button
              onClick={() => openQuickView(product)}
              className="w-full py-2 bg-white/95 backdrop-blur-md hover:bg-white text-luxury-black text-[9px] sm:text-[10px] tracking-[0.15em] font-sans uppercase font-semibold flex items-center justify-center gap-1.5 border border-neutral-200 shadow-sm transition-all"
            >
              <Eye className="w-3 h-3" />
              <span>Quick View</span>
            </button>

            <button
              onClick={() => addToCart(product, selectedColor, product.sizes[0] || 'M', 1)}
              disabled={!product.inStock}
              className={`w-full py-2 text-[9px] sm:text-[10px] tracking-[0.15em] font-sans uppercase font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all ${
                product.inStock
                  ? 'bg-luxury-black text-white hover:bg-neutral-800'
                  : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-3 h-3" />
              <span>{product.inStock ? 'Add To Cart' : 'Out of Stock'}</span>
            </button>
          </div>
        </div>

        {/* CARD DETAILS */}
        <div className="space-y-1.5">
          {/* COLOR SELECTOR SWATCHES */}
          <div className="flex items-center gap-1.5 pt-0.5">
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
          <h3 className="text-xs sm:text-sm font-sans font-medium text-luxury-black tracking-tight line-clamp-1 group-hover:text-neutral-600 transition-colors">
            {product.name}
          </h3>
        </div>
      </div>

      {/* PRICE & CATEGORY DISPLAY */}
      <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 mt-2.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs sm:text-sm font-sans font-semibold text-luxury-black">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs font-sans text-neutral-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <span className="text-[9px] sm:text-[10px] font-sans tracking-widest text-neutral-400 uppercase">
          {product.category}
        </span>
      </div>
    </motion.div>
  );
}
