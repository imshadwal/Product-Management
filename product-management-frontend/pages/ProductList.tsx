import React from "react";
import type { Product } from "../types/product";
import { ProductListOrganism } from "../components/organisms";

interface ProductListProps {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  onEdit?: (product: Product) => void;
  onDelete?: (id?: string) => void;
  onPageChange: (page: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  total,
  page,
  pageSize,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  return (
    <ProductListOrganism
      products={products}
      total={total}
      page={page}
      pageSize={pageSize}
      onEdit={onEdit}
      onDelete={onDelete}
      onPageChange={onPageChange}
    />
  );
};

export default ProductList;
