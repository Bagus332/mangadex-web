// src/app/read/[chapterId]/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
// import Image from "next/image"; // Komentari jika tidak digunakan secara langsung di sini
// import Link from "next/link"; // Komentari jika tidak digunakan secara langsung di sini
import { getChapterPagesData } from "@/lib/api";
import type { AtHomeServerResponse } from "@/types/manga";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

// Komponen untuk menampilkan gambar dan navigasi
interface MangaReaderViewProps {
  imageUrls: string[];
  initialPage?: number;
  onReturnToDetails: () => void; // Callback untuk kembali ke detail manga
  // Anda bisa menambahkan callback untuk chapter berikutnya jika ada
  // onNavigateToNextChapter?: () => void;
}

const MangaReaderView: React.FC<MangaReaderViewProps> = ({
  imageUrls,
  initialPage = 0,
  onReturnToDetails,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPage);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Header collapse state
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  // Responsiveness: no need to set container width, just use max-w-full and responsive paddings

  // Header auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowHeader(false); // scrolling down
      } else {
        setShowHeader(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPageIndex((prev) => Math.min(imageUrls.length - 1, prev + 1));
  }, [imageUrls.length]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageWidth(imageRef.current.naturalWidth);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePreviousPage();
      } else if (event.key === "ArrowRight") {
        handleNextPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePreviousPage, handleNextPage]);

  if (imageUrls.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <ErrorMessage message="Tidak ada gambar untuk ditampilkan." />
      </div>
    );
  }

  const isLastPage = currentPageIndex === imageUrls.length - 1;
  const currentImageUrl = imageUrls[currentPageIndex];

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      {/* Responsive & Collapsible Header */}
        <header
            className={`fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-3 flex justify-between items-center z-50 transition-transform duration-300 ${
            showHeader ? "translate-y-0" : "-translate-y-full"
            } print:hidden shadow-lg`}
            >
            <button
                onClick={onReturnToDetails}
                className="absolute top-4 left-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
                Kembali
            </button>
        </header>

      {/* Responsive Image Container */}
      <div className="flex-grow flex justify-center items-center overflow-x-auto pt-14 sm:pt-16 pb-14 sm:pb-16 px-1 sm:px-2 w-full">
        {currentImageUrl ? (
          <img
            key={currentImageUrl}
            ref={imageRef}
            src={currentImageUrl}
            alt={`Halaman manga ${currentPageIndex + 1}`}
            className="object-contain rounded shadow-lg bg-gray-700 w-full max-w-full h-auto max-h-[80vh] sm:max-h-[90vh] transition-all"
            onLoad={handleImageLoad}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        ) : (
          <div className="text-gray-400">Memuat gambar...</div>
        )}
        {/* Navigasi Bawah (Fixed) - Konten berubah berdasarkan halaman terakhir */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-3 flex justify-around items-center z-50 print:hidden shadow-lg h-16">
        {isLastPage ? (
          <>
            <span className="text-lg text-sky-300 font-semibold">Akhir Chapter</span>
            <button
              onClick={onReturnToDetails}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Kembali ke Detail
            </button>
            {/* <button
              // onClick={onNavigateToNextChapter} // Jika ada fungsi untuk chapter berikutnya
              disabled // Sementara disable
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Chapter Berikutnya
            </button> */}
          </>
        ) : (
          <>
            <button
          onClick={handlePreviousPage}
          disabled={currentPageIndex === 0}
          className="bg-transparent hover:bg-sky-700 text-white font-semibold py-1 px-3 sm:py-2 sm:px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          &lt;
        </button>
        <span className="text-base sm:text-lg font-medium text-gray-200 truncate px-2 ">
          {currentPageIndex + 1} / {imageUrls.length}
        </span>
        <button
          onClick={handleNextPage}
          disabled={isLastPage}
          className="bg-transparent hover:bg-sky-700 text-white font-semibold py-1 px-3 sm:py-2 sm:px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          &gt;
        </button>
          </>
        )}
        </div>
      </div>
    </div>
  );
};


export default function ChapterReadPage() {
  const params = useParams();
  const router = useRouter();

  const chapterIdFromParams = params.chapterid;
  const chapterId = typeof chapterIdFromParams === 'string' ? chapterIdFromParams : null;

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Callback untuk tombol kembali di footer
  const handleReturnToDetails = useCallback(() => {
    router.back(); // Atau navigasi ke halaman detail manga jika ID manga diketahui
  }, [router]);


  useEffect(() => {
    if (chapterId) {
      console.log(`[ChapterReadPage] useEffect dijalankan dengan chapterId: ${chapterId}`);
      const loadChapterImages = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const pagesDataResponse: AtHomeServerResponse | null = await getChapterPagesData(chapterId);
          if (pagesDataResponse && pagesDataResponse.result === "ok") {
            const { baseUrl, chapter } = pagesDataResponse;
            const qualityMode = "data";
            const constructedImageUrls = chapter[qualityMode].map(
              (fileName) => `${baseUrl}/${qualityMode}/${chapter.hash}/${fileName}`
            );
            setImageUrls(constructedImageUrls);
            console.log(`[ChapterReadPage] Berhasil memuat ${constructedImageUrls.length} gambar.`);
          } else {
            const apiError = pagesDataResponse?.errors?.[0]?.detail || "Gagal memuat data halaman chapter dari API.";
            console.error("[ChapterReadPage] Error dari API saat memuat halaman:", apiError, pagesDataResponse);
            setError(apiError);
          }
        } catch (err: any) {
          console.error("[ChapterReadPage] Error saat fetch halaman chapter:", err);
          setError(err.message || "Terjadi kesalahan saat memuat halaman chapter.");
        } finally {
          setIsLoading(false);
        }
      };
      loadChapterImages();
    } else {
      console.warn("[ChapterReadPage] useEffect: ID Chapter tidak valid atau null, mengatur error.");
      setError("ID Chapter tidak valid atau tidak ditemukan di URL.");
      setIsLoading(false);
    }
  }, [chapterId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-8">
        <LoadingSpinner text="Memuat halaman manga..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-8">
        <ErrorMessage title="Gagal Memuat Chapter" message={error} className="w-full max-w-md" />
        <button
            onClick={() => router.back()}
            className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
            Kembali
        </button>
      </div>
    );
  }

  return (
    // Kontainer utama halaman pembaca, pastikan mengambil tinggi penuh layar
    <div className="h-screen w-screen bg-gray-800 flex flex-col overflow-hidden">
      <MangaReaderView imageUrls={imageUrls} onReturnToDetails={handleReturnToDetails} />
    </div>
  );
}
