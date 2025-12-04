import { Coupon } from "../../../types";
import { Selector } from "../common/Selector";

interface CouponSectionProps {
  coupons: Coupon[];
  showSelector: boolean;
  selectedCouponCode?: string;
  selectorOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddCoupon?: () => void;
}

export const CouponSection = ({
  coupons,
  selectedCouponCode,
  showSelector = false,
  selectorOnChange,
  onAddCoupon,
}: CouponSectionProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button
          className="text-xs text-blue-600 hover:underline"
          onClick={onAddCoupon}>
          쿠폰 등록
        </button>
      </div>
      {showSelector && (
        <Selector
          defaultValue="쿠폰 선택"
          value={selectedCouponCode}
          options={coupons}
          onChange={selectorOnChange}
          valueKey="code"
          labelKey="name"
        />
      )}
    </section>
  );
};
