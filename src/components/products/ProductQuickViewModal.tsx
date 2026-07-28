'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { ProductColor } from '@/types';
import { X, Heart, ShoppingBag, Check, Star, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductQuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart, toggleWishlist, isInWishlist } = useShop();

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors[0] || { name: 'Standard', hex: '#111111' });
      setSelectedSize(quickViewProduct.sizes[0] || 'M');
      setSelectedImage(quickViewProduct.mainImage || '');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const activeColor = selectedColor || quickViewProduct.colors[0] || { name: 'Standard', hex: '#111111' };
  const activeSize = selectedSize || quickViewProduct.sizes[0] || 'M';
  const activeImage = selectedImage || quickViewProduct.mainImage;

  const isSaved = isInWishlist(quickViewProduct.id);
  const images = [quickViewProduct.mainImage, quickViewProduct.hoverImage].filter(Boolean);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, activeColor, activeSize, quantity);
    closeQuickView();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white overflow-y-auto shadow-2xl border border-neutral-200"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-2 text-luxury-black hover:opacity-60 transition-opacity bg-white/80 backdrop-blur-md rounded-full border border-neutral-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10">
            {/* IMAGE GALLERY (LEFT) */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 border border-neutral-200">
                <Image
                  src={activeImage}
                  alt={quickViewProduct.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center filter brightness-[0.98]"
                />
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 aspect-[3/4] border overflow-hidden transition-all ${
                      activeImage === img ? 'border-luxury-black ring-1 ring-luxury-black' : 'border-neutral-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCT INFO (RIGHT) */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs tracking-widest font-sans uppercase text-neutral-400">
                  <span>ATELIER ARCHIVE</span>
                  {quickViewProduct.rating && (
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{quickViewProduct.rating} / 5.0</span>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-editorial font-light text-luxury-black">
                  {quickViewProduct.name}
                </h2>

                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-sans font-semibold text-luxury-black">
                    ${quickViewProduct.price}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-sm font-sans text-neutral-400 line-through">
                      ${quickViewProduct.originalPrice}
                    </span>
                  )}
                  <span className={`text-xs font-sans tracking-wide uppercase font-medium ${
                    quickViewProduct.inStock ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {quickViewProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <p className="text-xs text-luxury-gray font-sans font-light leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* COLOR SELECTION */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs tracking-wider uppercase font-sans font-medium text-luxury-black block">
                    Color: <span className="text-neutral-500 font-normal">{activeColor.name}</span>
                  </span>
                  <div className="flex gap-2">
                    {quickViewProduct.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color.hex }}
                        className={`w-7 h-7 rounded-full border transition-all ${
                          activeColor.name === color.name
                            ? 'ring-2 ring-luxury-black ring-offset-2 scale-110'
                            : 'border-neutral-300 opacity-80 hover:opacity-100'
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* SIZE SELECTION */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs tracking-wider uppercase font-sans">
                    <span className="font-medium text-luxury-black">Size</span>
                    <button className="text-neutral-400 hover:text-luxury-black underline underline-offset-2">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-xs font-sans uppercase border transition-all ${
                          activeSize === size
                            ? 'border-luxury-black bg-luxury-black text-white'
                            : 'border-neutral-200 text-luxury-black hover:border-neutral-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QUANTITY & ACTIONS */}
                <div className="pt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-neutral-200">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-2 text-sm text-luxury-black hover:bg-neutral-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-xs font-sans font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3 py-2 text-sm text-luxury-black hover:bg-neutral-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!quickViewProduct.inStock}
                      className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] font-sans font-medium transition-all flex items-center justify-center gap-2 ${
                        quickViewProduct.inStock
                          ? 'bg-luxury-black text-white hover:bg-neutral-800'
                          : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{quickViewProduct.inStock ? `Add To Cart - $${quickViewProduct.price * quantity}` : 'Out of Stock'}</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(quickViewProduct)}
                      className={`p-3 border border-neutral-200 hover:bg-neutral-50 transition-all ${
                        isSaved ? 'text-rose-500 border-rose-200 bg-rose-50' : 'text-luxury-black'
                      }`}
                      aria-label="Save to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* PRODUCT HIGHLIGHTS */}
                <div className="border-t border-neutral-100 pt-4 space-y-2">
                  <span className="text-[10px] tracking-widest uppercase font-sans font-semibold text-luxury-black block">
                    Product Details
                  </span>
                  <ul className="space-y-1 text-xs text-luxury-gray font-sans font-light list-disc list-inside">
                    {quickViewProduct.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
