'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductColor, CartItem, UserProfile } from '@/types';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';
import {
  ADMIN_EMAIL,
  DbUser,
  DbOrder,
  INITIAL_DB_USERS,
  INITIAL_DB_ORDERS,
  loadDbUsers,
  saveDbUsers,
  loadDbOrders,
  saveDbOrders,
} from '@/lib/db';

interface ToastState {
  id: string;
  message: string;
  type: 'cart' | 'wishlist' | 'info';
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  user: UserProfile | null;
  dbUsers: DbUser[];
  adminOrders: DbOrder[];
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  isAdminOpen: boolean;
  isAuthOpen: boolean;
  isAdminLoggedIn: boolean;
  quickViewProduct: Product | null;
  toasts: ToastState[];
  cartCount: number;
  cartSubtotal: number;
  freeShippingThreshold: number;
  adminEmail: string;
  
  // Actions
  addToCart: (product: Product, color?: ProductColor, size?: string, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openAdmin: () => void;
  closeAdmin: () => void;
  openAuth: () => void;
  closeAuth: () => void;
  loginCustomerOtp: (email: string, name?: string) => boolean;
  logoutCustomer: () => void;
  logoutUser: () => void;
  loginAdminAccount: (email: string, secretPin: string) => boolean;
  logoutAdmin: () => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  showToast: (message: string, type?: 'cart' | 'wishlist' | 'info') => void;
  removeToast: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  toggleStockStatus: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dbUsers, setDbUsers] = useState<DbUser[]>(INITIAL_DB_USERS);
  const [adminOrders, setAdminOrders] = useState<DbOrder[]>(INITIAL_DB_ORDERS);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Independent Admin Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Hydrate state from localStorage after client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedProducts = localStorage.getItem('atelier_products');
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        }

        const storedCart = localStorage.getItem('atelier_cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }

        const storedWishlist = localStorage.getItem('atelier_wishlist');
        if (storedWishlist) {
          setWishlist(JSON.parse(storedWishlist));
        }

        const storedUser = localStorage.getItem('atelier_customer_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const storedAdminStatus = localStorage.getItem('atelier_admin_logged_in');
        if (storedAdminStatus === 'true') {
          setIsAdminLoggedIn(true);
        }

        setDbUsers(loadDbUsers());
        setAdminOrders(loadDbOrders());
      } catch (err) {
        console.error('Error hydrating localStorage state:', err);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Save products
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('atelier_products', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  // Save cart
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('atelier_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Save wishlist
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  // Save Customer User
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('atelier_customer_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('atelier_customer_user');
      }
    }
  }, [user, isLoaded]);

  // Save Admin Session Status
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('atelier_admin_logged_in', isAdminLoggedIn ? 'true' : 'false');
    }
  }, [isAdminLoggedIn, isLoaded]);

  // Save dbUsers
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      saveDbUsers(dbUsers);
    }
  }, [dbUsers, isLoaded]);

  // Save adminOrders
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      saveDbOrders(adminOrders);
    }
  }, [adminOrders, isLoaded]);

  const freeShippingThreshold = 300;

  const showToast = (message: string, type: 'cart' | 'wishlist' | 'info' = 'cart') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (
    product: Product,
    color?: ProductColor,
    size?: string,
    quantity: number = 1
  ) => {
    const selectedColor = color || product.colors[0];
    const selectedSize = size || product.sizes[0];

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.name === selectedColor.name &&
          item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedColor, selectedSize, quantity }];
      }
    });

    showToast(`Added "${product.name}" to cart`, 'cart');
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist`, 'wishlist');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to wishlist`, 'wishlist');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // FLOW 1: CUSTOMER OTP AUTHENTICATION (STRICTLY CUSTOMER PRIVILEGES)
  const loginCustomerOtp = (email: string, name?: string): boolean => {
    if (!email) return false;
    const formattedEmail = email.toLowerCase();
    const customerName = name || formattedEmail.split('@')[0].replace('.', ' ').toUpperCase();

    const customerProfile: UserProfile = {
      name: customerName,
      email: formattedEmail,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUser(customerProfile);

    // Save to DB Users schema table
    setDbUsers((prev) => {
      if (prev.some((u) => u.email === formattedEmail)) return prev;
      return [
        {
          id: `usr-${Date.now()}`,
          name: customerName,
          email: formattedEmail,
          isVerified: true,
          joinedDate: new Date().toISOString().split('T')[0],
          role: 'customer',
        },
        ...prev,
      ];
    });

    showToast(`Welcome, ${customerName} (OTP Verified ✓)`, 'info');
    setIsAuthOpen(false);
    return true;
  };

  const logoutCustomer = () => {
    setUser(null);
    showToast('Customer session ended', 'info');
  };

  // FLOW 2: DEDICATED ADMIN AUTHENTICATION
  const openAdmin = () => {
    setIsAdminOpen(true);
  };

  const loginAdminAccount = (email: string, secretPin: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if passcode is 2026 or admin secret
    if (secretPin === '2026' || secretPin === 'admin' || cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      setIsAdminLoggedIn(true);
      showToast('Authenticated as Administrator ✓', 'info');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    showToast('Admin session locked', 'info');
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [created, ...prev]);
    showToast(`Product "${created.name}" saved to store`, 'info');
  };

  const toggleStockStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        user,
        dbUsers,
        adminOrders,
        isCartOpen,
        isWishlistOpen,
        isSearchOpen,
        isAdminOpen,
        isAuthOpen,
        isAdminLoggedIn,
        quickViewProduct,
        toasts,
        cartCount,
        cartSubtotal,
        freeShippingThreshold,
        adminEmail: ADMIN_EMAIL,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        openAdmin,
        closeAdmin: () => setIsAdminOpen(false),
        openAuth: () => setIsAuthOpen(true),
        closeAuth: () => setIsAuthOpen(false),
        loginCustomerOtp,
        logoutCustomer,
        logoutUser: logoutCustomer,
        loginAdminAccount,
        logoutAdmin,
        openQuickView: (product: Product) => setQuickViewProduct(product),
        closeQuickView: () => setQuickViewProduct(null),
        showToast,
        removeToast,
        addProduct,
        toggleStockStatus,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
