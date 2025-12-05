import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Discount } from "../../types";
import { ProductForm, ProductWithUI } from "../domain/product/productTypes";
import { useNotificationStore } from "./useNotificationStore";

// 초기 상품 데이터
const initialProducts: ProductWithUI[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: "최고급 품질의 프리미엄 상품입니다.",
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: "다양한 기능을 갖춘 실용적인 상품입니다.",
    isRecommended: true,
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: "대용량과 고성능을 자랑하는 상품입니다.",
  },
];

/**
 * 상품 Entity 관련 전역 상태를 관리하는 Zustand Store
 * 
 * Entity를 다루는 Store
 * - Product Entity의 상태 관리 및 CRUD 로직
 * - localStorage 동기화 (persist 미들웨어 사용)
 * - useNotificationStore 의존
 */
interface ProductState {
  // 상태
  products: ProductWithUI[];
  productForm: ProductForm;
  editingProduct: string | null;
  showProductForm: boolean;

  // 액션
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  startEditProduct: (product: ProductWithUI) => void;
  handleProductSubmit: (e: React.FormEvent) => void;
  setProductForm: (form: ProductForm | ((prev: ProductForm) => ProductForm)) => void;
  setEditingProduct: (id: string | null) => void;
  setShowProductForm: (show: boolean) => void;
}

// localStorage에서 동기적으로 초기 상태 읽기 (origin과 동일한 방식)
const getInitialProducts = (): ProductWithUI[] => {
  const saved = localStorage.getItem("products");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // 배열이 직접 저장되거나 { state: { products: [...] } } 형태일 수 있음
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && parsed.state && Array.isArray(parsed.state.products)) {
        return parsed.state.products;
      }
      return initialProducts;
    } catch {
      return initialProducts;
    }
  }
  return initialProducts;
};

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => {
      // 초기 상태: localStorage에서 동기적으로 읽기 (origin과 동일)
      const initialProductsState = getInitialProducts();
      
      return {
        products: initialProductsState,
      productForm: {
        name: "",
        price: 0,
        stock: 0,
        description: "",
        discounts: [] as Array<Discount>,
      },
      editingProduct: null,
      showProductForm: false,

      // 상품 추가
      addProduct: (newProduct) => {
        const product: ProductWithUI = {
          ...newProduct,
          id: `p${Date.now()}`,
        };
        set((state) => ({
          products: [...state.products, product],
        }));
        useNotificationStore.getState().addNotification(
          "상품이 추가되었습니다.",
          "success"
        );
      },

      // 상품 수정
      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId ? { ...product, ...updates } : product
          ),
        }));
        useNotificationStore.getState().addNotification(
          "상품이 수정되었습니다.",
          "success"
        );
      },

      // 상품 삭제
      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
        useNotificationStore.getState().addNotification(
          "상품이 삭제되었습니다.",
          "success"
        );
      },

      // 상품 편집 시작
      startEditProduct: (product) => {
        set({
          editingProduct: product.id,
          productForm: {
            name: product.name,
            price: product.price,
            stock: product.stock,
            description: product.description || "",
            discounts: product.discounts || [],
          },
          showProductForm: true,
        });
      },

      // 상품 폼 제출
      handleProductSubmit: (e) => {
        e.preventDefault();
        const state = get();
        const { editingProduct, productForm } = state;

        if (editingProduct && editingProduct !== "new") {
          state.updateProduct(editingProduct, productForm);
          set({ editingProduct: null });
        } else {
          state.addProduct({
            ...productForm,
            discounts: productForm.discounts,
          });
        }

        set({
          productForm: {
            name: "",
            price: 0,
            stock: 0,
            description: "",
            discounts: [],
          },
          editingProduct: null,
          showProductForm: false,
        });
      },

      // 상품 폼 설정 (함수형 업데이트 지원)
      setProductForm: (form) => {
        set((state) => ({
          productForm:
            typeof form === "function" ? form(state.productForm) : form,
        }));
      },

      // 편집 상품 ID 설정
      setEditingProduct: (id) => {
        set({ editingProduct: id });
      },

      // 폼 표시 여부 설정
      setShowProductForm: (show) => {
        set({ showProductForm: show });
      },
      };
    },
    {
      name: "products", // localStorage 키 (origin과 동일)
      partialize: (state) => ({ products: state.products }), // products만 저장
      // storage 옵션 제거: App.tsx의 useEffect가 배열을 직접 저장하므로
      // persist는 내부적으로만 사용하고, 실제 저장은 useEffect가 담당
      skipHydration: true,
    }
  )
);

// Store 초기화 시 localStorage에서 동기적으로 복원 (skipHydration: true 사용 시 필요)
// 테스트 환경에서는 실행하지 않음 (beforeEach에서 초기화)
if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
  const saved = localStorage.getItem("products");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        useProductStore.setState({ products: parsed });
      }
    } catch {
      // 에러 무시 (초기값 사용)
    }
  }
}
