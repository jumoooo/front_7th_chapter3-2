# Basic 프로젝트 - 상태 관리

## 📍 상태 관리 위치

모든 상태는 `App.tsx`에서 관리됩니다. 컴포넌트 분리 구조이지만 상태는 중앙 집중식으로 관리합니다.

---

## 🔄 상태 목록

### 1. 상품 관련 상태

```typescript
// 상품 목록
const [products, setProducts] = useState<ProductWithUI[]>(() => {
  const saved = localStorage.getItem("products");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialProducts;
    }
  }
  return initialProducts;
});

// 상품 폼 (추가/수정용)
const [productForm, setProductForm] = useState<ProductForm>({
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [] as Array<Discount>,
});

// 상품 편집 상태
const [editingProduct, setEditingProduct] = useState<string | null>(null);
const [showProductForm, setShowProductForm] = useState(false);
```

**특징:**
- `products`: localStorage에서 초기화, 변경 시 자동 저장
- `productForm`: 폼 입력 상태, 함수형 업데이트 사용
- `editingProduct`: 편집 중인 상품 ID 또는 "new"

---

### 2. 장바구니 관련 상태

```typescript
// 장바구니 아이템
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

// 장바구니 아이템 총 개수 (계산된 값)
const [totalItemCount, setTotalItemCount] = useState(0);
```

**특징:**
- `cart`: localStorage에서 초기화, 변경 시 자동 저장
- `totalItemCount`: `useEffect`로 계산

---

### 3. 쿠폰 관련 상태

```typescript
// 쿠폰 목록
const [coupons, setCoupons] = useState<Coupon[]>(() => {
  const saved = localStorage.getItem("coupons");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialCoupons;
    }
  }
  return initialCoupons;
});

// 선택된 쿠폰
const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

// 쿠폰 폼
const [couponForm, setCouponForm] = useState<Coupon>({
  name: "",
  code: "",
  discountType: "amount" as "amount" | "percentage",
  discountValue: 0,
});

// 쿠폰 폼 표시 여부
const [showCouponForm, setShowCouponForm] = useState(false);
```

---

### 4. UI 상태

```typescript
// 관리자 모드 여부
const [isAdmin, setIsAdmin] = useState(false);

// 관리자 탭 (products | coupons)
const [activeTab, setActiveTab] = useState<AdminTabKey>("products");

// 알림 목록
const [notifications, setNotifications] = useState<Notification[]>([]);

// 검색어
const [searchTerm, setSearchTerm] = useState("");

// 디바운스된 검색어
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
```

---

## 💾 localStorage 동기화

### 자동 저장 useEffect

```typescript
// 상품 저장
useEffect(() => {
  localStorage.setItem("products", JSON.stringify(products));
}, [products]);

// 쿠폰 저장
useEffect(() => {
  localStorage.setItem("coupons", JSON.stringify(coupons));
}, [coupons]);

// 장바구니 저장
useEffect(() => {
  if (cart.length > 0) {
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    localStorage.removeItem("cart");
  }
}, [cart]);
```

**특징:**
- 상태 변경 시 자동으로 localStorage에 저장
- 장바구니가 비어있으면 localStorage에서 제거

---

## 🔄 상태 업데이트 함수

### useCallback으로 최적화된 함수들

```typescript
// 알림 추가
const addNotification = useCallback(
  (message: string, type: "error" | "success" | "warning" = "success") => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  },
  []
);

// 장바구니 추가
const addToCart = useCallback(
  (product: ProductWithUI) => {
    // 재고 확인
    const remainingStock = getRemainingStock(cart, product);
    if (remainingStock <= 0) {
      addNotification("재고가 부족합니다!", "error");
      return;
    }
    // 장바구니 업데이트 (함수형 업데이트)
    setCart((prevCart) => {
      // 기존 아이템 확인
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
  [cart, addNotification, getRemainingStock]
);
```

**특징:**
- `useCallback`으로 함수 재생성 방지
- 의존성 배열에 필요한 값 포함
- 함수형 업데이트 사용

---

### 일반 함수 (useCallback 없음)

```typescript
// 상품 폼 제출
const handleProductSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (editingProduct && editingProduct !== "new") {
    updateProduct(editingProduct, productForm);
    setEditingProduct(null);
  } else {
    addProduct({
      ...productForm,
      discounts: productForm.discounts,
    });
  }
  // 폼 초기화
  setProductForm({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [],
  });
  setEditingProduct(null);
  setShowProductForm(false);
};
```

**중요:**
- `handleProductSubmit`은 `useCallback`으로 감싸지 않음
- 매 렌더링마다 새로 생성되어 최신 `productForm` 참조 보장
- 클로저 문제 방지

---

## 🎯 계산된 값 (useMemo)

```typescript
// 장바구니 아이템에 가격 정보 추가
const filledItems = useMemo(
  () =>
    cart.map((item) => ({
      ...item,
      priceDetails: calculateItemPriceDetails(item, cart),
    })),
  [cart]
);

// 장바구니 총액 계산
const totals = calculateCartTotal(cart, selectedCoupon);

// 필터링된 상품 목록
const filteredProducts = filterProductsBySearchTerm(
  debouncedSearchTerm,
  products
);
```

**특징:**
- `filledItems`: `useMemo`로 최적화 (cart 변경 시만 재계산)
- `totals`, `filteredProducts`: 매 렌더링마다 계산 (간단한 계산)

---

## 🔄 디바운스 처리

```typescript
// 검색어 디바운스
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

**특징:**
- 500ms 지연 후 검색어 업데이트
- 타이머 정리로 메모리 누수 방지

---

## 📊 Props 빌더 함수

### buildStorePageProps
```typescript
const buildStorePageProps = () => {
  const productProps: ProductListProps = {
    cart,
    products,
    filteredProducts,
    debouncedSearchTerm,
    addToCart,
  };
  const cartSidebarProps: CartSidebarProps = {
    cartProps: {
      filledItems,
      removeFromCart,
      updateQuantity,
    },
    couponProps: {
      coupons,
      selectedCouponCode: selectedCoupon?.code || "",
      selectorOnChange,
    },
    payment: {
      totals,
      completeOrder,
    },
  };
  return { productProps, cartSidebarProps };
};
```

### buildAdminProductsSection
```typescript
const buildAdminProductsSection = () => {
  const adminProductsProps: AdminProductsSectionProps = {
    productListTableProps: productListTableProps(),
    productForm,
    showProductForm,
    editingProduct,
    setEditingProduct,
    setProductForm,
    setShowProductForm,
    handleProductSubmit,
    addNotification,
  };
  return adminProductsProps;
};
```

**특징:**
- 매 렌더링마다 호출되지만 최신 상태 참조
- Props 객체를 한 곳에서 관리

---

## ⚠️ 상태 관리 주의사항

### 1. 함수형 업데이트 필수
```typescript
// ✅ 올바른 방법
setProductForm((prev) => ({
  ...prev,
  name: newName,
}));

// ❌ 잘못된 방법 (클로저 문제)
setProductForm({
  ...productForm,
  name: newName,
});
```

### 2. handleProductSubmit은 useCallback 사용 안 함
- 최신 `productForm` 참조를 위해 매 렌더링마다 새로 생성
- 클로저 문제 방지

### 3. localStorage 동기화
- 상태 변경 시 자동 저장
- 초기화 시 localStorage에서 복원
- try-catch로 JSON 파싱 오류 처리

### 4. 의존성 배열 관리
- `useCallback`, `useMemo`의 의존성 배열 정확히 관리
- 누락 시 오래된 값 참조 가능

---

## 🔄 상태 흐름도

```
사용자 액션
  ↓
이벤트 핸들러 (App.tsx)
  ↓
상태 업데이트 (useState setter)
  ↓
useEffect (localStorage 저장)
  ↓
재렌더링
  ↓
Props 빌더 함수 호출
  ↓
컴포넌트에 Props 전달
  ↓
UI 업데이트
```

---

## 📝 상태 관리 패턴 요약

1. **중앙 집중식 관리**: 모든 상태를 App.tsx에서 관리
2. **localStorage 동기화**: useEffect로 자동 저장
3. **함수형 업데이트**: 상태 의존 업데이트 시 필수
4. **useCallback 최적화**: 자주 사용되는 함수 최적화
5. **useMemo 최적화**: 복잡한 계산 결과 캐싱
6. **Props 빌더**: Props 객체를 함수로 생성

