import { CartItem, Coupon, Discount, Product } from "../../../types";
import { FilledCartItem } from "../cart/cartTypes";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface StorePageProps {
  productProps: ProductListProps;
  cartSidebarProps: CartSidebarProps;
}

export interface ProductListProps {
  cart: CartItem[];
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  addToCart: (product: ProductWithUI) => void;
}

export interface CartSidebarProps {
  cartProps: {
    filledItems: FilledCartItem[];
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, newQuantity: number) => void;
  };
  couponProps: {
    coupons: Coupon[];
    selectedCouponCode: string;
    selectorOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  };
  payment: {
    totals: { totalBeforeDiscount: number; totalAfterDiscount: number };
    completeOrder: () => void;
  };
}

export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Discount[];
}
