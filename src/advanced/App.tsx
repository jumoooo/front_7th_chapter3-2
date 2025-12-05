import { useState, useEffect } from "react";
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
import { useNotificationStore } from "./stores/useNotificationStore";
import { useSearchStore } from "./stores/useSearchStore";
import { useProductStore } from "./stores/useProductStore";
import { useCartStore } from "./stores/useCartStore";
import { useCouponStore } from "./stores/useCouponStore";

const App = () => {
  // UI 상태 (Entity가 아닌 상태)
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTabKey>("products");

  // Store 사용 - Entity를 다루지 않는 Store
  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
  const debouncedSearchTerm = useSearchStore(
    (state) => state.debouncedSearchTerm
  );

  // Store 사용 - Entity를 다루는 Store
  const products = useProductStore((state) => state.products);
  const productForm = useProductStore((state) => state.productForm);
  const editingProduct = useProductStore((state) => state.editingProduct);
  const showProductForm = useProductStore((state) => state.showProductForm);
  const setProductForm = useProductStore((state) => state.setProductForm);
  const setEditingProduct = useProductStore((state) => state.setEditingProduct);
  const setShowProductForm = useProductStore(
    (state) => state.setShowProductForm
  );
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const startEditProduct = useProductStore((state) => state.startEditProduct);
  const handleProductSubmit = useProductStore(
    (state) => state.handleProductSubmit
  );

  // cart가 배열인지 확인 (안전장치)
  const cartRaw = useCartStore((state) => state.cart);
  const cart = Array.isArray(cartRaw) ? cartRaw : [];
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const completeOrderFromCart = useCartStore((state) => state.completeOrder);
  const getTotalItemCount = useCartStore((state) => state.getTotalItemCount);
  const getFilledItems = useCartStore((state) => state.getFilledItems);

  // coupons가 배열인지 확인 (안전장치)
  const couponsRaw = useCouponStore((state) => state.coupons);
  const coupons = Array.isArray(couponsRaw) ? couponsRaw : [];
  const selectedCoupon = useCouponStore((state) => state.selectedCoupon);
  const couponForm = useCouponStore((state) => state.couponForm);
  const showCouponForm = useCouponStore((state) => state.showCouponForm);
  const setSelectedCoupon = useCouponStore((state) => state.setSelectedCoupon);
  const setCouponForm = useCouponStore((state) => state.setCouponForm);
  const setShowCouponForm = useCouponStore(
    (state) => state.setShowCouponForm
  );
  const deleteCoupon = useCouponStore((state) => state.deleteCoupon);
  const handleCouponSubmit = useCouponStore(
    (state) => state.handleCouponSubmit
  );
  const selectorOnChange = useCouponStore((state) => state.selectorOnChange);

  // completeOrder는 cart와 coupon 모두 초기화해야 하므로 래퍼 함수 생성
  const completeOrder = () => {
    completeOrderFromCart();
    setSelectedCoupon(null);
  };

  // 계산된 값 (순수 함수 호출)
  const totals = calculateCartTotal(cart, selectedCoupon);
  
  // localStorage 동기화 (origin과 동일한 형식으로 저장)
  // persist 미들웨어는 내부적으로 사용하되, 테스트 호환성을 위해 배열을 직접 저장
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);
  
  const filteredProducts = filterProductsBySearchTerm(
    debouncedSearchTerm,
    products
  );

  // 계산된 값 (Store에서 제공하는 함수 사용)
  const totalItemCount = getTotalItemCount();
  const filledItems = getFilledItems();

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
    const addNotification = useNotificationStore.getState().addNotification;
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
    const addNotification = useNotificationStore.getState().addNotification;
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
