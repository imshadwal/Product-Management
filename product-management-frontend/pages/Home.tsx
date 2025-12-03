import { useReducer } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "../hooks/useProducts";
import { ProductManagementTemplate } from "../components/templates";
import type { Product } from "../types/product";

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

  const handleSearchChange = (v: string) => {
    dispatch({ type: "setSearchTerm", payload: v });
    dispatch({ type: "setPage", payload: 1 });
  };

  return (
    <ProductManagementTemplate
      products={products}
      total={total}
      page={state.page}
      pageSize={PAGE_SIZE}
      searchTerm={state.searchTerm}
      isLoading={isLoading}
      error={!!error}
      showModal={state.showModal}
      editingProduct={state.editingProduct}
      onSearchChange={handleSearchChange}
      onAddProduct={openAddModal}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onPageChange={handlePageChange}
      onSave={handleSave}
      onCloseModal={closeModal}
    />
  );
};

export default Home;
