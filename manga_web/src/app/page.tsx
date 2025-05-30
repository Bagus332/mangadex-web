// src/app/page.tsx
"use client"; 
import { Suspense } from 'react'; // Import Suspense
// Pindahkan semua impor lain yang spesifik untuk konten halaman ke MangaPageClientContent
import type { Manga, MangaSearchParameters, MangaStatus, MangaContentRating } from "@/types/manga";
import MangaGrid from "@/components/manga/MangaGrid";
import MangaSearch from "@/components/manga/MangaSearch";
import Pagination from "@/components/ui/Pagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { fetchMangaList } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';


const ITEMS_PER_PAGE = 24;

// Fungsi utilitas tetap bisa di luar jika tidak bergantung pada hook React
const parseFiltersFromUrl = (params: URLSearchParams): Partial<MangaSearchParameters> => {
  const filters: Partial<MangaSearchParameters> = {};
  if (params.has('q')) filters.title = params.get('q')!;
  if (params.has('year')) {
    const yearVal = parseInt(params.get('year')!, 10);
    if (!isNaN(yearVal)) filters.year = yearVal;
  }
  if (params.has('status')) filters.status = params.getAll('status') as MangaStatus[];
  if (params.has('contentRating')) filters.contentRating = params.getAll('contentRating') as MangaContentRating[];
  return filters;
};

const buildQueryStringFromFilters = (filters: Partial<MangaSearchParameters>, currentPage: number): string => {
  const params = new URLSearchParams();
  if (filters.title) params.set('q', filters.title);
  if (filters.year) params.set('year', filters.year.toString());
  filters.status?.forEach(s => params.append('status', s));
  filters.contentRating?.forEach(cr => params.append('contentRating', cr));
  if (currentPage > 1) params.set('page', currentPage.toString());
  return params.toString();
};

// Komponen ini akan berisi semua logika client-side dan hooks
function MangaPageClientContent() {
  "use client"; // Tandai komponen internal ini sebagai Client Component

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Hooks digunakan di sini

  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalManga, setTotalManga] = useState(0);

  // Inisialisasi state dari searchParams. Ini aman karena kita sudah di dalam Client Component.
  const [activeFilters, setActiveFilters] = useState<Partial<MangaSearchParameters>>(
    () => parseFiltersFromUrl(searchParams)
  );
  const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get('page')) || 1);

  const loadManga = useCallback(async (filters: Partial<MangaSearchParameters>, page: number) => {
    setIsLoading(true);
    setError(null);
    console.log(`[HomePage] Loading manga with filters:`, filters, `page: ${page}`);

    const offset = (page - 1) * ITEMS_PER_PAGE;

    try {
      const response = await fetchMangaList({
        limit: ITEMS_PER_PAGE,
        offset: offset,
        ...filters,
        includes: ["cover_art"],
        order: (filters.title || filters.year || filters.status?.length || filters.contentRating?.length) ? { relevance: "desc" } : { followedCount: "desc" },
        availableTranslatedLanguage: ["en", "id"],
      });

      if (response && response.result === "ok") {
        setMangaList(response.data);
        setTotalManga(response.total);
      } else {
        const errorMessage = response?.errors?.[0]?.detail || "Gagal mengambil data manga.";
        setError(errorMessage);
        setMangaList([]);
        setTotalManga(0);
        console.error("[HomePage] Failed to fetch manga:", response);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menghubungi server.");
      setMangaList([]);
      setTotalManga(0);
      console.error("[HomePage] Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efek untuk memuat manga ketika filter atau halaman berubah
  useEffect(() => {
    loadManga(activeFilters, currentPage);
  }, [activeFilters, currentPage, loadManga]);

  // Efek untuk memperbarui URL ketika filter atau halaman berubah
  useEffect(() => {
    const newQueryString = buildQueryStringFromFilters(activeFilters, currentPage);
    const currentQueryString = searchParams.toString();
    // Normalisasi untuk perbandingan yang lebih andal (opsional, tapi bisa membantu)
    const normalize = (str: string) => str.split('&').sort().join('&');
    if (normalize(newQueryString) !== normalize(currentQueryString)) {
         router.replace(`${pathname}${newQueryString ? `?${newQueryString}` : ''}`, { scroll: false });
    }
  }, [activeFilters, currentPage, pathname, router, searchParams]);


  const handleSearch = (filters: MangaSearchParameters) => {
    console.log("[HomePage] Search submitted with filters:", filters);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const totalPages = Math.ceil(totalManga / ITEMS_PER_PAGE);

  // Tampilan loading awal sebelum data pertama kali dimuat
  if (isLoading && mangaList.length === 0 && !error) {
     return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-900 text-white">
            <LoadingSpinner text="Memuat manga..." size="lg" />
        </div>
     );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8 bg-gray-900 text-white">
      <header className="w-full max-w-4xl mx-auto mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-400 mb-6">
          Jelajah MangaDex
        </h1>
        <MangaSearch onSearch={handleSearch} initialFilters={activeFilters} isLoading={isLoading} />
      </header>

      {/* Tampilan loading untuk pembaruan data (ketika mangaList sudah ada isinya) */}
      {isLoading && mangaList.length > 0 && (
         <div className="my-10 flex-grow flex items-center justify-center">
            <LoadingSpinner text="Memperbarui daftar..." size="md" />
        </div>
      )}

      {!isLoading && error && (
        <ErrorMessage message={error} className="w-full max-w-lg mx-auto my-10" />
      )}

      {!isLoading && !error && mangaList.length === 0 && (
        <p className="text-gray-400 text-xl my-10 text-center">
          {Object.values(activeFilters).some(val => val !== undefined && (Array.isArray(val) ? val.length > 0 : String(val).trim().length > 0))
            ? "Tidak ada manga yang cocok dengan filter Anda."
            : "Tidak ada manga yang ditemukan."}
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

// Ini adalah komponen default yang diekspor untuk rute "/"
// Ia membungkus komponen client dengan Suspense
export default function Page() {
  return (
    <Suspense fallback={
        // Fallback ini akan ditampilkan saat Next.js menunggu MangaPageClientContent
        // untuk dirender di sisi klien jika terjadi CSR bailout.
        <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-900 text-white">
            <LoadingSpinner text="Memuat halaman..." size="lg" />
        </div>
    }>
      <MangaPageClientContent />
    </Suspense>
  );
}
