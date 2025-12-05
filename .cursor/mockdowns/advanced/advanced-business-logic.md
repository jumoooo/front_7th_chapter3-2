# Advanced 프로젝트 - 비즈니스 로직

## 📍 비즈니스 로직 위치

### 도메인별 유틸리티
- `src/advanced/domain/cart/cartUtils.ts` - 장바구니 계산 로직
- `src/advanced/domain/cart/couponUtils.ts` - 쿠폰 관련 로직
- `src/advanced/domain/product/productUtils.ts` - 상품 필터링 로직
- `src/advanced/utils/formatters.ts` - 포맷팅 로직

**참고**: basic 프로젝트와 동일한 로직입니다. 자세한 내용은 `basic-business-logic.md`를 참고하세요.

---

## 💰 할인 정책 (Discount Policy)

### 정책 상수 (cartUtils.ts)

```typescript
export const BULK_EXTRA_DISCOUNT = 0.05;        // 대량 구매 추가 할인율 (5%)
export const MAX_DISCOUNT_RATE = 0.5;          // 최대 할인율 상한 (50%)
export const BULK_PURCHASE_THRESHOLD = 10;      // 대량 구매 기준 수량
```

### 할인 계산 로직

#### 1. 기본 할인율 계산 (getBaseDiscount)
```typescript
// 상품의 discounts 배열에서 수량 조건에 맞는 최대 할인율 반환
getBaseDiscount(item: CartItem): number
```

**로직:**
- `item.quantity >= discount.quantity` 조건을 만족하는 할인만 적용
- 여러 할인 중 최대 할인율 선택
- 조건에 맞는 할인이 없으면 0 반환

#### 2. 대량 구매 보너스 (hasBulkPurchase)
```typescript
// 장바구니에 10개 이상인 아이템이 있는지 확인
hasBulkPurchase(quantities: number[]): boolean
```

**로직:**
- 장바구니의 모든 아이템 수량 중 하나라도 10개 이상이면 true
- 대량 구매 보너스 5% 추가 할인 적용

#### 3. 최종 할인율 계산 (calculateFinalDiscount)
```typescript
// 기본 할인 + 대량 구매 보너스, 최대 50% 제한
calculateFinalDiscount(baseDiscount: number, bulkBonus: number): number
```

**로직:**
- `baseDiscount + bulkBonus` 계산
- 최대 50% (0.5) 제한 적용
- `Math.min(baseDiscount + bulkBonus, MAX_DISCOUNT_RATE)` 반환

---

## 🛒 장바구니 계산 로직

### 1. 아이템 총액 계산 (calculateItemTotal)
```typescript
calculateItemTotal(price: number, quantity: number, discount: number): number
```

**공식:**
```
총액 = 가격 × 수량 × (1 - 할인율)
결과는 Math.round()로 반올림
```

### 2. 장바구니 총액 계산 (calculateCartTotal)
```typescript
calculateCartTotal(
  cart: CartItem[],
  selectedCoupon: Coupon | null
): { totalBeforeDiscount: number; totalAfterDiscount: number }
```

**로직:**
1. **할인 전 총액**: 모든 아이템의 `가격 × 수량` 합계
2. **아이템 할인 적용**: 각 아이템에 `calculateItemTotal()` 적용하여 합계
3. **쿠폰 할인 적용**: 선택된 쿠폰이 있으면 `applyCoupon()` 적용
4. **반올림**: 모든 금액은 `Math.round()`로 반올림

---

## 🎫 쿠폰 로직

### 1. 쿠폰 적용 (applyCoupon)
```typescript
applyCoupon(amount: number, coupon: Coupon): number
```

**로직:**
- **amount 타입**: `amount - discountValue` (최소 0)
- **percentage 타입**: `amount × (1 - discountValue / 100)` (반올림)

### 2. 쿠폰 이름 포맷팅 (formatCouponName)
```typescript
formatCouponName(coupons: Coupon[]): Coupon[]
```

**로직:**
- 쿠폰 이름에 할인 정보 추가
- amount: `"쿠폰명 (5,000원)"`
- percentage: `"쿠폰명 (10%)"`

---

## 🔍 상품 필터링 로직

### filterProductsBySearchTerm
```typescript
filterProductsBySearchTerm(
  debouncedSearchTerm: string,
  products: ProductWithUI[]
): ProductWithUI[]
```

**로직:**
1. 검색어가 없으면 모든 상품 반환
2. 검색어가 있으면:
   - 상품명에 포함되는지 확인 (대소문자 무시)
   - 설명에 포함되는지 확인 (대소문자 무시)
   - 둘 중 하나라도 포함되면 필터링 통과

---

## 📦 재고 관리 로직

### 1. 재고 잔량 확인 (getRemainingStock)
```typescript
getRemainingStock(cart: CartItem[], product: Product): number
```

**로직:**
- 상품의 총 재고에서 장바구니에 담긴 수량 차감
- 장바구니에 없으면 전체 재고 반환

### 2. 품절 확인 (isSoldOut)
```typescript
isSoldOut(
  cart: CartItem[],
  product: ProductWithUI,
  productId?: string
): boolean
```

**로직:**
- `getRemainingStock()` 결과가 0 이하이면 품절
- `productId`가 없으면 false 반환

---

## 💱 가격 포맷팅 로직

### formatPrice
```typescript
formatPrice(price: number, type: "kr" | "en" = "kr"): string
```

**로직:**
- **kr**: `"10,000원"` 형식
- **en**: `"₩10,000"` 형식
- `toLocaleString()`으로 천 단위 구분

---

## 🔄 상태 업데이트 패턴

### 1. 함수형 업데이트 (권장)
```typescript
// ProductBasicFields에서 사용
setProductForm((prev) => ({
  ...prev,
  name: newName,
}));
```

**이유:**
- 빠른 연속 업데이트에서도 최신 상태 보장
- 클로저 문제 방지

### 2. 직접 업데이트 (주의)
```typescript
// 클로저 문제 가능성
setProductForm({
  ...productForm,
  name: newName,
});
```

---

## ⚠️ 주의사항

### 1. 할인율 제한
- 최대 할인율은 50%로 제한
- 기본 할인 + 대량 구매 보너스 합이 50% 초과 시 50%로 제한

### 2. 쿠폰 적용 조건
- percentage 쿠폰은 10,000원 이상 구매 시만 사용 가능
- `applyCoupon` 함수에서 검증

### 3. 재고 검증
- 장바구니 추가 시 `getRemainingStock()` 확인
- 수량 업데이트 시 재고 초과 방지

### 4. 금액 반올림
- 모든 금액 계산 결과는 `Math.round()`로 반올림
- 소수점 발생 시 정수로 변환

---

## 🚀 Zustand 리팩토링 후

### Store 내부에서 사용
- 모든 계산 함수는 Store 내부에서 사용
- 순수 함수이므로 Store에서 직접 호출 가능
- 컴포넌트는 계산 결과만 사용

### 예시
```typescript
// Zustand Store 내부
const useCartStore = create((set, get) => ({
  cart: [],
  totals: () => {
    const { cart, selectedCoupon } = get();
    return calculateCartTotal(cart, selectedCoupon);
  },
  filledItems: () => {
    const { cart } = get();
    return cart.map((item) => ({
      ...item,
      priceDetails: calculateItemPriceDetails(item, cart),
    }));
  },
}));
```

