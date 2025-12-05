# Advanced 프로젝트 - 주요 이슈 및 해결 방법

## 🐛 현재 상태

### 기본과제 완료 상태
- ✅ Component에서 비즈니스 로직을 Hook으로 분리 완료
- ✅ entities -> features -> UI 계층 구조 구현 완료
- ✅ 순수 함수와 액션 분리 완료

### 심화과제 진행 상태
- ⏳ Zustand 설치 필요
- ⏳ Zustand Store 설계 필요
- ⏳ Hook을 Zustand Store로 리팩토링 필요
- ⏳ Props drilling 제거 필요

---

## 📋 Zustand 설치 안내

### 설치 명령어
다음 명령어로 Zustand를 설치해주세요:

```bash
pnpm add zustand
```

### 설치 확인
설치 후 다음을 확인해주세요:
- `package.json`에 `zustand` 의존성 추가 확인
- 버전 충돌 없이 설치되었는지 확인
- React 19.1.1과 호환되는 Zustand 버전인지 확인

### 예상 버전
- Zustand 최신 안정 버전 (React 19 호환)

---

## 🎯 Zustand 리팩토링 계획

### 1. Store 설계

#### useProductStore
```typescript
// 예상 구조
interface ProductStore {
  // State
  products: ProductWithUI[];
  productForm: ProductForm;
  editingProduct: string | null;
  showProductForm: boolean;
  
  // Actions
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  startEditProduct: (product: ProductWithUI) => void;
  handleProductSubmit: (e: React.FormEvent) => void;
  setProductForm: (form: ProductForm | ((prev: ProductForm) => ProductForm)) => void;
  setEditingProduct: (id: string | null) => void;
  setShowProductForm: (show: boolean) => void;
}
```

#### useCartStore
```typescript
// 예상 구조
interface CartStore {
  // State
  cart: CartItem[];
  totalItemCount: number;
  
  // Computed
  filledItems: FilledCartItem[];
  
  // Actions
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  completeOrder: () => void;
}
```

#### useCouponStore
```typescript
// 예상 구조
interface CouponStore {
  // State
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  couponForm: Coupon;
  showCouponForm: boolean;
  
  // Actions
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  applyCoupon: (coupon: Coupon) => void;
  handleCouponSubmit: (e: React.FormEvent) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  setCouponForm: (form: Coupon | ((prev: Coupon) => Coupon)) => void;
  setShowCouponForm: (show: boolean) => void;
  selectorOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
```

#### useNotificationStore (선택적)
```typescript
// 예상 구조
interface NotificationStore {
  // State
  notifications: Notification[];
  
  // Actions
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
  removeNotification: (id: string) => void;
}
```

#### useSearchStore (선택적)
```typescript
// 예상 구조
interface SearchStore {
  // State
  searchTerm: string;
  debouncedSearchTerm: string;
  
  // Actions
  setSearchTerm: (term: string) => void;
}
```

---

### 2. Props Drilling 제거 전략

#### 제거할 Props
- 전역 상태로 관리되는 값
  - `products`, `cart`, `coupons`
  - `productForm`, `couponForm`
  - `selectedCoupon`
  - `notifications`
  - `searchTerm`, `debouncedSearchTerm`

- 전역 액션 함수
  - `addToCart`, `removeFromCart`, `updateQuantity`
  - `addProduct`, `updateProduct`, `deleteProduct`
  - `addCoupon`, `deleteCoupon`, `applyCoupon`
  - `addNotification`

- 계산된 값
  - `filledItems`
  - `totals`
  - `filteredProducts`
  - `totalItemCount`

#### 유지할 Props
- 도메인 관련 props
  - `productId` - 특정 상품 식별
  - `onClick` - 이벤트 핸들러 (도메인 액션이 아닌 경우)
  - `format` - UI 설정 (PriceType)

- UI 설정 props
  - `placeholder` - 입력 필드 플레이스홀더
  - `required` - 필수 입력 여부

---

### 3. 컴포넌트 변경 예시

#### 이전 (Props Drilling)
```typescript
// App.tsx
<ProductList
  cart={cart}
  products={products}
  filteredProducts={filteredProducts}
  debouncedSearchTerm={debouncedSearchTerm}
  addToCart={addToCart}
/>

// ProductList.tsx
export const ProductList = ({
  cart,
  products,
  filteredProducts,
  debouncedSearchTerm,
  addToCart,
}: ProductListProps) => {
  // ...
};
```

#### 이후 (Zustand Store 사용)
```typescript
// App.tsx
<ProductList format={PriceType.KR} />

// ProductList.tsx
export const ProductList = ({ format }: { format: PriceType }) => {
  const { cart, products, filteredProducts, debouncedSearchTerm } = useProductStore();
  const { addToCart } = useCartStore();
  
  // ...
};
```

---

## ⚠️ 주의사항

### 1. localStorage 동기화
- Zustand Store 내부에서 localStorage 동기화 처리
- `persist` 미들웨어 사용 고려
- 또는 `subscribe`를 사용하여 수동 동기화

### 2. 의존성 관리
- Store 간 의존성 명확히
- `useCartStore`는 `useProductStore`의 `products` 참조 필요
- `useCouponStore`는 `useCartStore`의 `cart` 참조 필요

### 3. 테스트 코드 수정 불가
- 테스트 코드는 수정하지 않음
- Store 사용 시에도 동일한 동작 보장
- 컴포넌트 동작은 동일하게 유지

### 4. 점진적 리팩토링
- 한 번에 하나씩 Store로 변환
- 각 단계마다 테스트 확인
- 문서 업데이트

---

## 🔄 리팩토링 단계

### Step 1: Zustand 설치 ✅
- [x] pnpm으로 Zustand 설치 완료 (v5.0.9)

### Step 2: Store 설계
- [ ] useProductStore 설계
- [ ] useCartStore 설계
- [ ] useCouponStore 설계
- [ ] useNotificationStore 설계 (선택적)
- [ ] useSearchStore 설계 (선택적)

### Step 3: Store 구현
- [ ] useProductStore 구현
- [ ] useCartStore 구현
- [ ] useCouponStore 구현
- [ ] localStorage 동기화 구현

### Step 4: Hook 리팩토링
- [ ] useProduct를 useProductStore로 대체
- [ ] useCart를 useCartStore로 대체
- [ ] useCoupon을 useCouponStore로 대체

### Step 5: Props Drilling 제거
- [ ] App.tsx에서 불필요한 props 제거
- [ ] 컴포넌트에서 Store 직접 사용
- [ ] Props 빌더 함수 제거

### Step 6: 테스트 및 검증
- [ ] 모든 테스트 통과 확인
- [ ] 기능 동작 확인
- [ ] 코드 리뷰

---

## 📝 작업 기록

### 2025-01-XX
- basic 프로젝트를 advanced로 복사 완료
- 문서 작성 완료
- Zustand 설치 완료 (v5.0.9)
- 다음 단계: Zustand Store 설계 및 구현

---

## 🔍 발견된 패턴 및 베스트 프랙티스

### 1. Zustand Store 패턴
```typescript
// ✅ 권장: Store 분리
const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  addProduct: (newProduct) => {
    // 로직
  },
}));

// ✅ 권장: localStorage 동기화
const useProductStore = create(
  persist<ProductStore>(
    (set, get) => ({
      // Store 로직
    }),
    {
      name: 'product-storage',
    }
  )
);
```

### 2. Props 전달 기준
```typescript
// ✅ 유지: 도메인 props
<ProductItem productId={product.id} onClick={handleClick} />

// ❌ 제거: 전역 상태 props
<ProductList products={products} cart={cart} />
```

### 3. Store 선택적 사용
```typescript
// ✅ Store에서 필요한 것만 선택
const { products, addProduct } = useProductStore();

// ✅ 계산된 값은 selector로
const filledItems = useCartStore((state) => 
  state.cart.map(item => ({
    ...item,
    priceDetails: calculateItemPriceDetails(item, state.cart),
  }))
);
```

---

## ⚠️ 주의해야 할 패턴

### 1. Store 간 의존성
```typescript
// ❌ 문제 있는 코드
const useCartStore = create((set, get) => {
  const products = useProductStore.getState().products; // 잘못된 패턴
  
  return {
    addToCart: (product) => {
      // products 사용
    },
  };
});

// ✅ 해결 방법: 함수 내에서 getState 사용
const useCartStore = create((set, get) => ({
  addToCart: (product) => {
    const products = useProductStore.getState().products;
    // 로직
  },
}));
```

### 2. localStorage 동기화
```typescript
// ✅ 올바른 패턴: persist 미들웨어
import { persist } from 'zustand/middleware';

const useProductStore = create(
  persist(
    (set) => ({
      products: [],
      // ...
    }),
    {
      name: 'product-storage',
    }
  )
);
```

---

## 📝 코드 리뷰 체크리스트

### Zustand 리팩토링
- [ ] Store 설계 명확히
- [ ] localStorage 동기화 구현
- [ ] Props drilling 제거
- [ ] 도메인 props 유지
- [ ] 테스트 통과 확인

### 코드 품질
- [ ] 타입 오류 없음
- [ ] 린터 오류 없음
- [ ] 기존 기능 정상 동작
- [ ] 코드 가독성 양호

