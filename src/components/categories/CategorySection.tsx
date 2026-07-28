'use client';

import React from 'react';
import Image from 'next/image';
import { CATEGORIES } from '@/data/products';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CategorySection() {
  return (
    <section id="categories" className="py-24 bg-canvas border-t border-luxury-border/60">
      <div className="w-full px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-left">
          <div>
            <span className="text-[10px] tracking-[0.3em] font-sans uppercase text-luxury-gray block mb-2">
              CURATED SELECTIONS
            </span>
            <h2 className="text-3xl md:text-5xl font-editorial font-light text-luxury-black">
              Explore Collections
            </h2>
          </div>
          <p className="text-xs text-luxury-gray font-sans tracking-wide max-w-xs font-light leading-relaxed">
            Discover tailored silhouettes and seasonal essentials designed for modern refined wardrobes.
          </p>
        </div>

        {/* Horizontal Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((category, index) => (
            <motion.a
              key={category.id}
              href={category.link}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              data-cursor="Explore"
              className="group block relative bg-white border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
            >
              {/* Portrait Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center filter brightness-[0.97] group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                
                {/* Item Count Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 text-[9px] tracking-widest font-sans uppercase font-medium text-luxury-black">
                  {category.itemCount} Items
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-6 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-editorial font-normal text-luxury-black group-hover:underline decoration-1 underline-offset-4">
                      {category.title}
                    </h3>
                    <div className="w-8 h-8 rounded-full border border-luxury-black/20 flex items-center justify-center group-hover:bg-luxury-black group-hover:border-luxury-black group-hover:text-white transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                  <p className="text-xs font-sans text-luxury-gray font-light leading-relaxed line-clamp-2">
                    {category.subtitle}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
