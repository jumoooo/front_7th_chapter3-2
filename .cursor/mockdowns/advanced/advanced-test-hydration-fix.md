# 테스트 환경 Store Hydration 문제 해결

## 📋 문제 분석

### 증상
- `pnpm dev:advanced` 실행 시 정상 작동
- 테스트 실행 시 "최고급 품질의 프리미엄 상품입니다." 텍스트를 찾을 수 없음
- 여러 테스트에서 동일한 문제 발생

### 원인
1. **persist 미들웨어의 비동기 hydration**
   - persist 미들웨어가 localStorage에서 데이터를 비동기적으로 복원
   - 테스트 환경에서 hydration이 완료되기 전에 컴포넌트가 렌더링됨
   - Store의 초기 상태가 제대로 설정되지 않음

2. **Store Selector 문제**
   - Zustand의 selector가 제대로 작동하지 않아 컴포넌트가 리렌더링되지 않음
   - Store 상태 변경이 컴포넌트에 반영되지 않음

3. **검색 필터링 문제**
   - `useSearchStore`의 디바운스 로직이 테스트 환경에서 제대로 작동하지 않음
   - `debouncedSearchTerm`이 업데이트되지 않아 필터링이 작동하지 않음

---

## 🎯 해결 방안

### 방안 1: persist 미들웨어의 hydration 완료 대기
- `persist` 미들웨어의 `onRehydrateStorage` 콜백 사용
- 테스트에서 hydration 완료를 기다리는 로직 추가

### 방안 2: Store 초기화 보장 (권장)
- persist 미들웨어를 사용하되, 초기 상태를 동기적으로 설정
- `getInitialProducts` 등의 함수를 Store 생성 시점에 호출하여 초기 상태 보장

### 방안 3: 테스트 환경에서 persist 비활성화
- 테스트 환경에서는 persist를 사용하지 않고 직접 초기화
- 프로덕션 환경에서만 persist 사용

---

## 📝 수정 계획

### Step 1: Store 초기화 보장
- `getInitialProducts`, `getInitialCart`, `getInitialCoupons` 함수가 Store 생성 시점에 호출되도록 보장
- persist 미들웨어의 `onRehydrateStorage` 콜백을 사용하여 hydration 완료 확인

### Step 2: 검색 필터링 수정
- `useSearchStore`의 디바운스 로직이 테스트 환경에서도 작동하도록 수정
- 타이머가 제대로 작동하도록 보장

### Step 3: 테스트 실행 및 확인
- 전체 테스트 실행하여 문제 해결 확인

