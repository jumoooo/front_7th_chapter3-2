import { CartSidebar } from "../components/cart/CartSidebar";
import { ProductList } from "../components/product/ProductList";
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
  const {
    products,
    filteredProducts,
    debouncedSearchTerm,
    getRemainingStock,
    getDisplayPrice,
    addToCart,
  } = productProps;
  const { cartProps, couponProps, payment } = cartSidebarProps;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          getRemainingStock={getRemainingStock}
          getDisplayPrice={getDisplayPrice}
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
