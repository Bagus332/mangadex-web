// src/app/read/[chapterId]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
// import Image from "next/image"; // Dihapus karena kita pakai <img> standar
// import Link from "next/link"; // Dihapus jika tidak ada Link lain
import { getChapterPagesData } from "@/lib/api";
import type { AtHomeServerResponse } from "@/types/manga";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

interface MangaReaderViewProps {
  imageUrls: string[];
  onReturnToDetails: () => void;
  isLoading?: boolean; // Tambahkan prop isLoading jika diperlukan di sini
}

const MangaReaderView: React.FC<MangaReaderViewProps> = ({
  imageUrls,
  onReturnToDetails,
  isLoading // Terima prop isLoading
}) => {

  // Logika paginasi (currentPageIndex, handlePreviousPage, handleNextPage) dihapus

  // useEffect untuk navigasi keyboard (panah kiri/kanan) juga dihapus karena tidak relevan untuk long strip
  // Anda bisa menambahkan navigasi scroll dengan PageUp/PageDown jika diinginkan

  return (
    // Kontainer utama MangaReaderView, mengambil tinggi penuh dan lebar penuh dari parentnya
    <div className="flex flex-col items-center w-full h-full relative">
      {/* Navigasi Atas (Fixed) - Disederhanakan */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-3 flex justify-start items-center z-50 print:hidden shadow-lg h-16">
        <button
          onClick={onReturnToDetails}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          &lt; Kembali
        </button>
        {/* Anda bisa menambahkan judul chapter di sini jika datanya tersedia */}
      </div>

      {/* Kontainer Gambar Utama - Scrollable, mengambil ruang yang tersisa */}
      {/* pt-16 untuk memberi ruang bagi navigasi atas yang fixed */}
      <div className="w-full flex-grow overflow-y-auto pt-16">
        {imageUrls.length > 0 ? (
          // Kontainer untuk semua gambar, akan membuat gambar mengisi lebar
          <div className="w-full lg:max-w-4xl mx-auto px-4 sm:px-6">
            {imageUrls.map((url, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index} // Menggunakan index sebagai key, atau URL jika dijamin unik
                src={url}
                alt={`Halaman manga ${index + 1}`}
                // w-full: lebar gambar akan mengisi kontainer parentnya
                // h-auto: tinggi akan menyesuaikan untuk menjaga rasio aspek
                // block: untuk menghilangkan spasi ekstra di bawah gambar inline
                // object-contain: memastikan seluruh gambar terlihat, tidak terpotong.
                className="w-full h-auto block object-contain bg-black" // bg-black atau bg-gray-700 untuk latar belakang jika gambar memiliki transparansi
              />
            ))}
            {/* Footer Akhir Chapter - Ditampilkan setelah semua gambar */}
            <div className="mt-8 p-6 flex flex-col sm:flex-row justify-around items-center z-10 print:hidden border-t-2 border-gray-700 bg-gray-800 shadow-inner">
              <p className="text-xl text-sky-300 mb-3 sm:mb-0 font-semibold">Akhir Chapter</p>
              <button
                onClick={onReturnToDetails}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
              >
                Kembali ke Detail Manga
              </button>
            </div>
          </div>
        ) : (
          // Tampilkan pesan jika tidak ada gambar atau sedang loading
          <div className="flex-grow flex items-center justify-center text-gray-400 text-xl p-8">
            {isLoading ? "Memuat gambar..." : "Tidak ada gambar untuk chapter ini."}
          </div>
        )}
      </div>
      {/* Navigasi Bawah (Fixed) yang lama telah dihapus */}
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

  const handleReturnToDetails = useCallback(() => {
    router.back(); // Kembali ke halaman sebelumnya (biasanya halaman detail manga)
  }, [router]);


  useEffect(() => {
    if (chapterId) {
      console.log(`[ChapterReadPage] useEffect dijalankan dengan chapterId: ${chapterId}`);
      const loadChapterImages = async () => {
        setIsLoading(true);
        setError(null);
        setImageUrls([]); // Kosongkan gambar sebelumnya saat memuat chapter baru
        try {
          const pagesDataResponse: AtHomeServerResponse | null = await getChapterPagesData(chapterId);
          if (pagesDataResponse && pagesDataResponse.result === "ok") {
            const { baseUrl, chapter } = pagesDataResponse;
            const qualityMode = "data"; // Gunakan "data" untuk kualitas original, atau "data-saver"
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

  // Tampilan loading utama untuk seluruh halaman
  if (isLoading && imageUrls.length === 0) { // Hanya tampilkan loading utama jika belum ada gambar sama sekali
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
    // overflow-hidden untuk mencegah scroll bar ganda dari body/html jika konten pas
    <div className="h-screen w-screen bg-gray-800 flex flex-col overflow-hidden">
      <MangaReaderView
        imageUrls={imageUrls}
        onReturnToDetails={handleReturnToDetails}
        isLoading={isLoading} // Teruskan state isLoading ke MangaReaderView
      />
    </div>
  );
}
