import { CartItem } from "../../../types";
import { PriceType } from "../../constans/constans";
import { getRemainingStock } from "../../domain/cart/cartUtils";
import { ProductWithUI } from "../../domain/product/productTypes";
import { ProductItem } from "./ProductItem";

interface ProductListProps {
  format: PriceType;
  cart: CartItem[];
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  addToCart: (product: ProductWithUI) => void;
}

export const ProductList = ({
  format,
  cart,
  products,
  filteredProducts,
  debouncedSearchTerm,
  addToCart,
}: ProductListProps) => {
  const EmptyProduct = () => {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
        </p>
      </div>
    );
  };
  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <EmptyProduct />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const remainingStock = getRemainingStock(cart, product);
            return (
              <ProductItem
                key={product.id}
                format={format}
                cart={cart}
                product={product}
                remainingStock={remainingStock}
                addToCart={addToCart}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
