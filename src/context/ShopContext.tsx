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
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  loginUser: (email: string, pass: string) => boolean;
  registerUser: (name: string, email: string, pass: string) => boolean;
  logoutUser: () => void;
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
  // Default to true for testing mode so Admin Portal is immediately usable
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(true);
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
        } else {
          setCart([
            {
              product: INITIAL_PRODUCTS[0],
              selectedColor: INITIAL_PRODUCTS[0].colors[0],
              selectedSize: 'M',
              quantity: 1,
            },
            {
              product: INITIAL_PRODUCTS[4],
              selectedColor: INITIAL_PRODUCTS[4].colors[0],
              selectedSize: 'One Size',
              quantity: 1,
            },
          ]);
        }

        const storedWishlist = localStorage.getItem('atelier_wishlist');
        if (storedWishlist) {
          setWishlist(JSON.parse(storedWishlist));
        } else {
          setWishlist([INITIAL_PRODUCTS[2], INITIAL_PRODUCTS[6]]);
        }

        const storedUser = localStorage.getItem('atelier_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
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

  // Save products to localStorage on change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('atelier_products', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('atelier_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Save wishlist to localStorage on change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  // Save user to localStorage on change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('atelier_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('atelier_user');
      }
    }
  }, [user, isLoaded]);

  // Save dbUsers to localStorage on change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      saveDbUsers(dbUsers);
    }
  }, [dbUsers, isLoaded]);

  // Save adminOrders to localStorage on change
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

  // OPEN ADMIN PORTAL (Test Mode: Direct access for all users)
  const openAdmin = () => {
    setIsAdminLoggedIn(true);
    setIsAdminOpen(true);
  };

  // User Auth Actions
  const loginUser = (email: string, pass: string): boolean => {
    if (!email || !pass) return false;
    const nameFromEmail = email.split('@')[0].replace('.', ' ');
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

    const loggedInUser: UserProfile = {
      name: formattedName,
      email: email.toLowerCase(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUser(loggedInUser);
    showToast(`Welcome back, ${formattedName}`, 'info');
    setIsAuthOpen(false);
    setIsAdminLoggedIn(true);
    return true;
  };

  const registerUser = (name: string, email: string, pass: string): boolean => {
    if (!name || !email || !pass) return false;

    const formattedEmail = email.toLowerCase();
    const registeredUser: UserProfile = {
      name,
      email: formattedEmail,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUser(registeredUser);

    // Persist new user into DB Users schema
    setDbUsers((prev) => {
      if (prev.some((u) => u.email === formattedEmail)) return prev;
      return [
        {
          id: `usr-${Date.now()}`,
          name,
          email: formattedEmail,
          isVerified: true,
          joinedDate: new Date().toISOString().split('T')[0],
          role: 'customer',
        },
        ...prev,
      ];
    });

    showToast(`Account created for ${name}`, 'info');
    setIsAuthOpen(false);
    setIsAdminLoggedIn(true);
    return true;
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  // Admin Actions
  const loginAdmin = (passcode: string): boolean => {
    setIsAdminLoggedIn(true);
    showToast('Admin Access Unlocked', 'info');
    return true;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    showToast('Admin Session Locked', 'info');
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
        loginAdmin,
        logoutAdmin,
        loginUser,
        registerUser,
        logoutUser,
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
