import { Coupon, Product } from "../../../types";
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
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: Product) => number;
  getDisplayPrice: (price: number, productId?: string) => string;
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
