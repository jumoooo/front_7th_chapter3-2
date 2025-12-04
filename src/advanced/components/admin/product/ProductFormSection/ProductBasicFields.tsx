import { ProductForm } from "../../../../domain/product/productTypes";
import { FormInputField } from "../../../common/FormInputField";

interface ProductBasicFieldsProps {
  productForm: ProductForm;
  setProductForm: (value: React.SetStateAction<ProductForm>) => void;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export const ProductBasicFields = ({
  productForm,
  setProductForm,
  addNotification,
}: ProductBasicFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormInputField
        fieldName="상품명"
        value={productForm.name}
        onChange={(e) => {
          const newName = e.target.value;
          setProductForm((prev) => ({
            ...prev,
            name: newName,
          }));
        }}
      />
      <FormInputField
        fieldName="설명"
        value={productForm.description}
        onChange={(e) => {
          const newDesc = e.target.value;
          setProductForm((prev) => ({
            ...prev,
            description: newDesc,
          }));
        }}
        required={false}
      />
      <FormInputField
        fieldName="가격"
        value={productForm.price === 0 ? "" : productForm.price}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || /^\d+$/.test(value)) {
            setProductForm((prev) => ({
              ...prev,
              price: value === "" ? 0 : parseInt(value),
            }));
          }
        }}
        onBlur={(e) => {
          const value = e.target.value;
          if (value === "") {
            setProductForm((prev) => ({ ...prev, price: 0 }));
          } else if (parseInt(value) < 0) {
            addNotification("가격은 0보다 커야 합니다", "error");
            setProductForm((prev) => ({ ...prev, price: 0 }));
          }
        }}
        placeholder="숫자만 입력"
      />
      <FormInputField
        fieldName="재고"
        value={productForm.stock === 0 ? "" : productForm.stock}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || /^\d+$/.test(value)) {
            setProductForm((prev) => ({
              ...prev,
              stock: value === "" ? 0 : parseInt(value),
            }));
          }
        }}
        onBlur={(e) => {
          const value = e.target.value;
          if (value === "") {
            setProductForm((prev) => ({ ...prev, stock: 0 }));
          } else if (parseInt(value) < 0) {
            addNotification("재고는 0보다 커야 합니다", "error");
            setProductForm((prev) => ({ ...prev, stock: 0 }));
          } else if (parseInt(value) > 9999) {
            addNotification("재고는 9999개를 초과할 수 없습니다", "error");
            setProductForm((prev) => ({ ...prev, stock: 9999 }));
          }
        }}
        placeholder="숫자만 입력"
      />
    </div>
  );
};
