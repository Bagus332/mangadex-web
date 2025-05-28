// src/app/manga/[id]/page.tsx
"use client";

import { useParams } from "next/navigation"; // Menggunakan next/navigation untuk App Router
import Link from "next/link";
import { useMangaDetails } from "@/hooks/useManga"; // Impor custom hook
import MangaCoverInfo from "@/components/manga/detail/MangaCoverInfo";
import MangaAttributes from "@/components/manga/detail/MangaAttributes";
import LoadingSpinner from "@/components/ui/LoadingSpinner"; // Impor komponen LoadingSpinner
import MangaChapterList from "@/components/manga/detail/MangaChapterList";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function MangaDetailPage() {
  const params = useParams();
  // Pastikan params.id adalah string tunggal, atau null jika tidak valid
  const mangaId = typeof params.id === 'string' ? params.id : null;

  // Gunakan custom hook untuk mengambil data detail manga dan chapternya
  const { manga, chapters, loading, error } = useMangaDetails(mangaId);

  // Tampilan saat data sedang dimuat
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
        <LoadingSpinner size="lg" text="Memuat detail manga..." className="text-sky-400" />
        <p className="mt-4 text-lg text-gray-300">Mohon tunggu, kami sedang mengambil data manga.</p>
      </div>
    );
  }

  // Tampilan jika terjadi error atau manga tidak ditemukan
  if (error || !manga) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
        <ErrorMessage message={error || "Manga tidak ditemukan atau gagal dimuat."} className="w-full max-w-md" />
        <Link href="/" className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
            Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Tampilan utama halaman detail manga
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        {/* Tombol kembali ke daftar manga */}
        <div className="mb-6 print:hidden"> {/* Sembunyikan tombol kembali saat print */}
          <Link href="/" className="text-sky-400 hover:text-sky-300 transition-colors duration-200 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Daftar Manga
          </Link>
        </div>

        {/* Layout grid untuk informasi manga */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Kolom kiri: Cover dan info singkat */}
          <MangaCoverInfo manga={manga} />

          {/* Kolom kanan: Atribut manga dan daftar chapter */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <MangaAttributes manga={manga} />
            <MangaChapterList chapters={chapters} />
          </div>
        </div>
      </div>
    </div>
  );
}
