import React from "react";
import { Input } from "../atoms";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value = "", onChange }) => {
  return (
    <div className="w-64">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder="Search products..."
        className="focus:ring-indigo1"
      />
    </div>
  );
};

export default SearchBar;
