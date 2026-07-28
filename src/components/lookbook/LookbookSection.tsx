'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LookbookSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const lookbookItems = [
    {
      title: 'Monochrome Tailoring',
      season: 'Spring 2026',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
      desc: 'Architectural sharp shoulders paired with fluid high-waisted pleated wool trousers.',
    },
    {
      title: 'The Silk Fluidity',
      season: 'Summer 2026',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop',
      desc: 'Heavyweight Mulberry silk draping that moves effortlessly with every step.',
    },
    {
      title: 'Minimalist Structure',
      season: 'Autumn 2026',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop',
      desc: 'Double-faced French linen suits crafted in clean beige and charcoal palettes.',
    },
  ];

  return (
    <>
      <section id="lookbook" className="relative w-full py-32 md:py-44 bg-luxury-black text-white overflow-hidden">
        {/* EDITORIAL BACKGROUND IMAGE WITH DARK OVERLAY */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
            alt="Editorial Lookbook Banner"
            fill
            sizes="100vw"
            className="object-cover object-center filter grayscale brightness-[0.4] contrast-[1.1] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        {/* CONTENT (FULL WIDTH LEFT ALIGNED) */}
        <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 flex flex-col justify-center min-h-[50vh] text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-6"
          >
            <span className="text-xs tracking-[0.3em] uppercase font-sans text-neutral-400 font-light block">
              EDITORIAL VISION
            </span>

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-editorial font-light leading-tight tracking-tight uppercase">
              THE 2026 <br />
              <span className="italic font-normal">LOOKBOOK.</span>
            </h2>

            <p className="text-sm font-sans font-light text-neutral-300 leading-relaxed max-w-lg">
              A visual study in modern minimalism and clean Swiss aesthetics. Shot on location in Copenhagen and Tokyo.
            </p>

            <div className="pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                data-cursor="View"
                className="inline-flex items-center gap-4 px-10 py-5 bg-white text-luxury-black text-xs uppercase tracking-[0.25em] font-sans font-medium hover:bg-neutral-200 transition-all group"
              >
                <span>Explore Lookbook</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LOOKBOOK LIGHTBOX MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 z-50 p-3 text-white hover:opacity-60 transition-opacity bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-5xl aspect-[16/10] md:aspect-[16/9] flex items-center justify-center">
              <Image
                src={lookbookItems[activeSlide].image}
                alt={lookbookItems[activeSlide].title}
                fill
                sizes="100vw"
                className="object-contain"
              />

              <div className="absolute bottom-6 left-6 right-6 bg-black/70 backdrop-blur-md p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white text-left">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase font-sans text-neutral-400 block mb-1">
                    {lookbookItems[activeSlide].season}
                  </span>
                  <h3 className="text-2xl font-editorial font-light">
                    {lookbookItems[activeSlide].title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans font-light mt-1">
                    {lookbookItems[activeSlide].desc}
                  </p>
                </div>

                {/* SLIDE NAVIGATION */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setActiveSlide((prev) => (prev === 0 ? lookbookItems.length - 1 : prev - 1))
                    }
                    className="p-2 border border-white/30 rounded-full hover:bg-white/20 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-sans font-medium tracking-widest">
                    0{activeSlide + 1} / 0{lookbookItems.length}
                  </span>
                  <button
                    onClick={() =>
                      setActiveSlide((prev) => (prev === lookbookItems.length - 1 ? 0 : prev + 1))
                    }
                    className="p-2 border border-white/30 rounded-full hover:bg-white/20 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
