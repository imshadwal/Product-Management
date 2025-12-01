import React, { useEffect } from "react";
import type { Product } from "../components/product";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues } from "../schemas/productSchema";

interface ProductFormProps {
  initial?: Partial<Product>;
  onSave: (data: { name: string; price: number; description: string }) => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initial, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initial?.name ?? "",
      price: initial?.price ?? 0,
      description: initial?.description ?? "",
    },
  });

  useEffect(() => {
    // When `initial` changes (editing a different product), reset the form
    reset({
      name: initial?.name ?? "",
      price: initial?.price ?? 0,
      description: initial?.description ?? "",
    });
  }, [initial, reset]);

  const onSubmit = (data: ProductFormValues) => {
    onSave({ name: data.name.trim(), price: Number(data.price), description: data.description ?? "" });
    // reset form fields (keeps defaults in case of editing again)
    reset({ name: "", price: 0, description: "" });
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">{initial ? "Edit Product" : "Add Product"}</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Enter product name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            min={0}
            {...register("price", { valueAsNumber: true })}
            placeholder="Enter price"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
          <textarea
            {...register("description")}
            placeholder="Enter product description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{String(errors.description?.message)}</p>}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Save Product
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 border rounded hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
