# Basic 프로젝트 문서 인덱스

이 폴더는 `src/basic/` 프로젝트의 상세 문서를 포함합니다. 다음 AI가 작업할 때 참고할 수 있도록 프로젝트의 구조, 로직, 패턴 등을 상세히 정리했습니다.

---

## 📚 문서 목록

### 1. [프로젝트 개요](./basic-project-overview.md)
- 프로젝트 정보 및 목적
- 폴더 구조
- 기술 스택 및 버전
- 실행 스크립트
- 주요 특징

### 2. [도메인 모델 및 타입](./basic-domain-types.md)
- 상품 도메인 타입
- 장바구니 도메인 타입
- 쿠폰 도메인 타입
- 알림 도메인 타입
- 상수 정의
- 타입 관계도

### 3. [비즈니스 로직](./basic-business-logic.md)
- 할인 정책 및 계산 로직
- 장바구니 계산 로직
- 쿠폰 로직
- 상품 필터링 로직
- 재고 관리 로직
- 가격 포맷팅 로직

### 4. [컴포넌트 구조](./basic-components.md)
- 컴포넌트 계층 구조
- 페이지 컴포넌트
- 상품 관련 컴포넌트
- 장바구니 관련 컴포넌트
- 쿠폰 관련 컴포넌트
- 공통 컴포넌트
- 레이아웃 컴포넌트

### 5. [상태 관리](./basic-state-management.md)
- 상태 목록 및 설명
- localStorage 동기화
- 상태 업데이트 함수
- 계산된 값 (useMemo)
- Props 빌더 함수
- 상태 관리 패턴

### 6. [테스트 구조](./basic-testing.md)
- 테스트 프레임워크
- 테스트 구조
- 고객 쇼핑 플로우 테스트
- 관리자 기능 테스트
- localStorage 동기화 테스트
- 테스트 주의사항

### 7. [주요 이슈 및 해결 방법](./basic-issues-solutions.md)
- 해결된 주요 이슈
- 발견된 패턴 및 베스트 프랙티스
- 주의해야 할 패턴
- 코드 리뷰 체크리스트
- 리팩토링 히스토리

---

## 🚀 빠른 시작

### 프로젝트 실행
```bash
# 개발 서버 실행
npm run dev:basic

# 테스트 실행
npm run test:basic
```

### 주요 파일 위치
- **메인 앱**: `src/basic/App.tsx`
- **도메인 타입**: `src/basic/domain/`
- **컴포넌트**: `src/basic/components/`
- **테스트**: `src/basic/__tests__/origin.test.tsx`

---

## ⚠️ 중요 주의사항

### 1. handleProductSubmit
- `useCallback`으로 감싸지 않음
- 매 렌더링마다 새로 생성되어 최신 상태 참조

### 2. FormInputField
- `required` prop 추가됨 (기본값: `true`)
- 설명 필드는 `required={false}` 설정 필요

### 3. 상태 업데이트
- 함수형 업데이트 패턴 필수
- `setState((prev) => ({ ...prev, ... }))` 사용

---

## 🔍 문서 사용 가이드

### 새로운 기능 추가 시
1. [프로젝트 개요](./basic-project-overview.md) - 프로젝트 구조 파악
2. [도메인 모델 및 타입](./basic-domain-types.md) - 타입 정의 확인
3. [비즈니스 로직](./basic-business-logic.md) - 관련 로직 확인
4. [컴포넌트 구조](./basic-components.md) - 컴포넌트 구조 확인

### 버그 수정 시
1. [주요 이슈 및 해결 방법](./basic-issues-solutions.md) - 유사 이슈 확인
2. [상태 관리](./basic-state-management.md) - 상태 관리 패턴 확인
3. [테스트 구조](./basic-testing.md) - 테스트 케이스 확인

### 코드 리뷰 시
1. [주요 이슈 및 해결 방법](./basic-issues-solutions.md) - 체크리스트 확인
2. [컴포넌트 구조](./basic-components.md) - 설계 원칙 확인
3. [상태 관리](./basic-state-management.md) - 상태 관리 패턴 확인

---

## 📝 문서 업데이트 가이드

새로운 기능이나 변경사항이 있을 때:

1. **타입 변경**: [도메인 모델 및 타입](./basic-domain-types.md) 업데이트
2. **로직 변경**: [비즈니스 로직](./basic-business-logic.md) 업데이트
3. **컴포넌트 추가**: [컴포넌트 구조](./basic-components.md) 업데이트
4. **상태 관리 변경**: [상태 관리](./basic-state-management.md) 업데이트
5. **이슈 해결**: [주요 이슈 및 해결 방법](./basic-issues-solutions.md) 업데이트

---

## 🔗 관련 문서

- **Origin 프로젝트**: `src/origin/` (참고용)
- **Advanced 프로젝트**: `src/advanced/` (향후 버전)
- **공통 타입**: `src/types.ts`

---

## 📅 문서 작성 일자

- 작성일: 2025년
- 프로젝트 버전: Basic (컴포넌트 분리 버전)
- React 버전: 19.1.1
- TypeScript 버전: 5.9.2

---

## 💡 팁

### 문서 검색
- 특정 주제를 찾을 때는 각 문서의 목차를 먼저 확인
- 코드 예시는 실제 파일 경로와 함께 제공됨

### 코드 참조
- 문서 내 코드 블록은 실제 파일 경로를 포함
- `src/basic/` 경로 기준으로 작성됨

### 패턴 확인
- 반복되는 패턴은 [주요 이슈 및 해결 방법](./basic-issues-solutions.md)에 정리
- 베스트 프랙티스도 함께 확인 가능

---

**이 문서들은 다음 AI가 작업할 때 참고할 수 있도록 상세히 작성되었습니다. 꼼꼼히 읽고 활용해주세요!** 🚀

