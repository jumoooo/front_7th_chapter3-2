import { CartItem } from "../../../../types";
import { PriceType } from "../../../constans/constans";
import { getDisplayPrice } from "../../../domain/cart/cartUtils";
import { ProductWithUI } from "../../../domain/product/productTypes";

interface ProductTableRowProps {
  cart: CartItem[];
  product: ProductWithUI;
  priceType: PriceType;
  onClickEdit: () => void;
  onClickDelete: () => void;
}

export const ProductTableRow = ({
  cart,
  product,
  priceType,
  onClickEdit,
  onClickDelete,
}: ProductTableRowProps) => {
  const { id, name, stock, description } = product;
  return (
    <tr key={id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {getDisplayPrice(cart, product, priceType)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            stock > 10
              ? "bg-green-100 text-green-800"
              : stock > 0
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}>
          {stock}개
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
        {description || "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={onClickEdit}
          className="text-indigo-600 hover:text-indigo-900 mr-3">
          수정
        </button>
        <button
          onClick={onClickDelete}
          className="text-red-600 hover:text-red-900">
          삭제
        </button>
      </td>
    </tr>
  );
};
