# Basic 프로젝트 - 테스트 구조

## 📍 테스트 파일 위치

- `src/basic/__tests__/origin.test.tsx` - 통합 테스트

---

## 🧪 테스트 프레임워크

### 사용 도구
- **Vitest**: `^3.2.4` - 테스트 러너
- **@testing-library/react**: `^16.3.0` - React 컴포넌트 테스트
- **@testing-library/jest-dom**: `^6.6.4` - DOM 매처
- **jsdom**: `^26.1.0` - DOM 환경 시뮬레이션

### 설정
```typescript
// vite.config.ts
export default mergeConfig(
  defineConfig({
    plugins: [react()],
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts'
    },
  })
)
```

---

## 📋 테스트 구조

### 테스트 그룹

```typescript
describe("쇼핑몰 앱 통합 테스트", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("고객 쇼핑 플로우", () => {
    // 고객 관련 테스트
  });

  describe("관리자 기능", () => {
    // 관리자 관련 테스트
  });

  describe("로컬스토리지 동기화", () => {
    // localStorage 관련 테스트
  });
});
```

---

## 🛍️ 고객 쇼핑 플로우 테스트

### 1. 상품 검색 및 장바구니 추가
```typescript
test("상품을 검색하고 장바구니에 추가할 수 있다", async () => {
  render(<App />);
  
  // 검색창에 "프리미엄" 입력
  const searchInput = screen.getByPlaceholderText("상품 검색...");
  fireEvent.change(searchInput, { target: { value: "프리미엄" } });
  
  // 디바운스 대기 (500ms)
  await waitFor(
    () => {
      expect(
        screen.getByText("최고급 품질의 프리미엄 상품입니다.")
      ).toBeInTheDocument();
    },
    { timeout: 600 }
  );
  
  // 장바구니에 추가
  const addButtons = screen.getAllByText("장바구니 담기");
  fireEvent.click(addButtons[0]);
  
  // 알림 확인
  await waitFor(() => {
    expect(screen.getByText("장바구니에 담았습니다")).toBeInTheDocument();
  });
});
```

**중요:**
- `waitFor`로 비동기 업데이트 대기
- 디바운스 시간(500ms) 고려하여 timeout 설정

---

### 2. 장바구니 수량 조절 및 할인 확인
```typescript
test("장바구니에서 수량을 조절하고 할인을 확인할 수 있다", async () => {
  // 장바구니에 아이템 추가
  // 수량 증가/감소 테스트
  // 할인 정보 확인
});
```

---

## 👨‍💼 관리자 기능 테스트

### 1. 상품 추가
```typescript
test("새 상품을 추가할 수 있다", () => {
  // 관리자 모드 전환
  fireEvent.click(screen.getByText("관리자 페이지로"));
  
  // 새 상품 추가 버튼 클릭
  fireEvent.click(screen.getByText("새 상품 추가"));
  
  // 폼 입력
  // 제출
  // 확인
});
```

---

### 2. 상품 수정
```typescript
test("기존 상품을 수정할 수 있다", () => {
  // 수정 버튼 클릭
  // 폼 값 변경
  // 제출
  // 확인
});
```

---

### 3. 상품 삭제
```typescript
test("상품을 삭제할 수 있다", () => {
  // 삭제 버튼 클릭
  // 확인
});
```

---

### 4. 가격 입력 검증
```typescript
test("상품의 가격 입력 시 숫자만 허용된다", async () => {
  // 상품 수정
  fireEvent.click(screen.getAllByText("수정")[0]);
  
  const priceInput = screen.getAllByPlaceholderText("숫자만 입력")[0];
  
  // 문자와 숫자 혼합 입력 시도 - 숫자만 남음
  fireEvent.change(priceInput, { target: { value: "abc123def" } });
  expect(priceInput.value).toBe("10000"); // 유효하지 않은 입력은 무시됨
  
  // 숫자만 입력
  fireEvent.change(priceInput, { target: { value: "123" } });
  expect(priceInput.value).toBe("123");
});
```

**중요:**
- `onChange` 핸들러에서 `/^\d+$/` 정규식으로 숫자만 허용
- 유효하지 않은 입력은 이전 값 유지

---

### 5. 쿠폰 생성
```typescript
test("새 쿠폰을 생성할 수 있다", () => {
  // 쿠폰 탭으로 이동
  // 쿠폰 생성 버튼 클릭
  // 폼 입력
  // 생성
  // 확인
});
```

---

## 💾 로컬스토리지 동기화 테스트

### 1. localStorage 저장 테스트
```typescript
test("상품, 장바구니, 쿠폰이 localStorage에 저장된다", () => {
  render(<App />);
  
  // 장바구니에 추가
  fireEvent.click(screen.getAllByText("장바구니 담기")[0]);
  expect(localStorage.getItem("cart")).toBeTruthy();
  expect(JSON.parse(localStorage.getItem("cart"))).toHaveLength(1);
  
  // 관리자 모드로 전환하여 새 상품 추가
  fireEvent.click(screen.getByText("관리자 페이지로"));
  fireEvent.click(screen.getByText("새 상품 추가"));
  
  // 폼 입력 (상품명, 가격, 재고만 입력 - 설명은 선택)
  const labels = screen.getAllByText("상품명");
  const nameLabel = labels.find((el) => el.tagName === "LABEL");
  const nameInput = nameLabel.closest("div").querySelector("input");
  fireEvent.change(nameInput, { target: { value: "저장 테스트" } });
  
  const priceInput = screen.getAllByPlaceholderText("숫자만 입력")[0];
  fireEvent.change(priceInput, { target: { value: "10000" } });
  
  const stockInput = screen.getAllByPlaceholderText("숫자만 입력")[1];
  fireEvent.change(stockInput, { target: { value: "10" } });
  
  fireEvent.click(screen.getByText("추가"));
  
  // localStorage 확인
  expect(localStorage.getItem("products")).toBeTruthy();
  const products = JSON.parse(localStorage.getItem("products"));
  expect(products.some((p) => p.name === "저장 테스트")).toBe(true);
});
```

**중요:**
- 설명 필드는 입력하지 않아도 폼 제출 가능 (`required={false}`)
- `fireEvent.change`는 동기적으로 실행되지만 상태 업데이트는 비동기
- `handleProductSubmit`이 최신 `productForm`을 참조하도록 설계

---

### 2. 페이지 새로고침 후 데이터 유지
```typescript
test("페이지 새로고침 후에도 데이터가 유지된다", () => {
  // 데이터 추가
  // 컴포넌트 재렌더링
  // 데이터 확인
});
```

---

## ⚠️ 테스트 주의사항

### 1. localStorage 초기화
```typescript
beforeEach(() => {
  localStorage.clear();
});
```
- 각 테스트 전에 localStorage 초기화
- 테스트 간 간섭 방지

### 2. 비동기 처리
```typescript
await waitFor(() => {
  expect(screen.getByText("텍스트")).toBeInTheDocument();
}, { timeout: 600 });
```
- `waitFor`로 비동기 업데이트 대기
- 디바운스 시간 고려하여 timeout 설정

### 3. fireEvent vs userEvent
- 현재는 `fireEvent` 사용
- 더 현실적인 사용자 상호작용을 원하면 `userEvent` 고려

### 4. 설명 필드 입력 불필요
- 테스트에서 설명 필드는 입력하지 않아도 됨
- `FormInputField`의 `required={false}` 설정으로 폼 제출 가능

---

## 🐛 알려진 테스트 이슈 및 해결

### 이슈 1: handleProductSubmit 클로저 문제
**문제:**
- `useCallback`으로 감싸진 `handleProductSubmit`이 이전 `productForm` 참조
- 빠른 연속 입력 시 최신 값이 반영되지 않음

**해결:**
- `useCallback` 제거하여 매 렌더링마다 새로 생성
- 최신 `productForm` 참조 보장

### 이슈 2: FormInputField required 속성
**문제:**
- 모든 필드가 `required`로 설정되어 설명 필드 없이 폼 제출 불가

**해결:**
- `FormInputField`에 `required` prop 추가 (기본값: `true`)
- 설명 필드에 `required={false}` 전달

### 이슈 3: 상태 업데이트 타이밍
**문제:**
- `fireEvent.change` 연속 호출 시 상태 업데이트 누락

**해결:**
- 함수형 업데이트 패턴 사용
- `setProductForm((prev) => ({ ...prev, ... }))`

---

## 📊 테스트 커버리지

### 테스트 범위
- ✅ 고객 쇼핑 플로우 (검색, 장바구니 추가, 수량 조절)
- ✅ 관리자 기능 (상품 추가/수정/삭제, 쿠폰 생성/삭제)
- ✅ 입력 검증 (가격, 재고)
- ✅ localStorage 동기화
- ✅ 할인 계산
- ✅ 쿠폰 적용

### 미테스트 영역
- 에러 처리
- 경계값 테스트
- 접근성 테스트

---

## 🚀 테스트 실행

```bash
# Basic 버전 테스트 실행
npm run test:basic

# 테스트 UI 실행
npm run test:ui

# 특정 테스트 실행
npm test -- src/basic/__tests__/origin.test.tsx

# 특정 테스트 케이스 실행
npm test -- src/basic/__tests__/origin.test.tsx -t "상품, 장바구니, 쿠폰이 localStorage에 저장된다"
```

