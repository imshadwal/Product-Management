import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPrev, onNext }) => {
  return (
    <div className="mt-8 flex justify-between items-center">
      <button
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        onClick={onPrev}
        disabled={page === 1}
      >
        Prev
      </button>
      <span className="mx-4">Page {page} of {totalPages}</span>
      <button
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        onClick={onNext}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
