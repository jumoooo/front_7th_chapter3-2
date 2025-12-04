interface CouponFormActionsProps {
  onClick: () => void;
}

export const CouponFormActions = ({ onClick }: CouponFormActionsProps) => {
  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onClick}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        취소
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
        쿠폰 생성
      </button>
    </div>
  );
};
