import { Coupon } from "../../../../types";
import { PriceType } from "../../../constans/constans";
import { formatPrice } from "../../../utils/formatters";
import { TrashIcon } from "../../icon/TrashIcon";

interface CouponItemProps {
  coupon: Coupon;
  formatType: PriceType;
  onClick: () => void;
}

export const CouponItem = ({
  coupon,
  formatType,
  onClick,
}: CouponItemProps) => {
  return (
    <div
      key={coupon.code}
      className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {coupon.discountType === "amount"
                ? `${formatPrice(coupon.discountValue, formatType)} 할인`
                : `${coupon.discountValue}% 할인`}
            </span>
          </div>
        </div>
        <button
          onClick={onClick}
          className="text-gray-400 hover:text-red-600 transition-colors">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};
