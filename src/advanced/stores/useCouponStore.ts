import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Coupon } from "../../types";
import { calculateCartTotal } from "../domain/cart/cartUtils";
import { useCartStore } from "./useCartStore";
import { useNotificationStore } from "./useNotificationStore";

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
 * 쿠폰 Entity 관련 전역 상태를 관리하는 Zustand Store
 * 
 * Entity를 다루는 Store
 * - Coupon Entity의 상태 관리 및 CRUD 로직
 * - localStorage 동기화 (persist 미들웨어 사용)
 * - useCartStore, useNotificationStore 의존
 */
interface CouponState {
  // 상태
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  couponForm: Coupon;
  showCouponForm: boolean;

  // 액션
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  applyCoupon: (coupon: Coupon) => void;
  handleCouponSubmit: (e: React.FormEvent) => void;
  selectorOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  setCouponForm: (form: Coupon | ((prev: Coupon) => Coupon)) => void;
  setShowCouponForm: (show: boolean) => void;
}

// localStorage에서 동기적으로 초기 상태 읽기 (origin과 동일한 방식)
const getInitialCoupons = (): Coupon[] => {
  const saved = localStorage.getItem("coupons");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // 배열이 직접 저장되거나 { state: { coupons: [...] } } 형태일 수 있음
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && parsed.state && Array.isArray(parsed.state.coupons)) {
        return parsed.state.coupons;
      }
      return initialCoupons;
    } catch {
      return initialCoupons;
    }
  }
  return initialCoupons;
};

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => {
      // 초기 상태: localStorage에서 동기적으로 읽기 (origin과 동일)
      const initialCouponsState = getInitialCoupons();
      
      return {
        coupons: initialCouponsState,
      selectedCoupon: null,
      couponForm: {
        name: "",
        code: "",
        discountType: "amount",
        discountValue: 0,
      },
      showCouponForm: false,

      // 쿠폰 추가
      addCoupon: (newCoupon) => {
        const state = get();
        const currentCoupons = Array.isArray(state.coupons) ? state.coupons : [];
        const existingCoupon = currentCoupons.find(
          (c) => c.code === newCoupon.code
        );
        if (existingCoupon) {
          useNotificationStore.getState().addNotification(
            "이미 존재하는 쿠폰 코드입니다.",
            "error"
          );
          return;
        }
        set((state) => ({
          coupons: Array.isArray(state.coupons) ? [...state.coupons, newCoupon] : [newCoupon],
        }));
        useNotificationStore.getState().addNotification(
          "쿠폰이 추가되었습니다.",
          "success"
        );
      },

      // 쿠폰 삭제
      deleteCoupon: (couponCode) => {
        const state = get();
        set((state) => ({
          coupons: Array.isArray(state.coupons) 
            ? state.coupons.filter((c) => c.code !== couponCode)
            : [],
        }));
        if (state.selectedCoupon?.code === couponCode) {
          set({ selectedCoupon: null });
        }
        useNotificationStore.getState().addNotification(
          "쿠폰이 삭제되었습니다.",
          "success"
        );
      },

      // 쿠폰 적용
      applyCoupon: (coupon) => {
        const cart = useCartStore.getState().cart;
        const state = get();
        const currentTotal = calculateCartTotal(
          cart,
          state.selectedCoupon
        ).totalAfterDiscount;

        if (currentTotal < 10000 && coupon.discountType === "percentage") {
          useNotificationStore.getState().addNotification(
            "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
            "error"
          );
          return;
        }

        set({ selectedCoupon: coupon });
        useNotificationStore.getState().addNotification(
          "쿠폰이 적용되었습니다.",
          "success"
        );
      },

      // 쿠폰 폼 제출
      handleCouponSubmit: (e) => {
        e.preventDefault();
        const state = get();
        state.addCoupon(state.couponForm);
        set({
          couponForm: {
            name: "",
            code: "",
            discountType: "amount",
            discountValue: 0,
          },
          showCouponForm: false,
        });
      },

      // 쿠폰 선택 변경
      selectorOnChange: (e) => {
        const state = get();
        const currentCoupons = Array.isArray(state.coupons) ? state.coupons : [];
        const coupon = currentCoupons.find((c) => c.code === e.target.value);
        if (coupon) {
          state.applyCoupon(coupon);
        } else {
          set({ selectedCoupon: null });
        }
      },

      // 선택된 쿠폰 설정
      setSelectedCoupon: (coupon) => {
        set({ selectedCoupon: coupon });
      },

      // 쿠폰 폼 설정 (함수형 업데이트 지원)
      setCouponForm: (form) => {
        set((state) => ({
          couponForm:
            typeof form === "function" ? form(state.couponForm) : form,
        }));
      },

      // 폼 표시 여부 설정
      setShowCouponForm: (show) => {
        set({ showCouponForm: show });
      },
      };
    },
    {
      name: "coupons", // localStorage 키 (origin과 동일)
      partialize: (state) => ({ coupons: state.coupons }), // coupons만 저장
      // 테스트 환경에서도 동기적으로 작동하도록 skipHydration 사용
      skipHydration: true,
    }
  )
);

// Store 초기화 시 localStorage에서 동기적으로 복원 (skipHydration: true 사용 시 필요)
// 테스트 환경에서는 실행하지 않음 (beforeEach에서 초기화)
if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
  const saved = localStorage.getItem("coupons");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        useCouponStore.setState({ coupons: parsed });
      }
    } catch (error) {
      // 에러는 조용히 무시 (초기 상태 사용)
    }
  }
}

