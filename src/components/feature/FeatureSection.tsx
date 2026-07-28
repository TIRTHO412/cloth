'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function FeatureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      id="feature"
      ref={containerRef}
      className="relative py-24 md:py-32 bg-white overflow-hidden border-t border-luxury-border/60"
    >
      <div className="w-full px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* LEFT CONTENT */}
        <motion.div style={{ y: textY }} className="lg:col-span-6 space-y-8 text-left">
          <div>
            <span className="text-[10px] tracking-[0.3em] font-sans uppercase text-luxury-gray block mb-4">
              EDITORIAL CAMPAIGN 2026
            </span>
            <span className="text-sm font-sans tracking-[0.2em] text-luxury-black font-semibold uppercase block mb-2">
              NEW SEASON
            </span>
            <h2 className="text-6xl md:text-8xl font-editorial font-light leading-none tracking-tight text-luxury-black uppercase">
              NEW <br />
              <span className="italic font-normal">VIBES.</span>
            </h2>
          </div>

          <p className="text-sm font-sans text-luxury-gray font-light leading-relaxed max-w-md">
            An exploration of form, tone, and tactile textures. Our 2026 Spring/Summer edition blends raw Japanese selvedge denim with weightless Italian silk. Engineered to transition effortlessly through every environment.
          </p>

          <div className="pt-4 flex items-center gap-6">
            <a
              href="#products"
              data-cursor="Discover"
              className="inline-flex items-center gap-4 px-9 py-4 bg-luxury-black text-white text-xs uppercase tracking-[0.25em] font-sans font-medium hover:bg-neutral-800 transition-all group"
            >
              <span>Explore Campaign</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>

            <span className="text-xs tracking-widest font-sans uppercase text-neutral-400">
              LIMITED RELEASE
            </span>
          </div>
        </motion.div>

        {/* RIGHT EDITORIAL IMAGE WITH SCROLL SCALE */}
        <div className="lg:col-span-6 relative aspect-[4/5] overflow-hidden bg-neutral-100 shadow-2xl border border-neutral-200">
          <motion.div style={{ scale: imageScale }} className="w-full h-full relative">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
              alt="Editorial New Season Vibes"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center filter brightness-[0.96]"
            />
          </motion.div>

          <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md px-3 py-1.5 text-[9px] tracking-widest uppercase font-sans font-semibold text-luxury-black">
            AUTUMN / WINTER '26
          </div>
        </div>
      </div>
    </section>
  );
}
