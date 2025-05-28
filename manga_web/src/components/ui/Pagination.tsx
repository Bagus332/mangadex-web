// src/components/ui/Pagination.tsx
"use client";

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, isLoading = false }) => {
  if (totalPages <= 1) {
    return null; // Jangan tampilkan pagination jika hanya ada 1 halaman atau kurang
  }

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  // Membuat tombol nomor halaman (sederhana, bisa dikembangkan)
  const pageNumbers = [];
  const maxPagesToShow = 5; // Jumlah maksimal nomor halaman yang ditampilkan
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }


  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(
      <button
        key={i}
        onClick={() => !isLoading && onPageChange(i)}
        disabled={isLoading || currentPage === i}
        className={`mx-1 px-3 py-1 text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50
          ${currentPage === i
            ? 'bg-sky-600 text-white cursor-default'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      <button
        onClick={handlePrevious}
        disabled={isLoading || currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
      >
        Sebelumnya
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => !isLoading && onPageChange(1)} disabled={isLoading} className="mx-1 px-3 py-1 text-sm font-medium rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50">1</button>
          {startPage > 2 && <span className="text-gray-500">...</span>}
        </>
      )}

      {pageNumbers}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
          <button onClick={() => !isLoading && onPageChange(totalPages)} disabled={isLoading} className="mx-1 px-3 py-1 text-sm font-medium rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50">{totalPages}</button>
        </>
      )}

      <button
        onClick={handleNext}
        disabled={isLoading || currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
      >
        Berikutnya
      </button>
    </div>
  );
};

export default Pagination;
