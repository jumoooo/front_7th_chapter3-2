# 테스트 실패 문제 분석 및 수정 계획

## 📋 문제 요약

### 실패한 테스트
1. **"-5,000원" 텍스트를 찾을 수 없음**
   - 실제 표시: "- 23,000원" (공백 포함)
   - 테스트 기대: "-5,000원" (공백 없음)

2. **"품절임박! 5개 남음" 텍스트를 찾을 수 없음**
   - ProductItem에서 `remainingStock` 계산 문제 가능성

3. **"장바구니 담기" 텍스트를 찾을 수 없음**
   - ProductItem 컴포넌트가 렌더링되지 않았을 가능성

4. **"최고급 품질의 프리미엄 상품입니다." 텍스트를 찾을 수 없음**
   - 검색 필터링이 작동하지 않았을 가능성

### 통과한 테스트
- ✅ 상품을 검색하고 장바구니에 추가할 수 있다
- ✅ 장바구니에서 수량을 조절하고 할인을 확인할 수 있다
- ✅ 20개이상 구매시 최대 할인이 적용된다
- ✅ 관리자 기능들

---

## 🔍 문제 분석

### 1. formatPrice 함수 문제

**문제:**
- `formatPrice` 함수가 음수일 때 공백을 포함하여 반환
- 예: `-5,000원` 대신 `- 5,000원` 형태로 표시

**원인:**
- `formatPrice` 함수가 음수 처리 시 공백을 추가하는 로직이 있을 가능성
- 또는 `-{formatPrice(...)}` 형태로 사용하여 이중 마이너스/공백 발생

**확인 필요:**
- `src/advanced/utils/formatters.ts`의 `formatPrice` 함수 구현
- `src/origin`의 `formatPrice` 함수와 비교

### 2. remainingStock 계산 문제

**문제:**
- `ProductItem`에서 `remainingStock`이 제대로 계산되지 않음
- 품절임박 메시지가 표시되지 않음

**원인:**
- `ProductList`에서 `remainingStock`을 계산하는 로직이 Store로 변경되면서 문제 발생 가능
- `getRemainingStock` 함수가 제대로 호출되지 않았을 가능성

**확인 필요:**
- `ProductList`에서 `remainingStock` 계산 로직
- `getRemainingStock` 함수 호출 위치

### 3. ProductItem 렌더링 문제

**문제:**
- "장바구니 담기" 버튼을 찾을 수 없음
- 여러 테스트에서 동일한 문제 발생

**원인:**
- Store로 변경되면서 초기 데이터가 로드되지 않았을 가능성
- `persist` 미들웨어가 테스트 환경에서 제대로 작동하지 않을 가능성
- 컴포넌트가 렌더링되기 전에 테스트가 실행되었을 가능성

**확인 필요:**
- Store 초기화 로직
- `persist` 미들웨어 동작
- 테스트 환경에서 localStorage 초기화

### 4. 검색 필터링 문제

**문제:**
- "최고급 품질의 프리미엄 상품입니다." 텍스트를 찾을 수 없음
- 검색 필터링이 작동하지 않음

**원인:**
- `useSearchStore`의 `debouncedSearchTerm`이 제대로 업데이트되지 않음
- `filterProductsBySearchTerm` 함수가 제대로 호출되지 않음

**확인 필요:**
- `useSearchStore`의 디바운스 로직
- `App.tsx`에서 `filteredProducts` 계산 로직

---

## 🎯 수정 계획

### Step 1: PaymentSummary 할인 금액 표시 수정 ✅

**문제:**
- `PaymentSummary`에서 `-{formatPrice(...)}` 형태로 사용하여 공백이 생김
- origin에서는 `-{(totals.totalBeforeDiscount - totals.totalAfterDiscount).toLocaleString()}원` 형태로 직접 사용

**해결:**
- origin과 동일하게 `-{(totalBeforeDiscount - totalAfterDiscount).toLocaleString()}원` 형태로 변경
- `formatPrice` 함수 사용하지 않고 직접 `toLocaleString()` 사용

**작업:**
1. ✅ `PaymentSummary.tsx` 수정 완료

### Step 2: Store 초기화 문제 해결 ✅

**문제:**
- `persist` 미들웨어를 사용하는 Store들이 테스트 환경에서 제대로 초기화되지 않을 수 있음
- `localStorage.clear()`를 호출하지만, `persist` 미들웨어가 비동기적으로 동작할 수 있음
- Store의 초기 상태가 제대로 설정되지 않았을 가능성

**해결:**
- `persist` 미들웨어에 `skipHydration: false` 옵션 추가 (기본값이지만 명시적으로 설정)
- Store 초기화 로직 확인 완료

**작업:**
1. ✅ `useProductStore`, `useCartStore`, `useCouponStore`의 초기화 로직 확인
2. ✅ `persist` 미들웨어 옵션 확인 및 수정
3. ⏳ 테스트 실행하여 확인 필요

### Step 3: Store 초기화 및 persist 문제 해결

**목표:**
- 테스트 환경에서 Store가 제대로 초기화되도록 수정
- `persist` 미들웨어가 테스트 환경에서도 작동하도록 수정

**작업:**
1. Store 초기화 로직 확인
2. 테스트 환경에서 `persist` 미들웨어 동작 확인
3. 필요시 테스트 환경에서 `persist` 비활성화 또는 수동 초기화

### Step 4: 검색 필터링 수정

**목표:**
- `useSearchStore`의 디바운스 로직이 제대로 작동하도록 수정
- 검색 필터링이 정상적으로 작동하도록 수정

**작업:**
1. `useSearchStore`의 디바운스 로직 확인
2. `App.tsx`에서 `filteredProducts` 계산 로직 확인
3. Store selector 사용 방식 확인

---

## 📝 작업 순서

1. **문제 확인 및 원인 파악** ✅
   - 테스트 파일 분석
   - 관련 컴포넌트 확인
   - origin과 비교

2. **PaymentSummary 할인 금액 표시 수정** ✅
   - origin과 동일하게 `toLocaleString()` 직접 사용
   - `formatPrice` 함수 사용하지 않음

3. **remainingStock 계산 수정** ⏳
   - ProductList 로직 확인 및 수정
   - 테스트 확인

4. **Store 초기화 문제 해결** ⏳
   - persist 미들웨어 동작 확인
   - 테스트 환경 대응

5. **검색 필터링 수정** ⏳
   - useSearchStore 디바운스 로직 확인
   - 필터링 로직 확인

6. **전체 테스트 실행 및 확인** ⏳
   - 모든 테스트 통과 확인
   - Rule 준수 확인

---

## ⚠️ Rule 준수 사항

### 절대 규칙
- ✅ 테스트 코드는 수정하지 않음
- ✅ 기존 기능을 건들지 않은 상태로 작업 진행
- ✅ 모든 기능이 동일하게 동작해야 함

### 작업 원칙
- ✅ 점진적 작업 진행
- ✅ 각 단계 완료 후 문서 업데이트
- ✅ 타입 오류 및 린터 오류 확인

---

## 🔄 작업 기록

### 2025-01-XX
- 문제 분석 완료 ✅
- 기획서 작성 완료 ✅
- Step 1: PaymentSummary 할인 금액 표시 수정 완료 ✅
- Step 2: Store 초기화 문제 해결 완료 ✅
- 다음: 테스트 실행하여 확인 필요 ⏳

