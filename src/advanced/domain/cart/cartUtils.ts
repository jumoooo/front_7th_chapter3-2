import { CartItem, Coupon, Product } from "../../../types";
import { PriceType } from "../../constans/constans";
import { formatPrice } from "../../utils/formatters";
import { ProductWithUI } from "../product/productTypes";

/** =============================
 * 정책 상수
 * ============================== */
export const BULK_EXTRA_DISCOUNT = 0.05; // 대량 구매 시 추가 할인율 (5% 할인)
export const MAX_DISCOUNT_RATE = 0.5; // 총 할인율 최대 상한(50%)
export const BULK_PURCHASE_THRESHOLD = 10; // 대량 구매 기준 수량

/** =============================
 * 순수 계산 함수
 * ============================== */

// 장바구니에서 대량 구매 아이템이 있는지 확인
export const hasBulkPurchase = (quantities: number[]): boolean =>
  quantities.some((q) => q >= BULK_PURCHASE_THRESHOLD);

// 특정 CartItem에 대해 '기본 할인율'을 계산
export const getBaseDiscount = (item: CartItem): number => {
  const { quantity } = item;

  const applicableDiscounts = item.product.discounts
    .filter((d) => quantity >= d.quantity)
    .map((d) => d.rate);

  return applicableDiscounts.length ? Math.max(...applicableDiscounts) : 0;
};

/**
 * 최종 할인율 계산 (순수 함수)
 * @param baseDiscount 기본 할인율
 * @param bulkBonus 대량 구매 보너스 할인율
 * @returns 최종 할인율 (상한 적용)
 */
export const calculateFinalDiscount = (
  baseDiscount: number,
  bulkBonus: number
): number => {
  return Math.min(baseDiscount + bulkBonus, MAX_DISCOUNT_RATE);
};

// 최종 할인 계산 함수 (순수 함수 형태를 유지하기 위해 cart 인자 추가)
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const baseDiscount = getBaseDiscount(item);
  const bulkBonus = hasBulkPurchase(cart.map((i) => i.quantity))
    ? BULK_EXTRA_DISCOUNT
    : 0;

  return calculateFinalDiscount(baseDiscount, bulkBonus);
};

// 단일 아이템 최종 금액 계산
export const calculateItemTotal = (
  price: number,
  quantity: number,
  discount: number
): number => {
  return Math.round(price * quantity * (1 - discount));
};

// 장바구니 총액 계산 (쿠폰 적용 포함)
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalAfterItemDiscount = cart.reduce(
    (sum, item) =>
      sum +
      calculateItemTotal(
        item.product.price,
        item.quantity,
        getMaxApplicableDiscount(item, cart)
      ),
    0
  );

  const totalAfterDiscount = selectedCoupon
    ? applyCoupon(totalAfterItemDiscount, selectedCoupon)
    : totalAfterItemDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

// "총 금액 + 할인 여부 + 할인율” 같은 세부 정보를 반환하는 함수
export const calculateItemPriceDetails = (item: CartItem, cart: CartItem[]) => {
  const itemTotal = calculateItemTotal(
    item.product.price,
    item.quantity,
    getMaxApplicableDiscount(item, cart)
  );
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount
    ? Math.round((1 - itemTotal / originalPrice) * 100)
    : 0;
  return { itemTotal, hasDiscount, discountRate };
};

export const getDisplayPrice = (
  cart: CartItem[],
  product: ProductWithUI,
  format: PriceType
): string => {
  if (isSoldOut(cart, product, product.id)) {
    return "SOLD OUT";
  }

  return formatPrice(product.price, format);
};

// 재고 없는지 여부 확인
export const isSoldOut = (
  cart: CartItem[],
  product: ProductWithUI,
  productId?: string
): boolean => {
  if (!productId) return false;
  return product ? getRemainingStock(cart, product) <= 0 : false;
};

// 재고 잔량 확인
export const getRemainingStock = (
  cart: CartItem[],
  product: Product
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);
  return remaining;
};
/** =============================
 * 쿠폰 적용 함수
 * ============================== */
export const applyCoupon = (amount: number, coupon: Coupon): number => {
  if (coupon.discountType === "amount") {
    return Math.max(0, amount - coupon.discountValue);
  }
  // percent 타입
  return Math.round(amount * (1 - coupon.discountValue / 100));
};
