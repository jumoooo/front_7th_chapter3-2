import { useState, useCallback, useEffect } from "react";
import { Coupon } from "../../types";
import { calculateCartTotal } from "../domain/cart/cartUtils";
import { CartItem } from "../../types";

// 초기 쿠폰 데이터
const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

/**
 * 쿠폰 Entity 관련 상태 및 로직을 관리하는 Hook
 *
 * Entity를 다루는 Hook
 * - Coupon Entity의 상태 관리 및 CRUD 로직
 */
export const useCoupon = (
  cart: CartItem[],
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  const [showCouponForm, setShowCouponForm] = useState(false);

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [selectedCoupon, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [cart, selectedCoupon, addNotification]
  );

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const selectorOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coupon = coupons.find((c) => c.code === e.target.value);
    if (coupon) {
      applyCoupon(coupon);
    } else {
      setSelectedCoupon(null);
    }
  };

  return {
    coupons,
    selectedCoupon,
    couponForm,
    showCouponForm,
    setSelectedCoupon,
    setCouponForm,
    setShowCouponForm,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    handleCouponSubmit,
    selectorOnChange,
  };
};
