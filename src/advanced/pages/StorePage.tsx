import { CartSidebar } from "../components/cart/CartSidebar";
import { ProductList } from "../components/product/ProductList";
import { PriceType } from "../constans/constans";
import {
  CartSidebarProps,
  ProductListProps,
} from "../domain/product/productTypes";

interface StorePageProps {
  productProps: ProductListProps;
  cartSidebarProps: CartSidebarProps;
}

export const StorePage = ({
  productProps,
  cartSidebarProps,
}: StorePageProps) => {
  const format = PriceType.KR;

  const { cart, products, filteredProducts, debouncedSearchTerm, addToCart } =
    productProps;
  const { cartProps, couponProps, payment } = cartSidebarProps;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList
          format={format}
          cart={cart}
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          addToCart={addToCart}
        />
      </div>

      <div className="lg:col-span-1">
        <CartSidebar
          cartProps={cartProps}
          couponProps={couponProps}
          payment={payment}
        />
      </div>
    </div>
  );
};
