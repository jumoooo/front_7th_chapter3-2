import { useState, useEffect } from "react";

/**
 * 검색어 상태 및 디바운스 처리를 관리하는 Hook
 * 
 * Entity를 다루지 않는 UI 상태 Hook
 * - 검색어는 UI 입력 상태
 */
export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
};

