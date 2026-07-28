'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useShop();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'info');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to ATELIER Journal', 'info');
    setEmail('');
  };

  return (
    <section className="py-24 md:py-32 bg-canvas border-t border-luxury-border/60">
      <div className="w-full px-6 md:px-12 lg:px-16 text-left space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-4 max-w-2xl"
        >
          <span className="text-[10px] tracking-[0.35em] font-sans uppercase text-luxury-gray block">
            JOIN THE ATELIER JOURNAL
          </span>
          <h2 className="text-4xl md:text-6xl font-editorial font-light text-luxury-black tracking-tight">
            Curated Insights & Private Invites
          </h2>
          <p className="text-xs md:text-sm font-sans font-light text-luxury-gray leading-relaxed">
            Receive early access to seasonal lookbooks, exclusive capsule releases, and private runway previews.
          </p>
        </motion.div>

        {/* EMAIL FORM */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          onSubmit={handleSubmit}
          className="max-w-md relative flex items-center border-b border-luxury-black pb-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER YOUR EMAIL ADDRESS"
            className="w-full bg-transparent text-xs tracking-[0.2em] font-sans uppercase text-luxury-black placeholder:text-neutral-400 focus:outline-none pr-12 py-2"
          />
          <button
            type="submit"
            className="absolute right-0 p-2 text-luxury-black hover:opacity-60 transition-opacity"
            aria-label="Subscribe"
          >
            {subscribed ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </motion.form>

        <p className="text-[10px] font-sans text-neutral-400 tracking-wider">
          BY SUBSCRIBING YOU AGREE TO OUR PRIVACY POLICY AND TERMS OF SERVICE.
        </p>
      </div>
    </section>
  );
}
