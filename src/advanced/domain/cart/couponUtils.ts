import { Coupon } from "../../../types";

export const formatCouponName = (coupons: Coupon[]) => {
  return coupons.map((coupon) => ({
    ...coupon,
    name: `${coupon.name} (${
      coupon.discountType === "amount"
        ? `${coupon.discountValue.toLocaleString()}원`
        : `${coupon.discountValue}%`
    })`,
  }));
};
