import { Coupon } from "../../../../../types";
import { CouponFormActions } from "./CouponFormActions";
import { CouponFormFields } from "./CouponFormFields";

export interface CouponFormSection {
  couponForm: Coupon;
  handleCouponSubmit: (e: React.FormEvent) => void;
  setCouponForm: (form: Coupon | ((prev: Coupon) => Coupon)) => void;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
  setShowCouponForm: (show: boolean) => void;
}

export const CouponFormSection = ({
  couponForm,
  handleCouponSubmit,
  setCouponForm,
  addNotification,
  setShowCouponForm,
}: CouponFormSection) => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleCouponSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <CouponFormFields
          couponForm={couponForm}
          setCouponForm={setCouponForm}
          addNotification={addNotification}
        />
        <CouponFormActions onClick={() => setShowCouponForm(false)} />
      </form>
    </div>
  );
};
