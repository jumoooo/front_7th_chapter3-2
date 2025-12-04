import { Coupon } from "../../../../types";
import { PriceType } from "../../../constans/constans";
import { PlusIcon } from "../../icon/PlusIcon";
import { CouponItem } from "./CouponItem";

export interface CouponListProps {
  coupons: Coupon[];
  deleteCoupon: (couponCode: string) => void;
  setShowCouponForm: (value: React.SetStateAction<boolean>) => void;
  showCouponForm: boolean;
}

export const CouponList = ({
  coupons,
  deleteCoupon,
  setShowCouponForm,
  showCouponForm,
}: CouponListProps) => {
  const formatType = PriceType.KR;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => (
        <CouponItem
          key={coupon.code}
          coupon={coupon}
          formatType={formatType}
          onClick={() => deleteCoupon(coupon.code)}
        />
      ))}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
        <button
          onClick={() => setShowCouponForm(!showCouponForm)}
          className="text-gray-400 hover:text-gray-600 flex flex-col items-center">
          <PlusIcon />
          <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
        </button>
      </div>
    </div>
  );
};
