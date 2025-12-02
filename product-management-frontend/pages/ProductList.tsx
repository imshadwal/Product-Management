import { ProductCard, PaginationControls } from "../components/molecules";
import type { Product } from "../components/product";

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
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Products</h2>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-600 mt-4">
          {total === 0 ? "No products yet. Add your first product." : "No matching products found."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPrev={() => onPageChange(page - 1)}
              onNext={() => onPageChange(page + 1)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
