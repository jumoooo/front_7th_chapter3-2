# Basic 프로젝트 - 도메인 모델 및 타입

## 📦 타입 정의 위치

### 공통 타입 (src/types.ts)
프로젝트 전체에서 사용하는 기본 타입 정의

### 도메인별 타입
- `src/basic/domain/product/productTypes.ts` - 상품 관련 타입
- `src/basic/domain/cart/cartTypes.ts` - 장바구니 관련 타입
- `src/basic/domain/notification/notificationTypes.ts` - 알림 관련 타입

---

## 🛍️ 상품 도메인 (Product Domain)

### 기본 타입 (src/types.ts)

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface Discount {
  quantity: number;  // 할인 적용 최소 수량
  rate: number;      // 할인율 (0.1 = 10%)
}
```

### 확장 타입 (domain/product/productTypes.ts)

```typescript
// UI용 확장 상품 타입
export interface ProductWithUI extends Product {
  description?: string;        // 상품 설명 (선택)
  isRecommended?: boolean;     // 추천 상품 여부
}

// 상품 폼 타입
export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Discount[];
}
```

### Props 타입

```typescript
// 상품 목록 Props
export interface ProductListProps {
  cart: CartItem[];
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  addToCart: (product: ProductWithUI) => void;
}

// 장바구니 사이드바 Props
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
```

---

## 🛒 장바구니 도메인 (Cart Domain)

### 기본 타입 (src/types.ts)

```typescript
export interface CartItem {
  product: Product;
  quantity: number;
}
```

### 확장 타입 (domain/cart/cartTypes.ts)

```typescript
// 가격 정보가 포함된 장바구니 아이템
export type FilledCartItem = CartItem & {
  priceDetails: {
    itemTotal: number;        // 할인 적용 후 총액
    hasDiscount: boolean;     // 할인 여부
    discountRate: number;      // 할인율 (퍼센트)
  };
};
```

---

## 🎫 쿠폰 도메인 (Coupon Domain)

### 기본 타입 (src/types.ts)

```typescript
export interface Coupon {
  name: string;                    // 쿠폰 이름
  code: string;                    // 쿠폰 코드
  discountType: 'amount' | 'percentage';  // 할인 타입
  discountValue: number;            // 할인 값 (금액 또는 퍼센트)
}
```

---

## 🔔 알림 도메인 (Notification Domain)

### 타입 정의 (domain/notification/notificationTypes.ts)

```typescript
export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}
```

---

## 📊 상수 정의 (constans/constans.ts)

```typescript
// 가격 표시 형식
export enum PriceType {
  KR = "kr",  // "10,000원" 형식
  EN = "en",  // "₩10,000" 형식
}

// 할인 타입
export enum DiscountType {
  AMOUNT = "amount",        // 금액 할인
  PRECENTAGE = "percentage"  // 퍼센트 할인
}
```

---

## 🔗 타입 관계도

```
Product (기본)
  └─ ProductWithUI (UI 확장)
      ├─ description?: string
      └─ isRecommended?: boolean

CartItem
  ├─ product: Product
  └─ quantity: number
      └─ FilledCartItem (가격 정보 추가)
          └─ priceDetails: { itemTotal, hasDiscount, discountRate }

Coupon
  ├─ discountType: 'amount' | 'percentage'
  └─ discountValue: number

Notification
  ├─ type: "error" | "success" | "warning"
  └─ message: string
```

---

## 📝 주요 타입 사용 패턴

### 1. 상품 추가/수정
```typescript
// 추가 시: id 제외
addProduct(newProduct: Omit<ProductWithUI, "id">)

// 수정 시: 부분 업데이트
updateProduct(productId: string, updates: Partial<ProductWithUI>)
```

### 2. 상태 업데이트
```typescript
// 함수형 업데이트 패턴 (권장)
setProductForm((prev) => ({
  ...prev,
  name: newName,
}));
```

### 3. Props 전달
```typescript
// Props 객체 빌더 패턴
const buildAdminProductsSection = () => {
  return {
    productForm,
    showProductForm,
    handleProductSubmit,
    // ...
  };
};
```

---

## ⚠️ 타입 주의사항

### 1. ProductForm vs ProductWithUI
- `ProductForm`: 폼 입력용 (id 없음, description 필수)
- `ProductWithUI`: 실제 상품 데이터 (id 있음, description 선택)

### 2. FilledCartItem
- `CartItem`에 `priceDetails`가 추가된 타입
- `useMemo`로 계산된 값 포함

### 3. Discount
- `quantity`: 할인 적용 최소 수량
- `rate`: 할인율 (0.1 = 10%, 소수점 형식)

---

## 🔄 타입 변환 함수

### formatCouponName (couponUtils.ts)
```typescript
// 쿠폰 이름에 할인 정보 추가
formatCouponName(coupons: Coupon[]): Coupon[]
// "5000원 할인" → "5000원 할인 (5,000원)"
// "10% 할인" → "10% 할인 (10%)"
```

### formatPrice (formatters.ts)
```typescript
// 가격 포맷팅
formatPrice(price: number, type: "kr" | "en"): string
// 10000, "kr" → "10,000원"
// 10000, "en" → "₩10,000"
```

