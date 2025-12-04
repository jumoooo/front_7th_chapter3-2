import { formatPrice } from "../../utils/formatters";
import { CloseButton } from "../common/CloseButton";
import { MinusButton } from "../common/MinusButton";
import { PlusButton } from "../common/PlusButton";

interface CartItemRowProps {
  id: string;
  name: string;
  quantity: number;
  itemTotal: number;
  hasDiscount: boolean;
  discountRate: number;
  removeFromCart: () => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}

export const CartItemRow = ({
  id,
  name,
  quantity,
  itemTotal,
  hasDiscount,
  discountRate,
  removeFromCart,
  updateQuantity,
}: CartItemRowProps) => {
  return (
    <div key={id} className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">{name}</h4>
        <CloseButton onClick={removeFromCart} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MinusButton onClick={() => updateQuantity(id, quantity - 1)} />
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {quantity}
          </span>
          <PlusButton onClick={() => updateQuantity(id, quantity + 1)} />
        </div>
        <div className="text-right">
          {hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">
              -{discountRate}%
            </span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {formatPrice(Math.round(itemTotal))}
          </p>
        </div>
      </div>
    </div>
  );
};
