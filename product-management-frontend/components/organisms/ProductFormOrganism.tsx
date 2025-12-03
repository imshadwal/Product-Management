import React, { useEffect } from "react";
import type { Product } from "../../types/product";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues } from "../../schemas/productSchema";
import { Button } from "../atoms";
import { FormField } from "../molecules";

interface ProductFormOrganismProps {
  initial?: Partial<Product>;
  onSave: (data: { name: string; price: number; description: string }) => void;
  onCancel?: () => void;
}

const ProductFormOrganism: React.FC<ProductFormOrganismProps> = ({ initial, onSave, onCancel }) => {
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
    reset({
      name: initial?.name ?? "",
      price: initial?.price ?? 0,
      description: initial?.description ?? "",
    });
  }, [initial, reset]);

  const onSubmit = (data: ProductFormValues) => {
    onSave({ name: data.name.trim(), price: Number(data.price), description: data.description ?? "" });
    reset({ name: "", price: 0, description: "" });
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">{initial ? "Edit Product" : "Add Product"}</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Product Name"
          type="text"
          placeholder="Enter product name"
          error={errors.name?.message}
          inputProps={register("name")}
        />

        <FormField
          label="Price"
          type="number"
          placeholder="Enter price"
          min={0}
          step="0.01"
          error={errors.price?.message}
          inputProps={register("price", { valueAsNumber: true })}
        />

        <FormField
          label="Description"
          type="textarea"
          placeholder="Enter product description"
          error={errors.description?.message ? String(errors.description.message) : undefined}
          inputProps={register("description")}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting} variant="primary" className="flex-1">
            Save Product
          </Button>
          {onCancel && (
            <Button type="button" onClick={onCancel} variant="secondary" className="flex-1 border">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductFormOrganism;
