# 테스트 실패 종합 분석 및 수정 계획

## 📋 문제 요약

### 테스트 결과
- ✅ 통과: 2개 테스트
- ❌ 실패: 12개 테스트

### 주요 문제
1. **"-5,000원" 텍스트 찾기 실패**
   - 실제 표시: "- 23,000 원" (공백 포함)
   - 원인: `toLocaleString()`이 공백을 추가하는 것이 아니라, JSX에서 공백이 생김

2. **"품절임박! 5개 남음" 텍스트 찾기 실패**
   - 원인: Store 초기화 문제로 상품이 제대로 로드되지 않음

3. **기타 여러 테스트 실패**
   - 원인: `persist` 미들웨어가 테스트 환경에서 비동기적으로 동작하여 초기 상태가 제대로 로드되지 않음

---

## 🔍 근본 원인 분석

### 1. persist 미들웨어의 비동기 동작

**문제:**
- Zustand의 `persist` 미들웨어는 localStorage에서 데이터를 비동기적으로 복원
- origin은 `useState`의 lazy initializer를 사용하여 동기적으로 localStorage에서 읽음
- 테스트 환경에서 `localStorage.clear()` 후 Store가 초기화되기 전에 컴포넌트가 렌더링됨

**해결 방안:**
1. `persist` 미들웨어의 `storage`를 동기적으로 만들기
2. Store 초기화를 보장하는 로직 추가
3. 테스트 환경에서 persist를 비활성화하고 수동으로 초기화

### 2. PaymentSummary의 공백 문제

**문제:**
- `-{(totalBeforeDiscount - totalAfterDiscount).toLocaleString()}원` 형태로 사용
- JSX에서 `-`와 숫자 사이에 공백이 생김

**해결:**
- 템플릿 리터럴을 사용하여 공백 없이 연결

---

## 🎯 수정 계획

### Step 1: PaymentSummary 공백 문제 수정 ✅

**작업:**
- 템플릿 리터럴 사용하여 공백 제거

### Step 2: persist 미들웨어 동기화 문제 해결 ✅

**문제:**
- persist 미들웨어가 비동기적으로 동작하여 테스트 환경에서 초기 상태가 제대로 로드되지 않음
- origin은 `useState`의 lazy initializer를 사용하여 동기적으로 localStorage에서 읽음

**해결:**
- Store 초기화 시 localStorage에서 동기적으로 읽는 함수 추가 (origin과 동일한 방식)
- persist 미들웨어의 localStorage 키를 origin과 동일하게 변경 ("products", "cart", "coupons")
- 초기 상태를 동기적으로 설정하여 테스트 환경에서도 제대로 작동하도록 수정

**작업:**
1. ✅ `getInitialProducts`, `getInitialCart`, `getInitialCoupons` 함수 추가
2. ✅ Store 초기화 시 동기적으로 localStorage에서 읽기
3. ✅ localStorage 키를 origin과 동일하게 변경

### Step 3: Store 초기화 보장

**작업:**
1. Store의 초기 상태가 제대로 설정되도록 보장
2. `persist` 미들웨어가 localStorage에서 복원 실패 시 초기 상태 사용

---

## 📝 작업 순서

1. **PaymentSummary 공백 문제 수정** ✅
   - 템플릿 리터럴 사용하여 공백 제거

2. **persist 미들웨어 동기화 문제 해결** ✅
   - Store 초기화 시 localStorage에서 동기적으로 읽는 함수 추가
   - localStorage 키를 origin과 동일하게 변경

3. **Store 초기화 보장** ✅
   - `getInitialProducts`, `getInitialCart`, `getInitialCoupons` 함수 추가
   - origin과 동일한 방식으로 동기적 초기화

4. **전체 테스트 실행 및 확인** ⏳
   - 사용자 확인 필요

---

## ⚠️ Rule 준수 사항

- ✅ 테스트 코드는 수정하지 않음
- ✅ 기존 기능을 건들지 않은 상태로 작업 진행
- ✅ 모든 기능이 동일하게 동작해야 함

