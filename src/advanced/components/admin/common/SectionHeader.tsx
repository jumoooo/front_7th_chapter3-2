interface SectionHeaderProps {
  onAddNewProduct: () => void;
}

export const SectionHeader = ({ onAddNewProduct }: SectionHeaderProps) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">상품 목록</h2>
        <button
          onClick={onAddNewProduct}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800">
          새 상품 추가
        </button>
      </div>
    </div>
  );
};
