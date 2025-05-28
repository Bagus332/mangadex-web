/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { fetchMangaList } from "@/lib/api";
import MangaGrid from "@/components/manga/MangaGrid";
import MangaCard from "@/components/manga/MangaCard";
import MangaSearch from "@/components/manga/MangaSearch";
import Pagination from "@/components/ui/Pagination";
import type { Manga, MangaDexListResponse, CoverArtAttributes, MangaRelationship } from "@/types/manga";

// --- Halaman Utama ---
export default function HomePage() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalManga, setTotalManga] = useState(0); // Add this line
  const limit = 24; // Jumlah manga per halaman

  const totalPages = Math.ceil(totalManga / limit);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset ke halaman pertama saat melakukan pencarian baru
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Fungsi untuk mengambil daftar manga
    const loadManga = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * limit;
        const response = await fetchMangaList({
          limit: limit,
          offset: offset,
          includes: ["cover_art"], // Pastikan cover_art di-include
          order: { followedCount: "desc" }, // Contoh urutan
          availableTranslatedLanguage: ["en", "id"], // Cari bahasa Inggris atau Indonesia
          contentRating: ["safe", "suggestive"], // Filter rating konten
          title: searchQuery, // Tambahkan query pencarian jika ada
        });

        if (response && response.result === "ok") {
          setMangaList(response.data);
          setTotalManga(response.total);
          setError(null); // Hapus error jika berhasil
        } else {
          // Tangani kasus di mana response.result bukan 'ok' atau response null
          const errorMessage = response?.errors?.[0]?.detail || "Gagal mengambil data manga.";
          setError(errorMessage);
          console.error("Failed to fetch manga:", response);
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat menghubungi server.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadManga();
  }, [currentPage, searchQuery]); // Tambahkan searchQuery sebagai dependency

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8 bg-gray-900 text-white">
      <header className="w-full max-w-6xl mx-auto mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-400 mb-8">
          Jelajah Manga Populer
        </h1>
        <MangaSearch 
          onSearch={handleSearch}
          initialQuery={searchQuery}
          isLoading={loading}
        />
      </header>

      {/* Tampilan error utama */}
      {error && !loading && mangaList.length === 0 && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative w-full max-w-md mx-auto text-center my-4" role="alert">
          <strong className="font-bold">Oops! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Grid Manga */}
      <MangaGrid mangaList={mangaList} />

      {/* Indikator Loading di tengah atau bawah */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8 w-full">
          <p className="text-lg text-gray-300">Memuat manga...</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && mangaList.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={loading}
        />
      )}

      {/* Tampilan error saat load more (jika ada error tapi list tidak kosong) */}
      {error && mangaList.length > 0 && (
        <div className="bg-yellow-700 border border-yellow-600 text-yellow-100 px-4 py-2 rounded-md relative w-full max-w-md mx-auto text-center my-4 text-sm" role="alert">
          <span className="block sm:inline">Gagal memuat data tambahan: {error}</span>
        </div>
      )}

    </main>
  );
}
