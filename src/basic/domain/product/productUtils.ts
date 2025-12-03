import { ProductWithUI } from "./productTypes";

export const filterProductsBySearchTerm = (
  debouncedSearchTerm: string,
  products: Array<ProductWithUI>
) => {
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;
  return filteredProducts;
};
