# Basic 프로젝트 - 주요 이슈 및 해결 방법

## 🐛 해결된 주요 이슈

### 이슈 1: handleProductSubmit 클로저 문제

#### 문제 상황
테스트에서 상품 추가 시 `productForm.name`이 빈 문자열로 저장되는 문제 발생.

#### 원인 분석
1. `handleProductSubmit`이 `useCallback`으로 감싸져 있음
2. `productForm`이 의존성 배열에 있어도 클로저로 이전 값 참조 가능
3. `buildAdminProductsSection()`이 매 렌더링마다 호출되면서 이전 `handleProductSubmit` 참조

#### 해결 방법
```typescript
// ❌ 이전 (문제 있음)
const handleProductSubmit = useCallback(
  (e: React.FormEvent) => {
    // productForm 참조
  },
  [editingProduct, productForm, updateProduct, addProduct]
);

// ✅ 수정 후
const handleProductSubmit = (e: React.FormEvent) => {
  // 매 렌더링마다 새로 생성되어 최신 productForm 참조
};
```

**결과:**
- 매 렌더링마다 새로운 함수 생성
- 항상 최신 `productForm` 상태 참조
- 클로저 문제 해결

---

### 이슈 2: FormInputField required 속성

#### 문제 상황
테스트에서 설명 필드를 입력하지 않아도 폼 제출이 되어야 하는데, `required` 속성으로 인해 제출 불가.

#### 원인 분석
1. `FormInputField` 컴포넌트에 `required`가 하드코딩됨
2. 모든 필드가 필수 입력으로 설정됨
3. origin에서는 설명 필드에 `required` 속성이 없음

#### 해결 방법
```typescript
// ❌ 이전 (문제 있음)
interface FormInputFieldProps {
  // required prop 없음
}

export const FormInputField = ({ ... }) => {
  return (
    <input
      required  // 하드코딩
    />
  );
};

// ✅ 수정 후
interface FormInputFieldProps {
  required?: boolean;  // prop 추가
}

export const FormInputField = ({
  required = true,  // 기본값 true
  ...
}) => {
  return (
    <input
      required={required}  // prop으로 제어
    />
  );
};
```

**사용:**
```typescript
// 설명 필드에 required={false} 전달
<FormInputField
  fieldName="설명"
  value={productForm.description}
  required={false}  // 선택 입력
/>
```

**결과:**
- 설명 필드가 선택 입력으로 변경
- 테스트에서 설명 없이도 폼 제출 가능
- origin과 동일한 동작

---

### 이슈 3: 상태 업데이트 타이밍 문제

#### 문제 상황
`fireEvent.change`를 빠르게 연속 호출할 때 상태 업데이트가 누락되는 문제.

#### 원인 분석
1. `setProductForm({ ...productForm, ... })` 패턴 사용
2. 클로저로 인해 이전 `productForm` 값 참조
3. React의 상태 업데이트 배치 처리

#### 해결 방법
```typescript
// ❌ 이전 (문제 있음)
onChange={(e) =>
  setProductForm({
    ...productForm,  // 이전 값 참조 가능
    name: e.target.value,
  })
}

// ✅ 수정 후
onChange={(e) =>
  setProductForm((prev) => ({  // 함수형 업데이트
    ...prev,  // 최신 상태 보장
    name: e.target.value,
  }))
}
```

**적용 위치:**
- `ProductBasicFields.tsx`의 모든 `setProductForm` 호출
- 상품명, 설명, 가격, 재고 입력 필드

**결과:**
- 빠른 연속 입력에서도 최신 상태 보장
- 상태 업데이트 누락 방지

---

## 🔍 발견된 패턴 및 베스트 프랙티스

### 1. 함수형 업데이트 패턴
```typescript
// ✅ 권장: 함수형 업데이트
setState((prev) => ({ ...prev, newValue }));

// ❌ 피해야 할 패턴 (클로저 문제)
setState({ ...state, newValue });
```

**이유:**
- 최신 상태 보장
- 클로저 문제 방지
- 빠른 연속 업데이트에서도 정확

---

### 2. useCallback 사용 전략
```typescript
// ✅ useCallback 사용: 의존성이 명확하고 자주 사용되는 함수
const addProduct = useCallback(
  (newProduct) => { ... },
  [addNotification]
);

// ❌ useCallback 사용 안 함: 최신 상태 참조가 중요한 함수
const handleProductSubmit = (e) => {
  // 매 렌더링마다 새로 생성하여 최신 상태 참조
};
```

**판단 기준:**
- 최신 상태 참조가 중요하면 `useCallback` 사용 안 함
- 의존성이 명확하고 최적화가 필요하면 `useCallback` 사용

---

### 3. Props 빌더 함수 패턴
```typescript
// ✅ Props 빌더 함수
const buildAdminProductsSection = () => {
  return {
    productForm,  // 최신 상태 참조
    handleProductSubmit,  // 최신 함수 참조
    // ...
  };
};

// 사용
<AdminPage
  adminProductsProps={{ ...buildAdminProductsSection() }}
/>
```

**이유:**
- Props 객체를 한 곳에서 관리
- 최신 상태와 함수 참조 보장
- 코드 가독성 향상

---

## ⚠️ 주의해야 할 패턴

### 1. 클로저 문제
```typescript
// ❌ 문제 있는 코드
const MyComponent = ({ value, onChange }) => {
  const handleClick = useCallback(() => {
    onChange(value);  // 이전 value 참조 가능
  }, [value, onChange]);
  
  return <button onClick={handleClick}>Click</button>;
};

// ✅ 해결 방법 1: 함수형 업데이트
const handleClick = useCallback(() => {
  onChange((prev) => ({ ...prev, newValue }));
}, [onChange]);

// ✅ 해결 방법 2: useCallback 제거
const handleClick = () => {
  onChange(value);  // 최신 value 참조
};
```

---

### 2. 상태 의존성 관리
```typescript
// ❌ 문제 있는 코드
const [count, setCount] = useState(0);
const doubleCount = count * 2;  // 매 렌더링마다 계산

// ✅ 해결 방법: useMemo
const doubleCount = useMemo(() => count * 2, [count]);
```

---

### 3. localStorage 동기화
```typescript
// ✅ 올바른 패턴
useEffect(() => {
  localStorage.setItem("key", JSON.stringify(value));
}, [value]);

// 초기화
const [value, setValue] = useState(() => {
  const saved = localStorage.getItem("key");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
});
```

**주의:**
- try-catch로 JSON 파싱 오류 처리
- 초기화 시 localStorage 확인

---

## 📝 코드 리뷰 체크리스트

### 상태 관리
- [ ] 함수형 업데이트 사용 (상태 의존 업데이트)
- [ ] useCallback 의존성 배열 정확히 관리
- [ ] localStorage 동기화 try-catch 처리

### 컴포넌트 설계
- [ ] Props 타입 정의
- [ ] 단일 책임 원칙 준수
- [ ] 재사용 가능한 컴포넌트 분리

### 테스트
- [ ] localStorage 초기화 (beforeEach)
- [ ] 비동기 업데이트 대기 (waitFor)
- [ ] 설명 필드 required={false} 설정

---

## 🔄 리팩토링 히스토리

### origin → basic 변경 사항

1. **컴포넌트 분리**
   - 단일 파일 → 여러 컴포넌트 파일
   - 기능별 폴더 구조

2. **타입 정의 분리**
   - 도메인별 타입 파일
   - Props 인터페이스 정의

3. **비즈니스 로직 분리**
   - domain 폴더에 유틸리티 함수
   - 순수 함수로 분리

4. **상태 관리 개선**
   - 함수형 업데이트 패턴 적용
   - useCallback 최적화

5. **테스트 호환성**
   - origin과 동일한 테스트 통과
   - 동일한 기능 보장

---

## 🎯 향후 개선 사항

### 1. 에러 처리 강화
- 네트워크 오류 처리
- localStorage 용량 초과 처리

### 2. 성능 최적화
- React.memo 적용 검토
- 가상화 (대량 데이터)

### 3. 접근성 개선
- ARIA 속성 추가
- 키보드 네비게이션

### 4. 테스트 커버리지 향상
- 단위 테스트 추가
- 경계값 테스트

