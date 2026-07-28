'use client';

import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function Footer() {
  const { openAdmin, isAdminLoggedIn } = useShop();

  const footerNav = [
    {
      title: 'Shop',
      links: [
        { name: 'Women Collection', href: '#products' },
        { name: 'Men Collection', href: '#products' },
        { name: 'Kids Apparel', href: '#products' },
        { name: 'Leather & Accessories', href: '#products' },
        { name: 'New Arrivals 2026', href: '#products' },
      ],
    },
    {
      title: 'About',
      links: [
        { name: 'Our Philosophy', href: '#' },
        { name: 'Sustainable Craft', href: '#' },
        { name: 'Materials & Fabrics', href: '#' },
        { name: 'Atelier Studios', href: '#' },
        { name: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Journal',
      links: [
        { name: 'Lookbook Edition 08', href: '#lookbook' },
        { name: 'Runway 2026 Archive', href: '#' },
        { name: 'Architectural Design', href: '#' },
        { name: 'Press & Media', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Client Care', href: '#' },
        { name: 'Shipping & Customs', href: '#' },
        { name: 'Returns & Exchanges', href: '#' },
        { name: 'Garment Care Guide', href: '#' },
        { name: 'Size & Fit Matrix', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-luxury-black text-white pt-24 pb-12 border-t border-neutral-800">
      <div className="w-full px-6 md:px-12 lg:px-16 space-y-16 text-left">
        {/* TOP BRAND HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 border-b border-neutral-800 gap-8">
          <div>
            <Link
              href="/"
              className="text-4xl md:text-6xl tracking-[0.35em] font-light font-editorial uppercase block mb-4"
            >
              ATELIER
            </Link>
            <p className="text-xs font-sans text-neutral-400 tracking-wider max-w-sm font-light">
              Architectural luxury tailoring engineered for modern minimalist living. Paris • Milan • Tokyo.
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs tracking-widest font-sans uppercase">
            <a href="#" className="hover:text-neutral-400 transition-colors">
              Instagram
            </a>
            <span>/</span>
            <a href="#" className="hover:text-neutral-400 transition-colors">
              Pinterest
            </a>
            <span>/</span>
            <a href="#" className="hover:text-neutral-400 transition-colors">
              LinkedIn
            </a>
          </div>
        </div>

        {/* NAVIGATION LINKS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {footerNav.map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-neutral-300">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      className="text-xs font-sans text-neutral-400 hover:text-white font-light tracking-wide transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM COPYRIGHT & ADMIN PORTAL BUTTON */}
        <div className="pt-12 border-t border-neutral-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-sans tracking-widest uppercase text-neutral-500">
          <div>© 2026 ATELIER COUTURE INC. ALL RIGHTS RESERVED.</div>

          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-neutral-300 transition-colors">
              PRIVACY POLICY
            </a>
            <a href="#" className="hover:text-neutral-300 transition-colors">
              TERMS OF SERVICE
            </a>
            <a href="#" className="hover:text-neutral-300 transition-colors">
              ACCESSIBILITY
            </a>

            {/* ADMIN LOGIN BUTTON WITH LOCK ICON */}
            <button
              onClick={openAdmin}
              data-cursor="Admin"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all font-sans text-[10px] tracking-widest uppercase"
              aria-label="Admin Portal"
            >
              <Lock className="w-3 h-3 text-neutral-400 group-hover:text-white" />
              <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
