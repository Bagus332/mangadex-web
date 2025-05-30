// src/app/read/[chapterId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getChapterPagesData } from "@/lib/api";
import type { AtHomeServerResponse } from "@/types/manga";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

// Komponen untuk menampilkan gambar dan navigasi
const MangaReaderView = ({ imageUrls, initialPage = 0 }: { imageUrls: string[]; initialPage?: number }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPage);

  if (imageUrls.length === 0) {
    return <ErrorMessage message="Tidak ada gambar untuk ditampilkan." />;
  }

  const handlePreviousPage = () => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPageIndex((prev) => Math.min(imageUrls.length - 1, prev + 1));
  };

  // Handle navigasi keyboard
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageIndex]); // Re-bind if index changes, though not strictly necessary for these handlers

  return (
    <div className="flex flex-col items-center w-full">
      {/* Navigasi Atas */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-80 p-3 flex justify-between items-center z-50 print:hidden">
        <button
          onClick={handlePreviousPage}
          disabled={currentPageIndex === 0}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          &lt; Sebelumnya
        </button>
        <span className="text-lg font-medium text-gray-200">
          Halaman {currentPageIndex + 1} dari {imageUrls.length}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPageIndex === imageUrls.length - 1}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Berikutnya &gt;
        </button>
      </div>

      {/* Kontainer Gambar Utama */}
      <div className="mt-20 mb-20 w-full max-w-3xl flex justify-center items-start min-h-[calc(100vh-160px)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={imageUrls[currentPageIndex]} // Key untuk re-render jika src berubah
          src={imageUrls[currentPageIndex]}
          alt={`Halaman manga ${currentPageIndex + 1}`}
          className="max-w-full max-h-[calc(100vh-180px)] h-auto object-contain rounded shadow-lg"
          // Menggunakan <img> standar untuk kesederhanaan dan menghindari masalah konfigurasi hostname next/image untuk domain MangaDex@Home yang dinamis
          // Anda bisa menggunakan next/image jika Anda mengelola proxy atau daftar hostname yang diizinkan
        />
      </div>

       {/* Navigasi Bawah (opsional, bisa sama dengan yang atas) */}
       <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-80 p-3 flex justify-between items-center z-50 print:hidden">
         <button
          onClick={handlePreviousPage}
          disabled={currentPageIndex === 0}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          &lt; Sebelumnya
        </button>
        <span className="text-lg font-medium text-gray-200">
          Halaman {currentPageIndex + 1} dari {imageUrls.length}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPageIndex === imageUrls.length - 1}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Berikutnya &gt;
        </button>
      </div>
    </div>
  );
};


export default function ChapterReadPage() {
  const params = useParams();
  const chapterId = typeof params.chapterId === 'string' ? params.chapterId : null;
  const router = useRouter(); // Untuk tombol kembali

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State untuk menyimpan mangaId jika Anda ingin tombol kembali yang lebih spesifik
  // const [mangaIdForBackButton, setMangaIdForBackButton] = useState<string | null>(null);


  useEffect(() => {
    if (chapterId) {
      const loadChapterImages = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const pagesDataResponse: AtHomeServerResponse | null = await getChapterPagesData(chapterId);
          if (pagesDataResponse && pagesDataResponse.result === "ok") {
            const { baseUrl, chapter } = pagesDataResponse;
            // Pilih kualitas gambar (data untuk original, dataSaver untuk hemat data)
            const qualityMode = "data"; // atau "data-saver"
            const constructedImageUrls = chapter[qualityMode].map(
              (fileName) => `${baseUrl}/${qualityMode}/${chapter.hash}/${fileName}`
            );
            setImageUrls(constructedImageUrls);

            // Jika Anda ingin mengambil mangaId untuk tombol kembali:
            // Anda perlu cara untuk mendapatkan mangaId dari chapterId.
            // Ini mungkin memerlukan panggilan API tambahan ke /chapter/{chapterId} untuk mendapatkan relasi manga.
            // Atau, jika Anda menavigasi dari halaman detail manga, Anda bisa meneruskan mangaId melalui query params atau state.
            // Contoh sederhana:
            // const chapterDetails = await fetch(`https://api.mangadex.org/chapter/${chapterId}?includes[]=manga`);
            // const chapterDetailsJson = await chapterDetails.json();
            // const mangaRel = chapterDetailsJson.data.relationships.find((r: any) => r.type === 'manga');
            // if (mangaRel) setMangaIdForBackButton(mangaRel.id);

          } else {
            setError(pagesDataResponse?.errors?.[0]?.detail || "Gagal memuat data halaman chapter.");
          }
        } catch (err: any) {
          setError(err.message || "Terjadi kesalahan saat memuat halaman chapter.");
          console.error("[ChapterReadPage] Error loading chapter images:", err);
        } finally {
          setIsLoading(false);
        }
      };
      loadChapterImages();
    } else {
      setError("ID Chapter tidak valid.");
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
            onClick={() => router.back()} // Kembali ke halaman sebelumnya
            className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
            Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center pt-4 pb-4">
        {/* Tombol kembali yang lebih kontekstual bisa ditambahkan di sini jika mangaIdForBackButton ada */}
        {/* <Link href={mangaIdForBackButton ? `/manga/${mangaIdForBackButton}` : "/"} className="fixed top-4 left-4 z-50 ...">Kembali ke Detail Manga</Link> */}
      <MangaReaderView imageUrls={imageUrls} />
    </div>
  );
}
