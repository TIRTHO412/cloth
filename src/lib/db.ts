import { Product, UserProfile, CartItem } from '@/types';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';

export const ADMIN_EMAIL = 'admin@atelier.com';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  joinedDate: string;
  role: 'admin' | 'customer';
}

export interface DbOrder {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  date: string;
  itemsCount: number;
  items?: CartItem[];
}

// Initial Database Seed Records
export const INITIAL_DB_USERS: DbUser[] = [
  {
    id: 'usr-admin-1',
    name: 'Atelier Head Administrator',
    email: ADMIN_EMAIL,
    isVerified: true,
    joinedDate: '2026-01-01',
    role: 'admin',
  },
  {
    id: 'usr-cust-1',
    name: 'Victoria Sterling',
    email: 'v.sterling@vogue.co.uk',
    isVerified: true,
    joinedDate: '2026-06-12',
    role: 'customer',
  },
  {
    id: 'usr-cust-2',
    name: 'Julian Vance',
    email: 'j.vance@architecturaldigest.com',
    isVerified: true,
    joinedDate: '2026-07-04',
    role: 'customer',
  },
  {
    id: 'usr-cust-3',
    name: 'Elena Rostova',
    email: 'elena@milanfashion.it',
    isVerified: true,
    joinedDate: '2026-07-19',
    role: 'customer',
  },
];

export const INITIAL_DB_ORDERS: DbOrder[] = [
  {
    id: 'ORD-2026-901',
    customerName: 'Victoria Sterling',
    email: 'v.sterling@vogue.co.uk',
    total: 1270,
    status: 'Processing',
    paymentStatus: 'Paid',
    date: '2026-07-28',
    itemsCount: 3,
  },
  {
    id: 'ORD-2026-898',
    customerName: 'Julian Vance',
    email: 'j.vance@architecturaldigest.com',
    total: 620,
    status: 'Shipped',
    paymentStatus: 'Paid',
    date: '2026-07-27',
    itemsCount: 2,
  },
  {
    id: 'ORD-2026-874',
    customerName: 'Elena Rostova',
    email: 'elena@milanfashion.it',
    total: 1840,
    status: 'Delivered',
    paymentStatus: 'Paid',
    date: '2026-07-25',
    itemsCount: 4,
  },
];

// Helper functions for Database Storage Persistence
export const loadDbUsers = (): DbUser[] => {
  if (typeof window === 'undefined') return INITIAL_DB_USERS;
  try {
    const data = localStorage.getItem('atelier_db_users');
    return data ? JSON.parse(data) : INITIAL_DB_USERS;
  } catch {
    return INITIAL_DB_USERS;
  }
};

export const saveDbUsers = (users: DbUser[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('atelier_db_users', JSON.stringify(users));
  }
};

export const loadDbOrders = (): DbOrder[] => {
  if (typeof window === 'undefined') return INITIAL_DB_ORDERS;
  try {
    const data = localStorage.getItem('atelier_db_orders');
    return data ? JSON.parse(data) : INITIAL_DB_ORDERS;
  } catch {
    return INITIAL_DB_ORDERS;
  }
};

export const saveDbOrders = (orders: DbOrder[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('atelier_db_orders', JSON.stringify(orders));
  }
};
