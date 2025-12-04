import { useState } from "react";
import {
  CartSidebarProps,
  ProductListProps,
} from "./domain/product/productTypes";
import { filterProductsBySearchTerm } from "./domain/product/productUtils";
import { calculateCartTotal } from "./domain/cart/cartUtils";
import { Notifications } from "./components/notifications/Notification";
import { DefaultLayout } from "./components/layouts/DefaultLayout";
import { SearchBar } from "./components/common/SearchBar";
import { HeaderActions } from "./components/layouts/HeaderActions";
import { StorePage } from "./pages/StorePage";
import { AdminTabKey } from "./components/admin/common/AdminTabs";
import { ProductListTableProps } from "./components/admin/product/ProductListTable";
import { AdminProductsSectionProps } from "./components/admin/product/AdminProductsSection";
import { CouponListProps } from "./components/admin/coupon/CouponList";
import { CouponFormSection } from "./components/admin/coupon/CouponFormSection";
import { AdminPage } from "./pages/AdminPage";
import { useNotification } from "./hooks/useNotification";
import { useSearch } from "./hooks/useSearch";
import { useProduct } from "./hooks/useProduct";
import { useCart } from "./hooks/useCart";
import { useCoupon } from "./hooks/useCoupon";

const App = () => {
  // UI 상태 (Entity가 아닌 상태)
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTabKey>("products");

  // Hook 사용 - Entity를 다루지 않는 Hook
  const { notifications, setNotifications, addNotification } =
    useNotification();
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearch();

  // Hook 사용 - Entity를 다루는 Hook (의존성 순서대로)
  const {
    products,
    productForm,
    editingProduct,
    showProductForm,
    setProductForm,
    setEditingProduct,
    setShowProductForm,
    deleteProduct,
    startEditProduct,
    handleProductSubmit,
  } = useProduct(addNotification);

  const {
    cart,
    totalItemCount,
    filledItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder: completeOrderFromCart,
  } = useCart(products, addNotification);

  const {
    coupons,
    selectedCoupon,
    couponForm,
    showCouponForm,
    setSelectedCoupon,
    setCouponForm,
    setShowCouponForm,
    deleteCoupon,
    handleCouponSubmit,
    selectorOnChange,
  } = useCoupon(cart, addNotification);

  // completeOrder는 cart와 coupon 모두 초기화해야 하므로 래퍼 함수 생성
  const completeOrder = () => {
    completeOrderFromCart();
    setSelectedCoupon(null);
  };

  // 계산된 값 (순수 함수 호출)
  const totals = calculateCartTotal(cart, selectedCoupon);
  const filteredProducts = filterProductsBySearchTerm(
    debouncedSearchTerm,
    products
  );

  // StorePage에 필요한 모든 props를 한 번에 조립해 반환하는 헬퍼 함수
  const buildStorePageProps = () => {
    const productProps: ProductListProps = {
      cart,
      products,
      filteredProducts,
      debouncedSearchTerm,
      addToCart,
    };
    const cartSidebarProps: CartSidebarProps = {
      cartProps: {
        filledItems,
        removeFromCart,
        updateQuantity,
      },
      couponProps: {
        coupons,
        selectedCouponCode: selectedCoupon?.code || "",
        selectorOnChange,
      },
      payment: {
        totals,
        completeOrder,
      },
    };

    return { productProps, cartSidebarProps };
  };

  const productListTableProps = () => {
    return {
      cart,
      products,
      startEditProduct,
      deleteProduct,
    } as ProductListTableProps;
  };

  const buildAdminProductsSection = () => {
    const adminProductsProps: AdminProductsSectionProps = {
      productListTableProps: productListTableProps(),
      productForm,
      showProductForm,
      editingProduct,
      setEditingProduct,
      setProductForm,
      setShowProductForm,
      handleProductSubmit,
      addNotification,
    };
    return adminProductsProps;
  };

  const buildAdminCouponSection = () => {
    const couponsListProps: CouponListProps = {
      coupons,
      deleteCoupon,
      setShowCouponForm,
      showCouponForm,
    };
    const couponFormProps: CouponFormSection = {
      couponForm,
      handleCouponSubmit,
      setCouponForm,
      addNotification,
      setShowCouponForm,
    };
    return { couponsListProps, couponFormProps, showCouponForm };
  };

  return (
    <DefaultLayout
      topContent={
        <>
          {notifications.length > 0 && (
            <Notifications
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )}
        </>
      }
      headerProps={{
        headerLeft: (
          <>
            {!isAdmin && (
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="상품 검색..."
              />
            )}
          </>
        ),
        headerRight: (
          <HeaderActions
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            cart={cart}
            totalItemCount={totalItemCount}
          />
        ),
      }}>
      {isAdmin ? (
        <AdminPage
          activeTab={activeTab}
          adminProductsProps={{ ...buildAdminProductsSection() }}
          adminCouponProps={{ ...buildAdminCouponSection() }}
          setActiveTab={setActiveTab}
        />
      ) : (
        <StorePage {...buildStorePageProps()} />
      )}
    </DefaultLayout>
  );
};

export default App;
