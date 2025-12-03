import React from 'react';
import type { Product } from '../../types/product';
import { Button } from '../atoms';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id?: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between w-full">
        <h3 className="text-lg font-semibold text-gray-800 wrap-break-word flex-1 pr-2">
          {product?.name}
        </h3>
        <div className="flex space-x-2 shrink-0">
          <Button
            variant="primary"
            onClick={() => {
              console.log('Edit Product:', product);
              onEdit && onEdit(product);
            }}
            className="text-sm px-3 py-1"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete && onDelete(product?.id)}
            className="text-sm px-3 py-1"
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-600 font-medium">Price: Rs.{product?.price}</p>
        <p className="text-gray-500 mt-2 wrap-break-word">{product?.description}</p>
      </div>
    </div>
  );
};

export default ProductCard;
