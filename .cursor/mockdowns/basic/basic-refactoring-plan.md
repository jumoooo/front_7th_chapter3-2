# Basic 프로젝트 리팩토링 계획 - 기본과제

## 📋 목표

pull_request_template.md의 기본과제를 완료하여 다음 목표를 달성:

1. Component에서 비즈니스 로직을 분리하기
2. 비즈니스 로직에서 특정 엔티티만 다루는 계산을 분리하기
3. 뷰데이터와 엔티티데이터의 분리에 대한 이해
4. entities -> features -> UI 계층에 대한 이해

---

## ✅ 체크리스트

### 기본과제 요구사항
- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요? ✅
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요? ✅
- [x] 계산함수는 순수함수로 작성이 되었나요? ✅
- [x] 특정 Entity만 다루는 함수는 분리되어 있나요? ✅
- [x] 특정 Entity만 다루는 Component와 UI를 다루는 Component는 분리되어 있나요? ✅
- [x] 데이터 흐름에 맞는 계층구조를 이루고 의존성이 맞게 작성이 되었나요? ✅

---

## 🔍 현재 상태 분석

### 1. 현재 구조
```
App.tsx (모든 상태와 로직 포함)
├── 상태 관리 (useState) - 15개 상태
├── 비즈니스 로직 (함수들) - 10개 함수
├── 계산 로직 (순수 함수 호출) - domain/ 폴더
└── UI 렌더링
```

### 2. 상태 목록 (App.tsx)
**Entity 상태:**
- `products` - 상품 목록
- `productForm` - 상품 폼 데이터
- `editingProduct` - 편집 중인 상품 ID
- `cart` - 장바구니 아이템
- `coupons` - 쿠폰 목록
- `couponForm` - 쿠폰 폼 데이터
- `selectedCoupon` - 선택된 쿠폰

**UI 상태:**
- `isAdmin` - 관리자 모드 여부
- `activeTab` - 관리자 탭 (products/coupons)
- `showProductForm` - 상품 폼 표시 여부
- `showCouponForm` - 쿠폰 폼 표시 여부
- `notifications` - 알림 목록
- `searchTerm` - 검색어
- `debouncedSearchTerm` - 디바운스된 검색어
- `totalItemCount` - 장바구니 아이템 총 개수

### 3. 비즈니스 로직 함수 목록
**상품 관련:**
- `addProduct` - 상품 추가
- `updateProduct` - 상품 수정
- `deleteProduct` - 상품 삭제
- `startEditProduct` - 상품 편집 시작
- `handleProductSubmit` - 상품 폼 제출

**장바구니 관련:**
- `addToCart` - 장바구니 추가
- `removeFromCart` - 장바구니에서 제거
- `updateQuantity` - 수량 업데이트
- `completeOrder` - 주문 완료

**쿠폰 관련:**
- `addCoupon` - 쿠폰 추가
- `deleteCoupon` - 쿠폰 삭제
- `applyCoupon` - 쿠폰 적용
- `handleCouponSubmit` - 쿠폰 폼 제출

**기타:**
- `addNotification` - 알림 추가
- `selectorOnChange` - 쿠폰 선택 변경

### 4. 계산 함수 (이미 분리됨 ✅)
**domain/cart/cartUtils.ts:**
- `calculateCartTotal` - 장바구니 총액 계산
- `calculateItemPriceDetails` - 아이템 가격 세부 정보
- `getRemainingStock` - 재고 잔량
- `getMaxApplicableDiscount` - 최대 할인율
- `applyCoupon` - 쿠폰 적용 계산

**domain/product/productUtils.ts:**
- `filterProductsBySearchTerm` - 상품 필터링

**domain/cart/couponUtils.ts:**
- `formatCouponName` - 쿠폰 이름 포맷팅

### 5. 문제점
- ❌ Component(App.tsx)에 비즈니스 로직이 혼재
- ❌ 상태 관리와 로직이 분리되지 않음
- ✅ 계산 함수는 순수 함수로 분리됨 (domain/ 폴더)
- ❌ Entity별 hook이 없음
- ❌ entities -> features -> UI 계층 구조가 명확하지 않음
- ❌ localStorage 동기화 로직이 App.tsx에 있음

---

## 🎯 리팩토링 목표 구조

### 목표 계층 구조
```
entities/              # 엔티티 데이터 타입 및 순수 함수
├── product/
│   ├── productTypes.ts
│   └── productUtils.ts
├── cart/
│   ├── cartTypes.ts
│   └── cartUtils.ts
└── coupon/
    ├── couponTypes.ts
    └── couponUtils.ts

features/              # 도메인별 기능 (hook)
├── product/
│   └── useProduct.ts
├── cart/
│   └── useCart.ts
└── coupon/
    └── useCoupon.ts

ui/                    # UI 컴포넌트
├── components/
├── pages/
└── layouts/
```

### Hook 책임 분리

#### 1. useNotification
**책임**: 알림 상태 및 추가/제거 로직
**상태:**
- `notifications: Notification[]`
**함수:**
- `addNotification(message, type)`
**의존성:** 없음 (가장 단순)

#### 2. useSearch
**책임**: 검색어 상태 및 디바운스 처리
**상태:**
- `searchTerm: string`
- `debouncedSearchTerm: string`
**함수:**
- `setSearchTerm(value)`
**의존성:** 없음

#### 3. useProduct
**책임**: 상품 Entity 상태 및 CRUD 로직
**상태:**
- `products: ProductWithUI[]` (localStorage 동기화)
- `productForm: ProductForm`
- `editingProduct: string | null`
- `showProductForm: boolean`
**함수:**
- `addProduct(newProduct)`
- `updateProduct(productId, updates)`
- `deleteProduct(productId)`
- `startEditProduct(product)`
- `handleProductSubmit(e)`
- `setProductForm(value)`
- `setEditingProduct(value)`
- `setShowProductForm(value)`
**의존성:** useNotification

#### 4. useCart
**책임**: 장바구니 Entity 상태 및 로직
**상태:**
- `cart: CartItem[]` (localStorage 동기화)
- `totalItemCount: number` (계산된 값)
**함수:**
- `addToCart(product)`
- `removeFromCart(productId)`
- `updateQuantity(productId, newQuantity)`
- `completeOrder()`
- `filledItems: FilledCartItem[]` (계산된 값)
**의존성:** useNotification, useProduct (products 참조)

#### 5. useCoupon
**책임**: 쿠폰 Entity 상태 및 CRUD 로직
**상태:**
- `coupons: Coupon[]` (localStorage 동기화)
- `selectedCoupon: Coupon | null`
- `couponForm: Coupon`
- `showCouponForm: boolean`
**함수:**
- `addCoupon(newCoupon)`
- `deleteCoupon(couponCode)`
- `applyCoupon(coupon)`
- `handleCouponSubmit(e)`
- `setSelectedCoupon(coupon)`
- `setCouponForm(value)`
- `setShowCouponForm(value)`
**의존성:** useNotification, useCart (cart, selectedCoupon 참조)

---

## 📝 작업 단계

### Step 1: 현재 상태 상세 분석 ✅
- [x] App.tsx의 모든 상태와 로직 파악
- [x] domain 폴더의 순수 함수 확인
- [x] Entity별로 그룹핑
- [x] 의존성 관계 파악

**분석 결과:**
- Entity 상태: products, productForm, editingProduct, cart, coupons, couponForm, selectedCoupon
- UI 상태: isAdmin, activeTab, showProductForm, showCouponForm, notifications, searchTerm, debouncedSearchTerm, totalItemCount
- 계산 함수는 이미 domain/ 폴더에 순수 함수로 분리됨 ✅

### Step 2: Hook 설계 🔄
- [x] useProduct hook 설계
- [x] useCart hook 설계
- [x] useCoupon hook 설계
- [x] useNotification hook 설계
- [x] useSearch hook 설계

### Step 3: Hook 구현 ✅
- [x] useNotification 구현 ✅
- [x] useSearch 구현 ✅
- [x] useProduct 구현 ✅
- [x] useCart 구현 ✅
- [x] useCoupon 구현 ✅

### Step 4: App.tsx 리팩토링 ✅
- [x] Hook으로 로직 이동 ✅
- [x] App.tsx는 Hook 조합만 수행 ✅
- [x] Props 빌더 함수 유지 ✅

### Step 5: 테스트 및 검증 ✅
- [x] 기존 테스트 통과 확인 ✅
- [x] 기능 동작 확인 ✅
- [x] 코드 리뷰 완료

---

## 🚧 작업 진행 상황

### 현재 단계: ✅ 모든 작업 완료

#### 완료된 작업:
- ✅ App.tsx의 모든 상태와 로직 파악
- ✅ Entity별 그룹핑 완료
- ✅ Hook 설계 완료
- ✅ 모든 Hook 구현 완료 (useNotification, useSearch, useProduct, useCart, useCoupon)
- ✅ App.tsx 리팩토링 완료 (Hook 사용)
- ✅ 테스트 전부 통과 확인

#### 리팩토링 결과:
**이전 App.tsx:**
- 530줄, 모든 상태와 로직 포함
- 비즈니스 로직이 컴포넌트에 혼재

**리팩토링 후 App.tsx:**
- 206줄, Hook 조합만 수행
- 비즈니스 로직은 Hook으로 분리
- entities -> features -> UI 계층 구조 명확

#### 최종 검증:
- ✅ 테스트 전부 통과
- ✅ 기존 기능 유지
- ✅ 코드 구조 개선

---

## 📌 중요 원칙

1. **기존 기능 유지**: 모든 기능이 동일하게 동작해야 함
2. **테스트 코드 수정 불가**: 기존 테스트가 모두 통과해야 함
3. **점진적 리팩토링**: 한 번에 하나씩 진행
4. **의존성 방향**: entities <- features <- ui

---

## 🔄 작업 기록

### 2025-01-XX
- 문서 작성 시작
- 현재 상태 분석 시작
- Hook 설계 완료
- 모든 Hook 구현 완료
- App.tsx 리팩토링 완료

## 📊 리팩토링 결과 요약

### 코드 라인 수 변화
- **이전 App.tsx**: 530줄
- **리팩토링 후 App.tsx**: 206줄 (61% 감소)
- **새로 생성된 Hook 파일**: 5개 (약 400줄)

### 계층 구조 개선
**이전:**
```
App.tsx (모든 것 포함)
```

**리팩토링 후:**
```
entities/ (domain/)
  └─ 순수 함수 (이미 존재)
features/ (hooks/)
  ├─ useProduct
  ├─ useCart
  ├─ useCoupon
  ├─ useNotification
  └─ useSearch
ui/ (components/, pages/)
  └─ App.tsx (Hook 조합만)
```

### 체크리스트 달성도
- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요? ✅
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요? ✅
- [x] 계산함수는 순수함수로 작성이 되었나요? ✅ (이미 완료)
- [x] 특정 Entity만 다루는 함수는 분리되어 있나요? ✅
- [x] 특정 Entity만 다루는 Component와 UI를 다루는 Component는 분리되어 있나요? ✅ (이미 완료)
- [x] 데이터 흐름에 맞는 계층구조를 이루고 의존성이 맞게 작성이 되었나요? ✅

