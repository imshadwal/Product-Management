import React from "react";
import { Button } from "../atoms";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ page, totalPages, onPrev, onNext }) => {
  return (
    <div className="mt-8 flex justify-between items-center">
      <Button variant="secondary" onClick={onPrev} disabled={page === 1} className="px-4 py-2 rounded-lg">
        Prev
      </Button>
      <span className="mx-4">Page {page} of {totalPages}</span>
      <Button variant="secondary" onClick={onNext} disabled={page === totalPages} className="px-4 py-2 rounded-lg">
        Next
      </Button>
    </div>
  );
};

export default PaginationControls;
