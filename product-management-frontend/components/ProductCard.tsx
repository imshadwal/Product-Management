import React from 'react';
import type { Product } from './product';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id?: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between h-full">
      {/* Header: Product Name + Buttons */}
      <div className="flex items-start justify-between w-full">
        <h3 className="text-lg font-semibold text-gray-800 break-words flex-1 pr-2">
          {product?.name}
        </h3>
        <div className="flex space-x-2 flex-shrink-0">
          <button
            onClick={() => {
              console.log('Edit Product:', product);
              onEdit && onEdit(product);
            }}
            className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(product?.id)}
            className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-4">
        <p className="text-gray-600 font-medium">Price: Rs.{product?.price}</p>
        <p className="text-gray-500 mt-2 break-words">{product?.description}</p>
      </div>
    </div>
  );
};

export default ProductCard;
