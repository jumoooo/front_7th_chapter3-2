# Advanced 프로젝트 개요 문서

## 📋 프로젝트 정보

### 프로젝트명
`frontend_7th_chapter3-2` - Advanced 버전

### 프로젝트 목적
basic 폴더의 Hook 기반 구조를 Zustand를 사용한 전역 상태 관리로 리팩토링한 버전입니다. Props drilling을 제거하고 결합도를 낮추는 것이 목표입니다.

### 프로젝트 위치
`src/advanced/`

### 현재 상태
- ✅ basic 프로젝트의 모든 내용이 복사됨
- ✅ Hook 기반 구조 유지
- ✅ Zustand 설치 완료 (v5.0.9)
- ⏳ Zustand Store 설계 및 구현 예정
- ⏳ 전역 상태 관리로 리팩토링 예정

---

## 🏗️ 프로젝트 구조

```
src/advanced/
├── App.tsx                    # 메인 애플리케이션 컴포넌트 (Hook 기반)
├── main.tsx                   # React 앱 진입점
├── __tests__/                 # 테스트 파일
│   └── origin.test.tsx        # 통합 테스트 (origin과 동일한 테스트)
├── components/                # UI 컴포넌트
│   ├── admin/                 # 관리자 페이지 컴포넌트
│   ├── cart/                  # 장바구니 관련 컴포넌트
│   ├── common/                # 공통 컴포넌트
│   ├── icon/                  # 아이콘 컴포넌트
│   ├── layouts/               # 레이아웃 컴포넌트
│   ├── notifications/         # 알림 컴포넌트
│   └── product/               # 상품 목록 컴포넌트
├── pages/                     # 페이지 컴포넌트
│   ├── StorePage.tsx          # 쇼핑몰 페이지
│   └── AdminPage.tsx          # 관리자 페이지
├── domain/                    # 도메인 로직 및 타입
│   ├── cart/                  # 장바구니 도메인
│   ├── product/               # 상품 도메인
│   └── notification/          # 알림 도메인
├── hooks/                     # Custom Hook (현재 구조)
│   ├── useProduct.ts          # 상품 Entity Hook
│   ├── useCart.ts             # 장바구니 Entity Hook
│   ├── useCoupon.ts           # 쿠폰 Entity Hook
│   ├── useNotification.ts     # 알림 UI Hook
│   └── useSearch.ts           # 검색 UI Hook
├── utils/                     # 유틸리티 함수
│   └── formatters.ts         # 포맷팅 함수
└── constans/                  # 상수 정의
    └── constans.ts            # 상수 (PriceType, DiscountType 등)
```

---

## 🛠️ 기술 스택

### 프레임워크 및 라이브러리
- **React**: `^19.1.1`
- **React DOM**: `^19.1.1`
- **TypeScript**: `^5.9.2`
- **Vite**: `^7.0.6` (빌드 도구)
- **Zustand**: `^5.0.9` (전역 상태 관리) ✅

### 개발 도구
- **Vitest**: `^3.2.4` (테스트 프레임워크)
- **@testing-library/react**: `^16.3.0` (React 테스트 라이브러리)
- **@testing-library/jest-dom**: `^6.6.4` (DOM 매처)
- **@vitejs/plugin-react-swc**: `^3.11.0` (SWC 플러그인)

### 패키지 관리자
- **pnpm** (주로 사용)

### 스타일링
- **Tailwind CSS** (인라인 클래스 사용)

---

## 🚀 실행 스크립트

```bash
# Advanced 버전 개발 서버 실행
npm run dev:advanced

# Advanced 버전 테스트 실행
npm run test:advanced

# 테스트 UI 실행
npm run test:ui

# 빌드
npm run build

# 린트
npm run lint
```

---

## 🎯 심화과제 목표

### 요구사항 (pull_request_template.md)
1. Zustand를 사용해서 전역상태관리를 구축
2. 전역상태관리를 통해 domain custom hook을 적절하게 리팩토링
3. 도메인 컴포넌트에 도메인 props는 남기고 props drilling을 유발하는 불필요한 props는 잘 제거
4. 전체적으로 분리와 재조립이 더 수월해진 결합도가 낮아진 코드

### 현재 상태
- ✅ Hook 기반 구조 완료 (basic에서 복사)
- ⏳ Zustand 설치 필요
- ⏳ Zustand Store 설계 필요
- ⏳ Hook을 Zustand Store로 리팩토링 필요
- ⏳ Props drilling 제거 필요

---

## 📦 현재 Hook 구조

### Entity Hook (전역 상태로 이동 예정)
- **useProduct**: 상품 Entity 상태 및 CRUD 로직
- **useCart**: 장바구니 Entity 상태 및 로직
- **useCoupon**: 쿠폰 Entity 상태 및 CRUD 로직

### UI Hook (로컬 상태 유지 가능)
- **useNotification**: 알림 UI 상태
- **useSearch**: 검색어 UI 상태

---

## 🔄 리팩토링 계획

### 1. Zustand Store 설계
- `useProductStore` - 상품 전역 상태
- `useCartStore` - 장바구니 전역 상태
- `useCouponStore` - 쿠폰 전역 상태
- `useNotificationStore` - 알림 전역 상태 (선택적)
- `useSearchStore` - 검색어 전역 상태 (선택적)

### 2. Props Drilling 제거
- 전역 상태로 관리되는 값은 props로 전달하지 않음
- 도메인 관련 props는 유지 (예: `productId`, `onClick` 등)
- 불필요한 props 제거

### 3. Hook 리팩토링
- Entity Hook을 Zustand Store로 변환
- UI Hook은 필요에 따라 유지 또는 Store로 변환

---

## ⚠️ 주의사항

### 1. 기존 기능 보존
- 모든 기능이 동일하게 동작해야 함
- 테스트 코드 수정 불가
- 기존 테스트 모두 통과해야 함

### 2. Props 전달 기준
- **유지해야 할 props**: 도메인 관련 props (productId, onClick 등)
- **제거할 props**: 전역 상태로 관리되는 값 (products, cart, coupons 등)

### 3. 점진적 리팩토링
- 한 번에 하나씩 Store로 변환
- 각 단계마다 테스트 확인
- 문서 업데이트

---

## 📝 다음 문서
- [도메인 모델 및 타입](./advanced-domain-types.md)
- [컴포넌트 구조](./advanced-components.md)
- [비즈니스 로직](./advanced-business-logic.md)
- [상태 관리](./advanced-state-management.md)
- [테스트 구조](./advanced-testing.md)

---

## ✅ 설치 완료

### Zustand 설치 완료
- ✅ Zustand `^5.0.9` 설치 완료
- ✅ `package.json`에 의존성 추가 확인
- ✅ React 19.1.1과 호환 확인
- ✅ 버전 충돌 없음

