import { ProductForm } from "../../../../domain/product/productTypes";
import { ProductDiscountRow } from "./ProductDiscountRow";

interface ProductDiscountListProps {
  productForm: ProductForm;
  setProductForm: (value: React.SetStateAction<ProductForm>) => void;
}

export const ProductDiscountList = ({
  productForm,
  setProductForm,
}: ProductDiscountListProps) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        할인 정책
      </label>
      <div className="space-y-2">
        {productForm.discounts.map((discount, index) => (
          <ProductDiscountRow
            key={index}
            discount={discount}
            index={index}
            productForm={productForm}
            setProductForm={setProductForm}
          />
        ))}
        <button
          type="button"
          onClick={() => {
            setProductForm({
              ...productForm,
              discounts: [
                ...productForm.discounts,
                { quantity: 10, rate: 0.1 },
              ],
            });
          }}
          className="text-sm text-indigo-600 hover:text-indigo-800">
          + 할인 추가
        </button>
      </div>
    </div>
  );
};
