import { AdminTabKey, AdminTabs } from "../components/admin/common/AdminTabs";
import {
  AdminCouponSection,
  AdminCouponSectionProps,
} from "../components/admin/coupon/AdminCouponSection";
import {
  AdminProductsSection,
  AdminProductsSectionProps,
} from "../components/admin/product/AdminProductsSection";

interface AdminPageProps {
  activeTab: AdminTabKey;
  adminProductsProps: AdminProductsSectionProps;
  adminCouponProps: AdminCouponSectionProps;
  setActiveTab: React.Dispatch<React.SetStateAction<AdminTabKey>>;
}

export const AdminPage = ({
  activeTab,
  adminProductsProps,
  adminCouponProps,
  setActiveTab,
}: AdminPageProps) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <AdminTabs activeKey={activeTab} onChange={setActiveTab} />

      {activeTab === "products" ? (
        <AdminProductsSection {...adminProductsProps} />
      ) : (
        <AdminCouponSection {...adminCouponProps} />
      )}
    </div>
  );
};
