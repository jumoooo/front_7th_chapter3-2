import { Coupon } from "../../../../../types";
import { DiscountType } from "../../../../constans/constans";
import { FormInputField } from "../../../common/FormInputField";
import { FormSelectField } from "../../../common/FormSelectField";

interface CouponFormFieldsProps {
  couponForm: Coupon;
  setCouponForm: (form: Coupon | ((prev: Coupon) => Coupon)) => void;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export const CouponFormFields = ({
  couponForm,
  setCouponForm,
  addNotification,
}: CouponFormFieldsProps) => {
  const options = [
    { code: DiscountType.AMOUNT, name: "정액 할인" },
    { code: DiscountType.PRECENTAGE, name: "정률 할인" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <FormInputField
        fieldName="쿠폰명"
        value={couponForm.name}
        onChange={(e) =>
          setCouponForm({
            ...couponForm,
            name: e.target.value,
          })
        }
        placeholder="신규 가입 쿠폰"
      />
      <FormInputField
        fieldName="쿠폰 코드"
        value={couponForm.code}
        onChange={(e) =>
          setCouponForm({
            ...couponForm,
            code: e.target.value.toUpperCase(),
          })
        }
        placeholder="WELCOME2024"
      />
      <FormSelectField
        fieldName="할인 타입"
        value={couponForm.discountType}
        options={options}
        valueKey={"code"}
        labelKey={"name"}
        onChange={(e) =>
          setCouponForm({
            ...couponForm,
            discountType: e.target.value as "amount" | "percentage",
          })
        }
      />
      <FormInputField
        fieldName={
          couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"
        }
        value={couponForm.discountValue === 0 ? "" : couponForm.discountValue}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || /^\d+$/.test(value)) {
            setCouponForm({
              ...couponForm,
              discountValue: value === "" ? 0 : parseInt(value),
            });
          }
        }}
        onBlur={(e) => {
          const value = parseInt(e.target.value) || 0;
          if (couponForm.discountType === "percentage") {
            if (value > 100) {
              addNotification("할인율은 100%를 초과할 수 없습니다", "error");
              setCouponForm({
                ...couponForm,
                discountValue: 100,
              });
            } else if (value < 0) {
              setCouponForm({
                ...couponForm,
                discountValue: 0,
              });
            }
          } else {
            if (value > 100000) {
              addNotification(
                "할인 금액은 100,000원을 초과할 수 없습니다",
                "error"
              );
              setCouponForm({
                ...couponForm,
                discountValue: 100000,
              });
            } else if (value < 0) {
              setCouponForm({
                ...couponForm,
                discountValue: 0,
              });
            }
          }
        }}
        placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
      />
    </div>
  );
};
