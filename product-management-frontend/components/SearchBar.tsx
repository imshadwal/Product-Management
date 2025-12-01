import React from "react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value = "", onChange }) => {
  return (
    <div className="w-64">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder="Search products..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo1"
      />
    </div>
  );
};

export default SearchBar;
