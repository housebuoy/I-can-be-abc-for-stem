import React, { useState } from "react";

const Pagination = ({ filteredProducts, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage); // Total pages
  const [currentPage, setCurrentPage] = useState(1); // Current page

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page); // Notify parent of the page change
    }
  };

  return totalPages > 1 && (

    <div className="flex justify-center items-center mt-14 space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded ${
          currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 text-white"
        }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => goToPage(index + 1)}
          className={`px-3 py-2 rounded ${
            currentPage === index + 1
              ? "bg-indigo-400 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {index + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-indigo-600 text-white"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
