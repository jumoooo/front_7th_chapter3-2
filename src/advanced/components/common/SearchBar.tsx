interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
  className?: string; // 부모로부터 클래스 받기
}

export const SearchBar = ({
  searchTerm,
  setSearchTerm,
  placeholder = "검색...",
  className = "",
}: SearchBarProps) => {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
    />
  );
};
