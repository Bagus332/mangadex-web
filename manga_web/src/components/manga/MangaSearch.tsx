// src/components/manga/MangaSearch.tsx
"use client";

import React, { useState, FormEvent } from 'react';

interface MangaSearchProps {
  onSearch: (query: string) => void; // Fungsi callback saat pencarian dilakukan
  initialQuery?: string;
  isLoading?: boolean;
}

const MangaSearch: React.FC<MangaSearchProps> = ({ onSearch, initialQuery = "", isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto mb-8">
      <div className="flex items-center border-b-2 border-sky-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500"
          type="text"
          placeholder="Cari manga..."
          aria-label="Cari manga"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="flex-shrink-0 bg-sky-600 hover:bg-sky-700 border-sky-600 hover:border-sky-700 text-sm border-4 text-white py-1 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Cari'
          )}
        </button>
      </div>
    </form>
  );
};

export default MangaSearch;
