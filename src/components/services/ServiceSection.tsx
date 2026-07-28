'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceSection() {
  const services = [
    {
      icon: Truck,
      title: 'Fast Worldwide Delivery',
      desc: 'Complimentary express courier shipping on all orders over $300.',
    },
    {
      icon: RotateCcw,
      title: 'Easy 30-Day Returns',
      desc: 'Hassle-free complimentary return pickup service directly from your home.',
    },
    {
      icon: ShieldCheck,
      title: 'Premium Quality',
      desc: 'Handcrafted with sustainably sourced Grade-A natural fabrics.',
    },
    {
      icon: CreditCard,
      title: 'Encrypted Payment',
      desc: '256-bit bank level security with instant Apple Pay and major credit cards.',
    },
  ];

  return (
    <section className="bg-white border-y border-luxury-border py-16">
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          {services.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                className="py-6 md:py-0 md:px-8 first:pl-0 last:pr-0 flex flex-col items-start text-left space-y-3"
              >
                <div className="p-3 bg-neutral-100/80 rounded-full text-luxury-black mb-1">
                  <IconComponent className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h4 className="text-sm font-sans font-medium uppercase tracking-wider text-luxury-black">
                  {item.title}
                </h4>
                <p className="text-xs font-sans text-luxury-gray font-light leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
