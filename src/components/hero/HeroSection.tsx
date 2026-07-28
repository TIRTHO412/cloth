'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import ThreeClothCanvas from './ThreeClothCanvas';

export default function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const modelRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [6, -6]);
  const modelRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);
  const textTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) - 0.5);
      mouseY.set((e.clientY / innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative w-full min-h-screen bg-canvas overflow-hidden flex items-center justify-center pt-24 pb-16 px-6 md:px-12 lg:px-16">
      {/* Subtle 3D WebGL Canvas */}
      <ThreeClothCanvas />

      {/* BACKGROUND WATERMARK TYPOGRAPHY (Scaled & Centered Behind Model) */}
      <motion.div
        style={{ x: textTranslateX }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden px-4"
      >
        <h1 className="text-[10vw] lg:text-[9.5vw] leading-none font-editorial tracking-[0.08em] font-light text-neutral-200/90 uppercase text-center whitespace-nowrap">
          ATELIER 2026
        </h1>
      </motion.div>

      {/* MAIN 3-COLUMN BALANCED CONTAINER */}
      <div className="relative w-full min-h-[75vh] grid grid-cols-1 lg:grid-cols-12 items-center z-10 gap-8">
        {/* LEFT COLUMN: EDITORIAL HEADLINE & CTAS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 z-20 space-y-6 md:space-y-8 order-2 lg:order-1 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-md border border-neutral-200 text-[10px] tracking-[0.25em] font-sans uppercase text-luxury-gray">
            <Sparkles className="w-3 h-3 text-luxury-black" />
            <span>ESSENTIALS COLLECTION</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-editorial font-light tracking-tight text-luxury-black leading-[1.05]">
            Fashion That <br />
            <span className="italic font-normal">Moves With You.</span>
          </h2>

          <p className="text-xs md:text-sm font-sans text-luxury-gray tracking-wide max-w-sm font-light leading-relaxed">
            Minimalist tailoring engineered with architectural precision and high-grade organic fabrics. Redefining modern luxury aesthetics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2">
            <a
              href="#products"
              data-cursor="Shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-luxury-black text-white text-xs uppercase tracking-[0.2em] font-sans font-medium hover:bg-neutral-800 transition-all group shadow-sm"
            >
              <span>Shop Now</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <a
              href="#feature"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-luxury-black/30 text-luxury-black text-xs uppercase tracking-[0.2em] font-sans font-medium hover:bg-black/5 transition-all"
            >
              <span>Explore Collection</span>
            </a>
          </div>
        </motion.div>

        {/* CENTER COLUMN: PERFECTLY CENTERED MAIN MODEL IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            rotateX: modelRotateX,
            rotateY: modelRotateY,
            transformStyle: 'preserve-3d',
          }}
          className="lg:col-span-4 relative flex justify-center items-center order-1 lg:order-2 z-10 my-4 lg:my-0"
        >
          <div
            data-cursor="Lookbook"
            className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[400px] aspect-[3/4] overflow-hidden shadow-2xl border border-white/60 group animate-float-slow"
          >
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
              alt="Luxury Fashion Model in Orange Outfit"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top filter brightness-[0.98] contrast-[1.02] group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-[10px] tracking-[0.25em] uppercase font-sans font-medium">
              <span>LOOKBOOK EDITION</span>
              <span>NO. 08</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: ALIGNED 'NEW COLLECTION 2026' TEXT BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 z-20 flex flex-col justify-end lg:items-end order-3 text-left lg:text-right space-y-4"
        >
          <div className="border-t border-luxury-black/20 pt-4 w-full max-w-xs">
            <span className="text-[10px] tracking-[0.3em] font-sans uppercase text-luxury-gray block mb-1">
              SEASON ARCHIVE
            </span>
            <span className="text-3xl font-editorial font-light text-luxury-black block">
              New Collection <br />
              <span className="font-normal tracking-widest text-2xl font-sans">2026</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans text-luxury-gray tracking-wider pt-2 lg:justify-end">
            <span>PARIS</span>
            <span>•</span>
            <span>MILAN</span>
            <span>•</span>
            <span>TOKYO</span>
          </div>
        </motion.div>
      </div>

      {/* SCROLL DOWN INDICATOR */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-6 md:left-12 lg:left-16 z-20 flex items-center gap-3 cursor-pointer"
      >
        <div className="w-6 h-[1px] bg-luxury-black/30" />
        <a href="#categories" className="text-[9px] tracking-[0.3em] uppercase font-sans text-luxury-gray hover:text-luxury-black transition-colors">
          Scroll Down
        </a>
      </motion.div>
    </section>
  );
}
