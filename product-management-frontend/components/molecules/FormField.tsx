import React from "react";
import { Label, Input, Textarea } from "../atoms";

interface FormFieldProps {
  label: string;
  type?: "text" | "number" | "textarea";
  error?: string;
  placeholder?: string;
  inputProps?: any;
  min?: number;
  step?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, type = "text", error, placeholder, inputProps, min, step }) => {
  return (
    <div>
      <Label>{label}</Label>
      {type === "textarea" ? (
        <Textarea placeholder={placeholder} {...inputProps} />
      ) : (
        <Input type={type} placeholder={placeholder} min={min} step={step} {...inputProps} />
      )}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
