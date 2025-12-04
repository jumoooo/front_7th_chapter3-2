import { useState, useCallback, useEffect, useMemo } from "react";
import { CartItem } from "../../types";
import { ProductWithUI } from "../domain/product/productTypes";
import {
  calculateItemPriceDetails,
  getRemainingStock,
} from "../domain/cart/cartUtils";
import { FilledCartItem } from "../domain/cart/cartTypes";

/**
 * 장바구니 Entity 관련 상태 및 로직을 관리하는 Hook
 *
 * Entity를 다루는 Hook
 * - Cart Entity의 상태 관리 및 로직
 */
export const useCart = (
  products: ProductWithUI[],
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [totalItemCount, setTotalItemCount] = useState(0);

  // localStorage 동기화
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  // 장바구니 아이템 총 개수 계산
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  // 장바구니 아이템에 가격 정보 추가 (계산된 값)
  const filledItems = useMemo(
    (): FilledCartItem[] =>
      cart.map((item) => ({
        ...item,
        priceDetails: calculateItemPriceDetails(item, cart),
      })),
    [cart]
  );

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(cart, product);
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              "error"
            );
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [products, removeFromCart, addNotification]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    // selectedCoupon 초기화는 useCoupon의 책임이므로 여기서는 cart만 초기화
  }, [addNotification]);

  return {
    cart,
    totalItemCount,
    filledItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
  };
};
