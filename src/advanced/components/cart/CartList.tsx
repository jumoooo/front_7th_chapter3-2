import { FilledCartItem } from "../../domain/cart/cartTypes";

import { CartIcon } from "../icon/CartIcon";
import { EmptyCartIcon } from "../icon/EmptyCartIcon";
import { CartItemRow } from "./CartItemRow";

interface CartListProps {
  cart: FilledCartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}

const EmptyCartList = () => {
  return (
    <div className="text-center py-8">
      <EmptyCartIcon />
      <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
    </div>
  );
};

const FilledCartList = ({
  cart,
  removeFromCart,
  updateQuantity,
}: CartListProps) => {
  return (
    <div className="space-y-3">
      {cart.map((item) => {
        const { itemTotal, hasDiscount, discountRate } = item.priceDetails;
        return (
          <CartItemRow
            key={item.product.id}
            id={item.product.id}
            name={item.product.name}
            quantity={item.quantity}
            itemTotal={itemTotal}
            hasDiscount={hasDiscount}
            discountRate={discountRate}
            removeFromCart={() => removeFromCart(item.product.id)}
            updateQuantity={updateQuantity}
          />
        );
      })}
    </div>
  );
};

export const CartList = ({
  cart,
  removeFromCart,
  updateQuantity,
}: CartListProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <CartIcon />
        장바구니
      </h2>
      {cart.length === 0 ? (
        <EmptyCartList />
      ) : (
        <FilledCartList
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
      )}
    </section>
  );
};
