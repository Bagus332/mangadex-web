// src/components/manga/MangaSearch.tsx
"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import type { MangaSearchParameters, MangaStatus, MangaContentRating } from '@/types/manga'; // Impor tipe

// Opsi untuk filter
const statusOptions: { value: MangaStatus; label: string }[] = [
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'hiatus', label: 'Hiatus' },
  { value: 'cancelled', label: 'Cancelled' },
];

const contentRatingOptions: { value: MangaContentRating; label: string }[] = [
  { value: 'safe', label: 'Safe' },
  { value: 'suggestive', label: 'Suggestive' },
  { value: 'erotica', label: 'Erotica' },
  // { value: 'pornographic', label: 'Pornographic' }, // Sembunyikan sementara jika tidak diinginkan
];

interface MangaSearchProps {
  onSearch: (filters: MangaSearchParameters) => void;
  initialFilters?: Partial<MangaSearchParameters>; // Bisa parsial
  isLoading?: boolean;
}

const MangaSearch: React.FC<MangaSearchProps> = ({
  onSearch,
  initialFilters = {},
  isLoading = false
}) => {
  const [title, setTitle] = useState(initialFilters.title || '');
  const [year, setYear] = useState(initialFilters.year?.toString() || '');
  const [selectedStatus, setSelectedStatus] = useState<MangaStatus[]>(initialFilters.status || []);
  const [selectedContentRatings, setSelectedContentRatings] = useState<MangaContentRating[]>(initialFilters.contentRating || []);
  const [showFilters, setShowFilters] = useState(false);

  // Sinkronkan state internal jika initialFilters berubah (misalnya dari URL)
  useEffect(() => {
    setTitle(initialFilters.title || '');
    setYear(initialFilters.year?.toString() || '');
    setSelectedStatus(initialFilters.status || []);
    setSelectedContentRatings(initialFilters.contentRating || []);
  }, [initialFilters]);


  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as MangaStatus;
    setSelectedStatus(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  const handleContentRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as MangaContentRating;
    const checked = event.target.checked;
    setSelectedContentRatings(prev =>
      checked ? [...prev, value] : prev.filter(r => r !== value)
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filters: MangaSearchParameters = {
      title: title.trim() || undefined, // Kirim undefined jika kosong agar tidak masuk query
      year: year ? parseInt(year, 10) : undefined,
      status: selectedStatus.length > 0 ? selectedStatus : undefined,
      contentRating: selectedContentRatings.length > 0 ? selectedContentRatings : undefined,
    };
    onSearch(filters);
  };

  const handleResetFilters = () => {
    setTitle('');
    setYear('');
    setSelectedStatus([]);
    setSelectedContentRatings([]);
    // Langsung trigger pencarian dengan filter kosong (atau sesuai logika yang diinginkan)
    onSearch({});
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <input
          className="appearance-none bg-gray-700 border border-gray-600 rounded-md w-full text-gray-200 py-2 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-gray-400"
          type="text"
          placeholder="Cari judul manga..."
          aria-label="Cari manga berdasarkan judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="flex-shrink-0 bg-sky-600 hover:bg-sky-700 text-sm text-white py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Cari'
          )}
        </button>
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="text-sky-400 hover:text-sky-300 text-sm font-medium"
        >
          {showFilters ? 'Sembunyikan Filter Lanjutan' : 'Tampilkan Filter Lanjutan'}
          <span aria-hidden="true">{showFilters ? ' ▲' : ' ▼'}</span>
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 border border-gray-700 rounded-md">
          {/* Filter Tahun */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-1">Tahun Rilis</label>
            <input
              type="number"
              id="year"
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Contoh: 2023"
              className="appearance-none bg-gray-700 border border-gray-600 rounded-md w-full text-gray-200 py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-gray-500"
              disabled={isLoading}
            />
          </div>

          {/* Filter Status (Multiple Select atau Checkbox Group) */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            {/* Menggunakan multiple select untuk status */}
            <select
              id="status"
              name="status"
              multiple
              value={selectedStatus}
              onChange={handleStatusChange}
              className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-md focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 h-32 custom-scrollbar" // Tambahkan tinggi dan scroll
              disabled={isLoading}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value} className="p-1 hover:bg-gray-600">
                  {option.label}
                </option>
              ))}
            </select>
             <p className="mt-1 text-xs text-gray-500">Tahan Ctrl/Cmd untuk memilih lebih dari satu.</p>
          </div>


          {/* Filter Rating Konten (Checkbox Group) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rating Konten</label>
            <div className="space-y-2">
              {contentRatingOptions.map(option => (
                <label key={option.value} htmlFor={`contentRating-${option.value}`} className="flex items-center text-sm text-gray-300 hover:text-sky-300 cursor-pointer">
                  <input
                    type="checkbox"
                    id={`contentRating-${option.value}`}
                    name="contentRating"
                    value={option.value}
                    checked={selectedContentRatings.includes(option.value)}
                    onChange={handleContentRatingChange}
                    className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-sky-600 focus:ring-sky-500 mr-2 cursor-pointer"
                    disabled={isLoading}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
           <div className="sm:col-span-full flex justify-end mt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              disabled={isLoading}
              className="text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 py-1.5 px-3 rounded-md transition-colors duration-150 disabled:opacity-50"
            >
              Reset Filter
            </button>
          </div>
        </div>
      )}
       <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151; /* gray-700 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4B5563; /* gray-600 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6B7280; /* gray-500 */
        }
      `}</style>
    </form>
  );
};

export default MangaSearch;
