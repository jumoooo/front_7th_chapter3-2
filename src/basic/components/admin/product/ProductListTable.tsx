import { CartItem } from "../../../../types";
import { PriceType } from "../../../constans/constans";
import { ProductWithUI } from "../../../domain/product/productTypes";
import { ProductTableRow } from "./ProductTableRow";

export interface ProductListTableProps {
  cart: CartItem[];
  products: ProductWithUI[];
  startEditProduct: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
}

export const ProductListTable = ({
  cart,
  products,
  startEditProduct,
  deleteProduct,
}: ProductListTableProps) => {
  const priceType = PriceType.KR;
  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            상품명
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            가격
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            재고
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            설명
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            작업
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => (
          <ProductTableRow
            key={product.id}
            cart={cart}
            product={product}
            priceType={priceType}
            onClickEdit={() => startEditProduct(product)}
            onClickDelete={() => deleteProduct(product.id)}
          />
        ))}
      </tbody>
    </table>
  );
};
