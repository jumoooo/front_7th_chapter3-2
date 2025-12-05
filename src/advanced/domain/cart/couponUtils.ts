import { Coupon } from "../../../types";

export const formatCouponName = (coupons: Coupon[]) => {
  // 배열이 아닌 경우 빈 배열 반환 (안전장치)
  if (!Array.isArray(coupons)) {
    return [];
  }
  return coupons.map((coupon) => ({
    ...coupon,
    name: `${coupon.name} (${
      coupon.discountType === "amount"
        ? `${coupon.discountValue.toLocaleString()}원`
        : `${coupon.discountValue}%`
    })`,
  }));
};
