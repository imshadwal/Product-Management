import { useReducer } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "../hooks/useProducts";
import ProductList from "./ProductList";
import { SearchBar } from "../components/molecules";
import { Button } from "../components/atoms";
import ProductForm from "./ProductForm";
import type { Product } from "../components/product";

const PAGE_SIZE = 9; // 9 products per page

const Home = () => {
  type UIState = {
    page: number;
    searchTerm: string;
    showModal: boolean;
    editingProduct: Product | null;
  };

  type Action =
    | { type: "setPage"; payload: number }
    | { type: "setSearchTerm"; payload: string }
    | { type: "openModal"; payload?: Product | null }
    | { type: "closeModal" };

  const initialUIState: UIState = { page: 1, searchTerm: "", showModal: false, editingProduct: null };

  const reducer = (state: UIState, action: Action): UIState => {
    switch (action.type) {
      case "setPage":
        return { ...state, page: action.payload };
      case "setSearchTerm":
        return { ...state, searchTerm: action.payload };
      case "openModal":
        return { ...state, showModal: true, editingProduct: action.payload ?? null };
      case "closeModal":
        return { ...state, showModal: false, editingProduct: null };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialUIState);

  // React Query hooks
  const { data, isLoading, error } = useProducts(state.page, PAGE_SIZE, state.searchTerm);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = data?.data ?? [];
  const total = data?.total ?? 0;

  const openAddModal = () => dispatch({ type: "openModal", payload: null });
  const closeModal = () => dispatch({ type: "closeModal" });

  const handleSave = async (data: { name: string; price: number; description: string }) => {
    try {
      if (state.editingProduct) {
        // Edit existing product
        if (!state.editingProduct?.id) {
          console.error("Cannot update product: missing id on editingProduct");
          return;
        }
        await updateMutation.mutateAsync({ id: state.editingProduct.id, data });
      } else {
        // Add new product
        await createMutation.mutateAsync(data);
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  const handleEdit = (product: Product) => dispatch({ type: "openModal", payload: product });

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const handlePageChange = (newPage: number) => dispatch({ type: "setPage", payload: newPage });

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
          <SearchBar
            value={state.searchTerm}
            onChange={(v: string) => {
              dispatch({ type: "setSearchTerm", payload: v });
              dispatch({ type: "setPage", payload: 1 });
            }}
          />
          <Button variant="primary" onClick={openAddModal}>
            Add Product
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <ProductList
          products={products}
          total={total}
          page={state.page}
          pageSize={PAGE_SIZE}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
        />
      </div>

      {state.showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-30" onClick={closeModal}></div>
          <div className="relative w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-medium">{state.editingProduct ? "Edit Product" : "Add Product"}</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  Close
                </button>
              </div>
              <div className="p-4">
                <ProductForm
                  initial={state.editingProduct ?? undefined}
                  onSave={handleSave}
                  onCancel={closeModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
