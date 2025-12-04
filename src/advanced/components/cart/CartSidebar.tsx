import { CartSidebarProps } from "../../domain/product/productTypes";

import { formatCouponName } from "../../domain/cart/couponUtils";

import { CartList } from "./CartList";
import { CouponSection } from "./CouponSection";
import { PaymentSummary } from "./PaymentSummary";

export const CartSidebar = ({
  cartProps,
  couponProps,
  payment,
}: CartSidebarProps) => {
  const { filledItems, removeFromCart, updateQuantity } = cartProps;
  const { coupons, selectedCouponCode, selectorOnChange } = couponProps;
  const { totals, completeOrder } = payment;

  return (
    <div className="sticky top-24 space-y-4">
      <CartList
        cart={filledItems}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />
      {filledItems.length > 0 && (
        <>
          <CouponSection
            coupons={formatCouponName(coupons)}
            showSelector={coupons.length > 0}
            selectedCouponCode={selectedCouponCode}
            selectorOnChange={selectorOnChange}
          />

          <PaymentSummary
            totalBeforeDiscount={totals.totalBeforeDiscount}
            totalAfterDiscount={totals.totalAfterDiscount}
            completeOrder={completeOrder}
          />
        </>
      )}
    </div>
  );
};
