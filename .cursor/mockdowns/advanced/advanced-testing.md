# Advanced 프로젝트 - 테스트 구조

## 📍 테스트 파일 위치

- `src/advanced/__tests__/origin.test.tsx` - 통합 테스트

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

### 2. localStorage 저장 테스트
```typescript
test("상품, 장바구니, 쿠폰이 localStorage에 저장된다", () => {
  render(<App />);
  
  // 장바구니에 추가
  fireEvent.click(screen.getAllByText("장바구니 담기")[0]);
  expect(localStorage.getItem("cart")).toBeTruthy();
  
  // 관리자 모드로 전환하여 새 상품 추가
  fireEvent.click(screen.getByText("관리자 페이지로"));
  fireEvent.click(screen.getByText("새 상품 추가"));
  
  // 폼 입력 (상품명, 가격, 재고만 입력 - 설명은 선택)
  // ...
  fireEvent.click(screen.getByText("추가"));
  
  // localStorage 확인
  expect(localStorage.getItem("products")).toBeTruthy();
  const products = JSON.parse(localStorage.getItem("products"));
  expect(products.some((p) => p.name === "저장 테스트")).toBe(true);
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

### 3. 테스트 코드 수정 불가
- **절대 규칙**: 테스트 코드는 수정할 수 없다
- Zustand 리팩토링 후에도 테스트는 동일하게 통과해야 함

---

## 🚀 Zustand 리팩토링 후 테스트

### 예상 변경사항
- 테스트 코드는 수정하지 않음
- 구현만 변경하여 테스트 통과
- Zustand Store 사용 시에도 동일한 동작 보장

### 주의사항
- Store 초기화 시 localStorage 동기화 확인
- Store 상태 변경 시 컴포넌트 업데이트 확인
- 비동기 업데이트 타이밍 확인

---

## 📊 테스트 커버리지

### 테스트 범위
- ✅ 고객 쇼핑 플로우 (검색, 장바구니 추가, 수량 조절)
- ✅ 관리자 기능 (상품 추가/수정/삭제, 쿠폰 생성/삭제)
- ✅ 입력 검증 (가격, 재고)
- ✅ localStorage 동기화
- ✅ 할인 계산
- ✅ 쿠폰 적용

---

## 🧪 테스트 실행

```bash
# Advanced 버전 테스트 실행
npm run test:advanced

# 테스트 UI 실행
npm run test:ui

# 특정 테스트 실행
npm test -- src/advanced/__tests__/origin.test.tsx
```

