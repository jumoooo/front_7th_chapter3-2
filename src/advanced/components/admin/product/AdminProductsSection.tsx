import { ProductForm } from "../../../domain/product/productTypes";
import { SectionHeader } from "../common/SectionHeader";
import { ProductFormSection } from "./ProductFormSection";
import { ProductListTable, ProductListTableProps } from "./ProductListTable";

export interface AdminProductsSectionProps {
  productListTableProps: ProductListTableProps;
  productForm: ProductForm;
  showProductForm: boolean;
  editingProduct: string | null;
  setEditingProduct: (id: string | null) => void;
  setProductForm: (
    form: ProductForm | ((prev: ProductForm) => ProductForm)
  ) => void;
  setShowProductForm: (show: boolean) => void;
  handleProductSubmit: (e: React.FormEvent) => void;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export const AdminProductsSection = ({
  productListTableProps,
  productForm,
  showProductForm,
  editingProduct,
  setEditingProduct,
  setProductForm,
  setShowProductForm,
  handleProductSubmit,
  addNotification,
}: AdminProductsSectionProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <SectionHeader
        onAddNewProduct={() => {
          setEditingProduct("new");
          setProductForm({
            name: "",
            price: 0,
            stock: 0,
            description: "",
            discounts: [],
          });
          setShowProductForm(true);
        }}
      />

      <div className="overflow-x-auto">
        <ProductListTable {...productListTableProps} />
      </div>
      {showProductForm && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <ProductFormSection
            productForm={productForm}
            setProductForm={setProductForm}
            titleText={editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
            submitButtonText={editingProduct === "new" ? "추가" : "수정"}
            onSubmit={handleProductSubmit}
            onCancel={() => {
              setEditingProduct(null);
              setProductForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                discounts: [],
              });
              setShowProductForm(false);
            }}
            addNotification={addNotification}
          />
        </div>
      )}
    </section>
  );
};
