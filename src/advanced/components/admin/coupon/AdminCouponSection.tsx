import { CouponFormSection } from "./CouponFormSection";
import { CouponList, CouponListProps } from "./CouponList";

export interface AdminCouponSectionProps {
  couponsListProps: CouponListProps;
  couponFormProps: CouponFormSection;
  showCouponForm: boolean;
}

export const AdminCouponSection = ({
  couponsListProps,
  couponFormProps,
  showCouponForm = false,
}: AdminCouponSectionProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponList {...couponsListProps} />

        {showCouponForm && <CouponFormSection {...couponFormProps} />}
      </div>
    </section>
  );
};
