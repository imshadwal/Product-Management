import React from "react";
import type { Product } from "../types/product";
import { ProductFormOrganism } from "../components/organisms";

interface ProductFormProps {
  initial?: Partial<Product>;
  onSave: (data: { name: string; price: number; description: string }) => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initial, onSave, onCancel }) => {
  return <ProductFormOrganism initial={initial} onSave={onSave} onCancel={onCancel} />;
};

export default ProductForm;
