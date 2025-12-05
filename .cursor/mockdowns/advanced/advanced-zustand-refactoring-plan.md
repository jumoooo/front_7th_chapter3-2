# Advanced 프로젝트 리팩토링 계획 - 심화과제 (Zustand)

## 📋 목표

pull_request_template.md의 심화과제를 완료하여 다음 목표를 달성:

1. Zustand를 사용해서 전역상태관리를 구축
2. 전역상태관리를 통해 domain custom hook을 적절하게 리팩토링
3. 도메인 컴포넌트에 도메인 props는 남기고 props drilling을 유발하는 불필요한 props는 잘 제거
4. 전체적으로 분리와 재조립이 더 수월해진 결합도가 낮아진 코드

---

## ✅ 체크리스트

### 심화과제 요구사항

- [ ] Zustand를 사용해서 전역상태관리를 구축했나요?
- [ ] 전역상태관리를 통해 domain custom hook을 적절하게 리팩토링 했나요?
- [ ] 도메인 컴포넌트에 도메인 props는 남기고 props drilling을 유발하는 불필요한 props는 잘 제거했나요?
- [ ] 전체적으로 분리와 재조립이 더 수월해진 결합도가 낮아진 코드가 되었나요?

---

## 🔍 현재 상태 분석

### 1. 현재 구조

```
App.tsx (Hook 기반)
├── UI 상태 (useState)
├── Hook 사용 (5개)
│   ├── useNotification (UI Hook)
│   ├── useSearch (UI Hook)
│   ├── useProduct (Entity Hook)
│   ├── useCart (Entity Hook)
│   └── useCoupon (Entity Hook)
├── 계산된 값 (순수 함수 호출)
└── Props 빌더 함수
```

### 2. Props Drilling 현황

**StorePage:**

- `productProps`: cart, products, filteredProducts, debouncedSearchTerm, addToCart
- `cartSidebarProps`: filledItems, removeFromCart, updateQuantity, coupons, selectedCouponCode, selectorOnChange, totals, completeOrder

**AdminPage:**

- `adminProductsProps`: productForm, showProductForm, editingProduct, setEditingProduct, setProductForm, setShowProductForm, handleProductSubmit, addNotification
- `adminCouponProps`: coupons, deleteCoupon, setShowCouponForm, showCouponForm, couponForm, handleCouponSubmit, setCouponForm, addNotification, setShowCouponForm

**문제점:**

- 전역 상태가 props로 여러 단계 전달됨
- Props 빌더 함수가 복잡함
- 컴포넌트 간 결합도가 높음

---

## 🎯 Zustand Store 설계

### 1. Store 구조 설계

#### useProductStore

**상태:**

- `products: ProductWithUI[]` - 상품 목록 (localStorage 동기화)
- `productForm: ProductForm` - 상품 폼 데이터
- `editingProduct: string | null` - 편집 중인 상품 ID
- `showProductForm: boolean` - 상품 폼 표시 여부

**액션:**

- `addProduct(newProduct)` - 상품 추가
- `updateProduct(productId, updates)` - 상품 수정
- `deleteProduct(productId)` - 상품 삭제
- `startEditProduct(product)` - 상품 편집 시작
- `handleProductSubmit(e)` - 상품 폼 제출
- `setProductForm(form)` - 상품 폼 설정
- `setEditingProduct(id)` - 편집 상품 ID 설정
- `setShowProductForm(show)` - 폼 표시 여부 설정

**의존성:**

- useNotificationStore (addNotification)

#### useCartStore

**상태:**

- `cart: CartItem[]` - 장바구니 아이템 (localStorage 동기화)
- `totalItemCount: number` - 장바구니 아이템 총 개수 (계산된 값)

**계산된 값:**

- `filledItems: FilledCartItem[]` - 가격 정보가 포함된 장바구니 아이템

**액션:**

- `addToCart(product)` - 장바구니 추가
- `removeFromCart(productId)` - 장바구니에서 제거
- `updateQuantity(productId, newQuantity)` - 수량 업데이트
- `completeOrder()` - 주문 완료

**의존성:**

- useProductStore (products 참조)
- useNotificationStore (addNotification)

#### useCouponStore

**상태:**

- `coupons: Coupon[]` - 쿠폰 목록 (localStorage 동기화)
- `selectedCoupon: Coupon | null` - 선택된 쿠폰
- `couponForm: Coupon` - 쿠폰 폼 데이터
- `showCouponForm: boolean` - 쿠폰 폼 표시 여부

**액션:**

- `addCoupon(newCoupon)` - 쿠폰 추가
- `deleteCoupon(couponCode)` - 쿠폰 삭제
- `applyCoupon(coupon)` - 쿠폰 적용
- `handleCouponSubmit(e)` - 쿠폰 폼 제출
- `setSelectedCoupon(coupon)` - 선택된 쿠폰 설정
- `setCouponForm(form)` - 쿠폰 폼 설정
- `setShowCouponForm(show)` - 폼 표시 여부 설정
- `selectorOnChange(e)` - 쿠폰 선택 변경

**의존성:**

- useCartStore (cart 참조)
- useNotificationStore (addNotification)

#### useNotificationStore

**상태:**

- `notifications: Notification[]` - 알림 목록

**액션:**

- `addNotification(message, type)` - 알림 추가
- `removeNotification(id)` - 알림 제거 (자동)

**특징:**

- UI 상태이지만 전역으로 관리하여 어디서든 사용 가능

#### useSearchStore

**상태:**

- `searchTerm: string` - 검색어
- `debouncedSearchTerm: string` - 디바운스된 검색어

**액션:**

- `setSearchTerm(term)` - 검색어 설정

**특징:**

- UI 상태이지만 전역으로 관리하여 어디서든 사용 가능
- 디바운스는 Store 내부에서 처리

---

## 📝 작업 단계

### Step 1: Zustand Store 설계 ✅

- [x] useProductStore 설계
- [x] useCartStore 설계
- [x] useCouponStore 설계
- [x] useNotificationStore 설계
- [x] useSearchStore 설계

### Step 2: Store 구현 ✅

- [x] useNotificationStore 구현 (가장 단순, 의존성 없음)
- [x] useSearchStore 구현 (의존성 없음)
- [x] useProductStore 구현 (useNotificationStore 의존)
- [x] useCartStore 구현 (useProductStore, useNotificationStore 의존)
- [x] useCouponStore 구현 (useCartStore, useNotificationStore 의존)

### Step 3: localStorage 동기화 ✅

- [x] persist 미들웨어 사용
- [x] 각 Store의 localStorage 동기화 구현 (products, cart, coupons)
- [x] 초기화 시 localStorage에서 복원

### Step 4: App.tsx 리팩토링 ✅

- [x] Hook을 Store로 교체
- [x] Props 빌더 함수 유지 (기존 인터페이스 호환성 유지)
- [x] 타입 오류 및 린터 오류 확인 완료

### Step 5: 컴포넌트 리팩토링

- [ ] StorePage에서 Store 직접 사용
- [ ] AdminPage에서 Store 직접 사용
- [ ] 하위 컴포넌트에서 Store 직접 사용
- [ ] Props drilling 제거

### Step 6: 테스트 및 검증

- [ ] 기존 테스트 통과 확인 (사용자 확인 필요)
- [ ] 기능 동작 확인 (사용자 확인 필요)
- [ ] 코드 리뷰

---

## 🚧 작업 진행 상황

### 현재 단계: Step 5 - 컴포넌트 리팩토링 (Props drilling 제거)

#### 완료된 작업:

- ✅ Zustand 설치 완료 (v5.0.9)
- ✅ Store 설계 완료
- ✅ 문서 작성 완료
- ✅ useNotificationStore 구현 완료
- ✅ useSearchStore 구현 완료
- ✅ useProductStore 구현 완료 (persist 미들웨어 포함)
- ✅ useCartStore 구현 완료 (persist 미들웨어 포함)
- ✅ useCouponStore 구현 완료 (persist 미들웨어 포함)
- ✅ App.tsx 리팩토링 완료 (Hook을 Store로 교체)

#### 다음 작업:

- StorePage에서 Store 직접 사용
- AdminPage에서 Store 직접 사용
- 하위 컴포넌트에서 Store 직접 사용
- Props drilling 제거 (도메인 props는 유지)

---

## 📌 중요 원칙

1. **기존 기능 유지**: 모든 기능이 동일하게 동작해야 함
2. **테스트 코드 수정 불가**: 기존 테스트가 모두 통과해야 함
3. **점진적 리팩토링**: 한 번에 하나씩 진행
4. **의존성 방향**: entities <- features <- ui
5. **Props 전달 기준**: 도메인 props는 유지, 전역 상태는 제거

---

## 🔄 작업 기록

### 2025-01-XX

- 문서 작성 시작
- Zustand 설치 완료 (v5.0.9)
- Store 설계 완료
- Step 2 시작
