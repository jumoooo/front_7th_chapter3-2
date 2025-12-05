# Advanced 프로젝트 - 컴포넌트 구조

## 📁 컴포넌트 계층 구조

```
App.tsx (루트)
├── DefaultLayout
│   ├── Notifications (topContent)
│   ├── Header
│   │   ├── SearchBar (headerLeft, 관리자 모드 아님)
│   │   └── HeaderActions (headerRight)
│   └── main
│       ├── StorePage (isAdmin === false)
│       │   ├── ProductList
│       │   │   └── ProductItem (반복)
│       │   └── CartSidebar
│       │       ├── CartList
│       │       │   └── CartItemRow (반복)
│       │       ├── CouponSection
│       │       └── PaymentSummary
│       └── AdminPage (isAdmin === true)
│           ├── AdminTabs
│           ├── AdminProductsSection (activeTab === "products")
│           │   ├── SectionHeader
│           │   ├── ProductListTable
│           │   │   └── ProductTableRow (반복)
│           │   └── ProductFormSection (showProductForm === true)
│           │       ├── ProductBasicFields
│           │       │   └── FormInputField (4개)
│           │       └── ProductDiscountList
│           │           └── ProductDiscountRow (반복)
│           └── AdminCouponSection (activeTab === "coupons")
│               ├── CouponList
│               │   └── CouponItem (반복)
│               └── CouponFormSection
│                   ├── CouponFormFields
│                   └── CouponFormActions
```

---

## 🎨 페이지 컴포넌트

### StorePage
**위치**: `pages/StorePage.tsx`

**역할**: 쇼핑몰 메인 페이지

**Props:**
```typescript
interface StorePageProps {
  productProps: ProductListProps;
  cartSidebarProps: CartSidebarProps;
}
```

**구조:**
- 좌측: 상품 목록 (3/4 너비)
- 우측: 장바구니 사이드바 (1/4 너비, sticky)

**현재 Props Drilling:**
- `productProps`: cart, products, filteredProducts, debouncedSearchTerm, addToCart
- `cartSidebarProps`: filledItems, removeFromCart, updateQuantity, coupons, selectedCouponCode, selectorOnChange, totals, completeOrder

**Zustand 리팩토링 후:**
- 전역 상태는 Store에서 직접 사용
- 도메인 props만 전달 (예: productId, onClick 등)

---

### AdminPage
**위치**: `pages/AdminPage.tsx`

**역할**: 관리자 대시보드

**Props:**
```typescript
interface AdminPageProps {
  activeTab: AdminTabKey;  // "products" | "coupons"
  adminProductsProps: AdminProductsSectionProps;
  adminCouponProps: AdminCouponSectionProps;
  setActiveTab: React.Dispatch<React.SetStateAction<AdminTabKey>>;
}
```

**구조:**
- 탭: 상품 관리 / 쿠폰 관리
- 탭에 따라 다른 섹션 표시

---

## 🛍️ 상품 관련 컴포넌트

### ProductList
**위치**: `components/product/ProductList.tsx`

**역할**: 상품 목록 표시

**Props:**
```typescript
interface ProductListProps {
  format: PriceType;
  cart: CartItem[];
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  addToCart: (product: ProductWithUI) => void;
}
```

**Zustand 리팩토링 후:**
- `cart`, `products`, `filteredProducts`, `addToCart`는 Store에서 직접 사용
- `format`만 props로 전달 (UI 설정)

---

### ProductItem
**위치**: `components/product/ProductItem.tsx`

**역할**: 개별 상품 카드

**기능:**
- 상품 정보 표시
- 장바구니 담기 버튼
- 재고 상태 표시

**Zustand 리팩토링 후:**
- `addToCart`는 Store에서 직접 사용
- `product` props는 유지 (도메인 데이터)

---

### AdminProductsSection
**위치**: `components/admin/product/AdminProductsSection.tsx`

**역할**: 관리자 상품 관리 섹션

**Props:**
```typescript
interface AdminProductsSectionProps {
  productListTableProps: ProductListTableProps;
  productForm: ProductForm;
  showProductForm: boolean;
  editingProduct: string | null;
  setEditingProduct: (value: React.SetStateAction<string | null>) => void;
  setProductForm: (value: React.SetStateAction<ProductForm>) => void;
  setShowProductForm: (value: React.SetStateAction<boolean>) => void;
  handleProductSubmit: (e: React.FormEvent) => void;
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
}
```

**Zustand 리팩토링 후:**
- `productForm`, `showProductForm`, `editingProduct`, `handleProductSubmit`는 Store에서 직접 사용
- `addNotification`은 Store에서 직접 사용 (또는 props 유지)

---

## 🛒 장바구니 관련 컴포넌트

### CartSidebar
**위치**: `components/cart/CartSidebar.tsx`

**역할**: 장바구니 사이드바

**Props:**
```typescript
CartSidebarProps {
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

**Zustand 리팩토링 후:**
- 모든 props를 Store에서 직접 사용
- Props 없이 컴포넌트 내부에서 Store 사용

---

### CartList
**위치**: `components/cart/CartList.tsx`

**역할**: 장바구니 아이템 목록

**기능:**
- FilledCartItem 배열 렌더링
- 각 아이템에 CartItemRow 사용

**Zustand 리팩토링 후:**
- `filledItems`는 Store에서 직접 사용

---

### CartItemRow
**위치**: `components/cart/CartItemRow.tsx`

**역할**: 개별 장바구니 아이템 행

**기능:**
- 상품 정보 표시
- 수량 조절 (+/- 버튼)
- 삭제 버튼
- 할인 정보 표시

**Zustand 리팩토링 후:**
- `removeFromCart`, `updateQuantity`는 Store에서 직접 사용
- `productId` props는 유지 (도메인 데이터)

---

## 🎫 쿠폰 관련 컴포넌트

### CouponSection
**위치**: `components/cart/CouponSection.tsx`

**역할**: 쿠폰 선택 섹션

**기능:**
- 쿠폰 드롭다운 선택
- 선택된 쿠폰 표시

**Zustand 리팩토링 후:**
- `coupons`, `selectedCouponCode`, `selectorOnChange`는 Store에서 직접 사용

---

### AdminCouponSection
**위치**: `components/admin/coupon/AdminCouponSection.tsx`

**역할**: 관리자 쿠폰 관리 섹션

**구조:**
- CouponList: 쿠폰 목록
- CouponFormSection: 쿠폰 추가 폼 (조건부 렌더링)

**Zustand 리팩토링 후:**
- 쿠폰 관련 상태는 Store에서 직접 사용

---

## 🧩 공통 컴포넌트

### FormInputField
**위치**: `components/common/FormInputField.tsx`

**역할**: 재사용 가능한 입력 필드

**Props:**
```typescript
interface FormInputFieldProps {
  fieldName: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  placeholder?: string;
  required?: boolean;  // 기본값: true
}
```

**중요:**
- `required` prop 추가됨 (기본값: `true`)
- 설명 필드 등 선택 입력 필드에 `required={false}` 전달 필요

---

### SearchBar
**위치**: `components/common/SearchBar.tsx`

**역할**: 검색 입력창

**기능:**
- 검색어 입력
- 디바운스는 useSearch Hook에서 처리 (500ms)

**Zustand 리팩토링 후:**
- `searchTerm`, `setSearchTerm`은 Store에서 직접 사용 (또는 로컬 상태 유지)

---

### Notifications
**위치**: `components/notifications/Notification.tsx`

**역할**: 알림 메시지 표시

**기능:**
- 상단에 알림 표시
- 3초 후 자동 제거
- 타입별 스타일 (error, success, warning)

**Zustand 리팩토링 후:**
- `notifications`, `setNotifications`는 Store에서 직접 사용

---

## 🎨 레이아웃 컴포넌트

### DefaultLayout
**위치**: `components/layouts/DefaultLayout.tsx`

**역할**: 기본 레이아웃

**Props:**
```typescript
interface DefaultLayoutProps {
  topContent?: ReactNode;  // 알림 등
  headerProps: {
    headerLeft?: ReactNode;   // 검색창 등
    headerRight?: ReactNode;  // 헤더 액션 등
  };
  children: React.ReactNode;
}
```

**구조:**
- topContent: 상단 (알림)
- Header: 헤더
- main: 메인 콘텐츠

---

### Header
**위치**: `components/layouts/Header.tsx`

**역할**: 페이지 헤더

**구조:**
- 좌측: headerLeft (검색창 등)
- 우측: headerRight (헤더 액션)

---

### HeaderActions
**위치**: `components/layouts/HeaderActions.tsx`

**역할**: 헤더 액션 버튼

**기능:**
- 관리자 모드 전환 버튼
- 장바구니 아이콘 (아이템 개수 표시)

**Zustand 리팩토링 후:**
- `cart`, `totalItemCount`는 Store에서 직접 사용
- `isAdmin`, `setIsAdmin`은 로컬 상태 유지 가능

---

## 🔧 컴포넌트 설계 원칙

### 1. 단일 책임 원칙
- 각 컴포넌트는 하나의 명확한 역할
- 재사용 가능한 작은 컴포넌트로 분리

### 2. Props 타입 정의
- 모든 컴포넌트 Props는 TypeScript 인터페이스로 정의
- 타입 안정성 보장

### 3. 조건부 렌더링
- `showProductForm`, `isAdmin` 등 상태에 따라 렌더링
- 불필요한 렌더링 방지

### 4. 함수형 업데이트
- 상태 업데이트는 함수형 패턴 사용
- 클로저 문제 방지

---

## 🎯 Zustand 리팩토링 후 예상 구조

### Props Drilling 제거 전략

**제거할 Props:**
- 전역 상태로 관리되는 값 (products, cart, coupons 등)
- 전역 액션 함수 (addToCart, removeFromCart 등)
- 계산된 값 (filledItems, totals, filteredProducts 등)

**유지할 Props:**
- 도메인 관련 props (productId, onClick 등)
- UI 설정 props (format, placeholder 등)
- 이벤트 핸들러 (단, 전역 액션이 아닌 경우)

### 컴포넌트 변경 예시

**이전 (Props Drilling):**
```typescript
<ProductList
  cart={cart}
  products={products}
  filteredProducts={filteredProducts}
  addToCart={addToCart}
/>
```

**이후 (Zustand Store 사용):**
```typescript
<ProductList />
// 컴포넌트 내부에서 Store 사용
const { cart, products, filteredProducts, addToCart } = useProductStore();
```

---

## ⚠️ 주의사항

### 1. FormInputField의 required prop
- 기본값이 `true`이므로 선택 입력 필드는 명시적으로 `required={false}` 전달

### 2. 상태 업데이트 패턴
- `ProductBasicFields`에서 함수형 업데이트 필수
- 빠른 연속 입력에서도 정확한 상태 보장

### 3. Props 빌더 함수
- Zustand 리팩토링 후 대부분 제거 가능
- Store에서 직접 사용하므로 불필요

