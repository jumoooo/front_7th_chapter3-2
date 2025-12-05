import { ProductForm } from "../../../../domain/product/productTypes";
import { ProductBasicFields } from "./ProductBasicFields";
import { ProductDiscountList } from "./ProductDiscountList";

interface ProductFormProps {
  productForm: ProductForm;
  setProductForm: (form: ProductForm | ((prev: ProductForm) => ProductForm)) => void;
  titleText: string;
  submitButtonText: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export const ProductFormSection = ({
  productForm,
  setProductForm,
  titleText,
  submitButtonText,
  onSubmit,
  onCancel,
  addNotification,
}: ProductFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{titleText}</h3>
      {/* 상품 기본 정보 */}
      <ProductBasicFields
        productForm={productForm}
        setProductForm={setProductForm}
        addNotification={addNotification}
      />
      {/* 할인 정책 */}
      <ProductDiscountList
        productForm={productForm}
        setProductForm={setProductForm}
      />

      {/* 버튼 */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

