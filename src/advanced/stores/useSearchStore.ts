import { create } from "zustand";

/**
 * 검색어 관련 전역 상태를 관리하는 Zustand Store
 * 
 * Entity를 다루지 않는 UI 상태 Store
 * - 검색어는 UI 입력 상태
 * - 디바운스 처리 포함
 * - 의존성이 없어 먼저 구현
 */
interface SearchState {
  // 상태
  searchTerm: string;
  debouncedSearchTerm: string;

  // 액션
  setSearchTerm: (term: string) => void;
}

// 디바운스 타이머를 저장할 변수
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export const useSearchStore = create<SearchState>((set) => ({
  // 초기 상태
  searchTerm: "",
  debouncedSearchTerm: "",

  // 검색어 설정 (디바운스 처리 포함)
  setSearchTerm: (term) => {
    set({ searchTerm: term });

    // 기존 타이머 취소
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // 500ms 후 디바운스된 검색어 업데이트
    debounceTimer = setTimeout(() => {
      set({ debouncedSearchTerm: term });
    }, 500);
  },
}));

