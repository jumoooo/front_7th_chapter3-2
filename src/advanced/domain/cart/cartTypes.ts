import { CartItem } from "../../../types";

export type FilledCartItem = CartItem & {
  priceDetails: {
    itemTotal: number;
    hasDiscount: boolean;
    discountRate: number;
  };
};
