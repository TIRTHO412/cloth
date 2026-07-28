import type { Metadata } from 'next';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import WishlistDrawer from '@/components/wishlist/WishlistDrawer';
import SearchModal from '@/components/search/SearchModal';
import ProductQuickViewModal from '@/components/products/ProductQuickViewModal';
import AdminModal from '@/components/admin/AdminModal';
import AuthModal from '@/components/auth/AuthModal';
import Toast from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: "ATELIER — Luxury Minimal Fashion & Editorial Couture 2026",
  description: "Explore ATELIER 2026 collection. Ultra-minimal luxury fashion featuring architectural tailoring, grade-A cashmere, and organic silk silhouettes inspired by COS, Zara, Uniqlo, and Arket.",
  keywords: ["Luxury Fashion", "Minimalist Clothing", "Atelier 2026", "Silk Dresses", "Cashmere Knits", "Architectural Overcoats", "Menswear", "Womenswear"],
  authors: [{ name: "ATELIER Couture" }],
  openGraph: {
    title: "ATELIER — Luxury Minimal Fashion",
    description: "Ultra-minimal luxury fashion featuring architectural tailoring and organic silk silhouettes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-canvas text-luxury-black antialiased selection:bg-luxury-black selection:text-white">
        <ShopProvider>
          <SmoothScroll>
            <CustomCursor />
            <Header />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <WishlistDrawer />
            <SearchModal />
            <ProductQuickViewModal />
            <AdminModal />
            <AuthModal />
            <Toast />
          </SmoothScroll>
        </ShopProvider>
      </body>
    </html>
  );
}
