/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { fetchMangaList } from "@/lib/api";
import type { Manga } from "@/types/manga";
import MangaGrid from "@/components/manga/MangaGrid";
import MangaSearch from "@/components/manga/MangaSearch";
import Pagination from "@/components/ui/Pagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

const ITEMS_PER_PAGE = 24;

// --- Halaman Utama ---
export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalManga, setTotalManga] = useState(0);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  const loadManga = useCallback(async (query: string, page: number) => {
    setIsLoading(true);
    setError(null);

    const offset = (page - 1) * ITEMS_PER_PAGE;

    try {
      const response = await fetchMangaList({
        limit: ITEMS_PER_PAGE,
        offset: offset,
        title: query || undefined,
        includes: ["cover_art"],
        order: query ? { relevance: "desc" } : { followedCount: "desc" },
        availableTranslatedLanguage: ["en", "id"],
        contentRating: ["safe", "suggestive"],
      });

      if (response && response.result === "ok") {
        setMangaList(response.data);
        setTotalManga(response.total);
      } else {
        const errorMessage = response?.errors?.[0]?.detail || "Gagal mengambil data manga.";
        setError(errorMessage);
        setMangaList([]);
        setTotalManga(0);
        console.error("Failed to fetch manga:", response);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menghubungi server.");
      setMangaList([]);
      setTotalManga(0);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialQueryFromUrl = searchParams.get('q') || '';
    const initialPageFromUrl = Number(searchParams.get('page')) || 1;

    loadManga(searchQuery, currentPage);

    if (searchQuery !== initialQueryFromUrl || currentPage !== initialPageFromUrl) {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.set('q', searchQuery);
      }
      if (currentPage > 1) {
        params.set('page', currentPage.toString());
      }
      const queryString = params.toString();
      router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    }
  }, [searchQuery, currentPage, loadManga, pathname, router, searchParams]);

  const handleSearch = (query: string) => {
    if (query !== searchQuery) {
      setSearchQuery(query);
      setCurrentPage(1);
    } else if (!query && searchQuery) {
      setSearchQuery('');
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const totalPages = Math.ceil(totalManga / ITEMS_PER_PAGE);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8 bg-gray-900 text-white">
      <header className="w-full max-w-6xl mx-auto mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-400 mb-6">
          Jelajah MangaDex
        </h1>
        <MangaSearch onSearch={handleSearch} initialQuery={searchQuery} isLoading={isLoading} />
      </header>

      {isLoading && (
        <div className="my-10">
          <LoadingSpinner text="Memuat manga..." size="lg" />
        </div>
      )}

      {!isLoading && error && (
        <ErrorMessage message={error} className="w-full max-w-lg mx-auto my-10" />
      )}

      {!isLoading && !error && mangaList.length === 0 && (
        <p className="text-gray-400 text-xl my-10">
          {searchQuery ? `Tidak ada manga yang cocok dengan pencarian "${searchQuery}".` : "Tidak ada manga yang ditemukan."}
        </p>
      )}

      {!isLoading && !error && mangaList.length > 0 && (
        <>
          <MangaGrid mangaList={mangaList} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </>
      )}
    </main>
  );
}
