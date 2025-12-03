import React from "react";
import { SearchBar } from "../molecules";
import { Button } from "../atoms";
import { ProductListOrganism, ProductFormOrganism } from "../organisms";
import type { Product } from "../../types/product";

interface ProductManagementTemplateProps {
  // Data
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  searchTerm: string;
  isLoading: boolean;
  error: boolean;
  
  // Modal state
  showModal: boolean;
  editingProduct: Product | null;
  
  // Handlers
  onSearchChange: (value: string) => void;
  onAddProduct: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id?: string) => void;
  onPageChange: (page: number) => void;
  onSave: (data: { name: string; price: number; description: string }) => void;
  onCloseModal: () => void;
}

const ProductManagementTemplate: React.FC<ProductManagementTemplateProps> = ({
  products,
  total,
  page,
  pageSize,
  searchTerm,
  isLoading,
  error,
  showModal,
  editingProduct,
  onSearchChange,
  onAddProduct,
  onEdit,
  onDelete,
  onPageChange,
  onSave,
  onCloseModal,
}) => {
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-sm mt-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-sm mt-8">
        <div className="text-center py-12">
          <p className="text-red-600">Error loading products. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-sm mt-8">
      <div className="flex items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-4xl font-bold text-indigo1">Product Management</h1>
          <p className="mt-2 text-lg text-gray-600">Manage your products with ease</p>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar value={searchTerm} onChange={onSearchChange} />
          <Button variant="primary" onClick={onAddProduct}>
            Add Product
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <ProductListOrganism
          products={products}
          total={total}
          page={page}
          pageSize={pageSize}
          onEdit={onEdit}
          onDelete={onDelete}
          onPageChange={onPageChange}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-30" onClick={onCloseModal}></div>
          <div className="relative w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-medium">{editingProduct ? "Edit Product" : "Add Product"}</h3>
                <button onClick={onCloseModal} className="text-gray-500 hover:text-gray-700">
                  Close
                </button>
              </div>
              <div className="p-4">
                <ProductFormOrganism
                  initial={editingProduct ?? undefined}
                  onSave={onSave}
                  onCancel={onCloseModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementTemplate;
