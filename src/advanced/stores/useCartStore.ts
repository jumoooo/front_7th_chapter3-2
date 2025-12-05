import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "../../types";
import { ProductWithUI } from "../domain/product/productTypes";
import {
  calculateItemPriceDetails,
  getRemainingStock,
} from "../domain/cart/cartUtils";
import { FilledCartItem } from "../domain/cart/cartTypes";
import { useProductStore } from "./useProductStore";
import { useNotificationStore } from "./useNotificationStore";

/**
 * 장바구니 Entity 관련 전역 상태를 관리하는 Zustand Store
 * 
 * Entity를 다루는 Store
 * - Cart Entity의 상태 관리 및 로직
 * - localStorage 동기화 (persist 미들웨어 사용)
 * - useProductStore, useNotificationStore 의존
 */
interface CartState {
  // 상태
  cart: CartItem[];

  // 액션
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  completeOrder: () => void;

  // 계산된 값 (함수로 제공)
  getTotalItemCount: () => number;
  getFilledItems: () => FilledCartItem[];
}

// localStorage에서 동기적으로 초기 상태 읽기 (origin과 동일한 방식)
const getInitialCart = (): CartItem[] => {
  const saved = localStorage.getItem("cart");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // 배열이 직접 저장되거나 { state: { cart: [...] } } 형태일 수 있음
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && parsed.state && Array.isArray(parsed.state.cart)) {
        return parsed.state.cart;
      }
      return [];
    } catch {
      return [];
    }
  }
  return [];
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      // 초기 상태: localStorage에서 동기적으로 읽기 (origin과 동일)
      const initialCartState = getInitialCart();
      
      return {
        cart: initialCartState,

      // 장바구니 아이템 총 개수 (계산된 값)
      getTotalItemCount: () => {
        const cart = get().cart;
        if (!Array.isArray(cart)) return 0;
        return cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      // 장바구니 아이템에 가격 정보 추가 (계산된 값)
      getFilledItems: () => {
        const cart = get().cart;
        if (!Array.isArray(cart)) return [];
        return cart.map((item) => ({
          ...item,
          priceDetails: calculateItemPriceDetails(item, cart),
        }));
      },

      // 장바구니에 추가
      addToCart: (product) => {
        const state = get();
        const cart = Array.isArray(state.cart) ? state.cart : [];
        const remainingStock = getRemainingStock(cart, product);

        if (remainingStock <= 0) {
          useNotificationStore.getState().addNotification(
            "재고가 부족합니다!",
            "error"
          );
          return;
        }

        const existingItem = cart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            useNotificationStore.getState().addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              "error"
            );
            return;
          }

          set({
            cart: Array.isArray(cart) ? cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ) : [],
          });
        } else {
          set({
            cart: Array.isArray(cart) ? [...cart, { product, quantity: 1 }] : [{ product, quantity: 1 }],
          });
        }

        useNotificationStore.getState().addNotification(
          "장바구니에 담았습니다",
          "success"
        );
      },

      // 장바구니에서 제거
      removeFromCart: (productId) => {
        set((state) => {
          const cart = Array.isArray(state.cart) ? state.cart : [];
          return {
            cart: cart.filter((item) => item.product.id !== productId),
          };
        });
      },

      // 수량 업데이트
      updateQuantity: (productId, newQuantity) => {
        if (newQuantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const products = useProductStore.getState().products;
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        const maxStock = product.stock;
        if (newQuantity > maxStock) {
          useNotificationStore.getState().addNotification(
            `재고는 ${maxStock}개까지만 있습니다.`,
            "error"
          );
          return;
        }

        set((state) => {
          const cart = Array.isArray(state.cart) ? state.cart : [];
          return {
            cart: cart.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: newQuantity }
                : item
            ),
          };
        });
      },

      // 주문 완료
      completeOrder: () => {
        const orderNumber = `ORD-${Date.now()}`;
        useNotificationStore.getState().addNotification(
          `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
          "success"
        );
        set({ cart: [] });
      },
      };
    },
    {
      name: "cart", // localStorage 키 (origin과 동일)
      partialize: (state) => ({ cart: state.cart }), // cart만 저장
      // storage 옵션 제거: App.tsx의 useEffect가 배열을 직접 저장하므로
      // persist는 내부적으로만 사용하고, 실제 저장은 useEffect가 담당
      skipHydration: true,
    }
  )
);

// Store 초기화 시 localStorage에서 동기적으로 복원 (skipHydration: true 사용 시 필요)
// 테스트 환경에서는 실행하지 않음 (beforeEach에서 초기화)
if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
  const saved = localStorage.getItem("cart");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        useCartStore.setState({ cart: parsed });
      }
    } catch {
      // 에러 무시 (초기값 사용)
    }
  }
}

