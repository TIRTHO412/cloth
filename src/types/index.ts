export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'men' | 'women' | 'kids' | 'beauty' | 'accessories';
  price: number;
  originalPrice?: number;
  colors: ProductColor[];
  sizes: string[];
  mainImage: string;
  hoverImage: string;
  description: string;
  details: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  rating?: number;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  itemCount: number;
}

export interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
}

export type FilterCategory = 'all' | 'men' | 'women' | 'kids' | 'accessories';
