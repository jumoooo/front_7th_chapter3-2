import { TabItem, Tabs } from "../../common/Tabs";

export type AdminTabKey = "products" | "coupons";

interface AdminTabsProps {
  activeKey: AdminTabKey;
  onChange: (key: AdminTabKey) => void;
}

export const AdminTabs = ({ activeKey, onChange }: AdminTabsProps) => {
  const items: TabItem<AdminTabKey>[] = [
    { key: "products", label: "상품 관리" },
    { key: "coupons", label: "쿠폰 관리" },
  ];
  return <Tabs items={items} activeKey={activeKey} onChange={onChange} />;
};
