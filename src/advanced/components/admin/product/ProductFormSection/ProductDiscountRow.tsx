import { Discount } from "../../../../../types";
import { ProductForm } from "../../../../domain/product/productTypes";

interface ProductDiscountRowProps {
  discount: Discount;
  index: number;
  productForm: ProductForm;
  setProductForm: (form: ProductForm | ((prev: ProductForm) => ProductForm)) => void;
}

export const ProductDiscountRow = ({
  discount,
  index,
  productForm,
  setProductForm,
}: ProductDiscountRowProps) => {
  return (
    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
      <input
        type="number"
        value={discount.quantity}
        onChange={(e) => {
          const newDiscounts = [...productForm.discounts];
          newDiscounts[index].quantity = parseInt(e.target.value) || 0;
          setProductForm({
            ...productForm,
            discounts: newDiscounts,
          });
        }}
        className="w-20 px-2 py-1 border rounded"
        min="1"
        placeholder="수량"
      />
      <span className="text-sm">개 이상 구매 시</span>
      <input
        type="number"
        value={discount.rate * 100}
        onChange={(e) => {
          const newDiscounts = [...productForm.discounts];
          newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
          setProductForm({
            ...productForm,
            discounts: newDiscounts,
          });
        }}
        className="w-16 px-2 py-1 border rounded"
        min="0"
        max="100"
        placeholder="%"
      />
      <span className="text-sm">% 할인</span>
      <button
        type="button"
        onClick={() => {
          const newDiscounts = productForm.discounts.filter(
            (_, i) => i !== index
          );
          setProductForm({
            ...productForm,
            discounts: newDiscounts,
          });
        }}
        className="text-red-600 hover:text-red-800">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
