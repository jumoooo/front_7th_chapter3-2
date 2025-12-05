# Advanced 프로젝트 문서 인덱스

이 폴더는 `src/advanced/` 프로젝트의 상세 문서를 포함합니다. 다음 AI가 작업할 때 참고할 수 있도록 프로젝트의 구조, 로직, 패턴 등을 상세히 정리했습니다.

---

## 📚 문서 목록

### 1. [프로젝트 개요](./advanced-project-overview.md)

- 프로젝트 정보 및 목적
- 폴더 구조
- 기술 스택 및 버전
- 심화과제 목표
- 리팩토링 계획

---

## 🎯 심화과제 목표

### 요구사항

- [ ] Zustand를 사용해서 전역상태관리를 구축했나요?
- [ ] 전역상태관리를 통해 domain custom hook을 적절하게 리팩토링 했나요?
- [ ] 도메인 컴포넌트에 도메인 props는 남기고 props drilling을 유발하는 불필요한 props는 잘 제거했나요?
- [ ] 전체적으로 분리와 재조립이 더 수월해진 결합도가 낮아진 코드가 되었나요?

---

## 🚀 빠른 시작

### 프로젝트 실행

```bash
# 개발 서버 실행
npm run dev:advanced

# 테스트 실행
npm run test:advanced
```

### 주요 파일 위치

- **메인 앱**: `src/advanced/App.tsx`
- **도메인 타입**: `src/advanced/domain/`
- **컴포넌트**: `src/advanced/components/`
- **Hook**: `src/advanced/hooks/` (Zustand Store로 변환 예정)
- **테스트**: `src/advanced/__tests__/origin.test.tsx`

---

## ⚠️ 중요 주의사항

### 1. 기존 기능 보존

- 모든 기능이 동일하게 동작해야 함
- 테스트 코드 수정 불가

### 2. Props 전달 기준

- 도메인 props는 유지
- 전역 상태로 관리되는 값은 props 제거

### 3. 점진적 리팩토링

- 한 번에 하나씩 진행
- 각 단계마다 검증

---

## 📝 문서 업데이트 가이드

새로운 기능이나 변경사항이 있을 때:

1. **Zustand Store 추가**: [상태 관리](./advanced-state-management.md) 업데이트
2. **Props 변경**: [컴포넌트 구조](./advanced-components.md) 업데이트
3. **Hook 리팩토링**: [상태 관리](./advanced-state-management.md) 업데이트
4. **이슈 해결**: [주요 이슈 및 해결 방법](./advanced-issues-solutions.md) 업데이트

---

## 🔗 관련 문서

- **Basic 프로젝트**: `.cursor/mockdowns/basic/` (참고용)
- **Origin 프로젝트**: `src/origin/` (참고용)
- **공통 타입**: `src/types.ts`

---

## 📅 문서 작성 일자

- 작성일: 2025년
- 프로젝트 버전: Advanced (Zustand 전역 상태 관리 버전)
- React 버전: 19.1.1
- TypeScript 버전: 5.9.2
- Zustand 버전: 설치 예정

---

**이 문서들은 다음 AI가 작업할 때 참고할 수 있도록 상세히 작성되었습니다. 꼼꼼히 읽고 활용해주세요!** 🚀
