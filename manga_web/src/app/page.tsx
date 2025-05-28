"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchMangaList } from "@/lib/api"; // Menggunakan alias path @/lib/
import type { Manga, MangaDexListResponse, CoverArtAttributes, MangaRelationship } from "@/types/manga"; // Menggunakan alias path @/types/

// --- Komponen Placeholder Sederhana (akan dipindah nanti) ---

// Tipe prop untuk MangaCard
interface MangaCardProps {
  manga: Manga;
}

// Komponen MangaCard Sederhana
const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
  // Fungsi untuk mendapatkan URL cover art dari relasi
  const getCoverUrl = (mangaItem: Manga): string => {
    const coverArtRelationship = mangaItem.relationships.find(
      (rel): rel is MangaRelationship<CoverArtAttributes> => rel.type === "cover_art"
    );
    if (coverArtRelationship?.attributes?.fileName) {
      return `https://uploads.mangadex.org/covers/${mangaItem.id}/${coverArtRelationship.attributes.fileName}.256.jpg`;
    }
    return "https://placehold.co/256x362/1F2937/E5E7EB?text=Tanpa+Sampul"; // Fallback
  };

  const title = manga.attributes.title.en || manga.attributes.title[Object.keys(manga.attributes.title)[0]] || "Tanpa Judul";
  const year = manga.attributes.year || "N/A";
  const genres = manga.attributes.tags
    .filter((tag) => tag.attributes.group === "genre")
    .map((tag) => tag.attributes.name.en)
    .slice(0, 2); // Ambil 2 genre pertama untuk kesederhanaan

  const coverUrl = getCoverUrl(manga);

  return (
    <Link href={`/manga/${manga.id}`} passHref legacyBehavior>
      <a className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full group">
        <div className="relative w-full aspect-[256/362]">
          <Image
            src={coverUrl}
            alt={`Sampul untuk ${title}`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 15vw"
            style={{ objectFit: "cover" }}
            className="group-hover:opacity-90 transition-opacity duration-300"
            unoptimized={coverUrl.startsWith("https://placehold.co")}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/256x362/1F2937/E5E7EB?text=Gagal+Muat";
            }}
          />
        </div>
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <h3 className="text-sm sm:text-md font-semibold text-white truncate group-hover:text-sky-400 transition-colors duration-300" title={title}>
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mb-1">Tahun: {year}</p>
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {genres.length > 0 ? (
              genres.map((genre, index) => (
                <span
                  key={index}
                  className="bg-sky-700 text-sky-100 text-[10px] sm:text-xs px-2 py-0.5 rounded-full"
                >
                  {genre}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-xs">Tanpa Genre</span>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};

// Tipe prop untuk MangaGrid
interface MangaGridProps {
  mangaList: Manga[];
}

// Komponen MangaGrid Sederhana
const MangaGrid: React.FC<MangaGridProps> = ({ mangaList }) => {
  if (!mangaList || mangaList.length === 0) {
    return <p className="text-gray-400 text-center col-span-full">Tidak ada manga yang ditemukan.</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 w-full max-w-screen-2xl mx-auto">
      {mangaList.map((manga) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
    </div>
  );
};

// --- Halaman Utama ---
export default function HomePage() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [totalManga, setTotalManga] = useState(0);
  const limit = 24; // Jumlah manga per halaman/permintaan

  useEffect(() => {
    // Fungsi untuk mengambil daftar manga
    const loadManga = async (currentOffset: number) => {
      setLoading(true);
      // Jangan set error ke null di sini jika ingin mempertahankan error sebelumnya saat load more gagal
      // setError(null);
      try {
        const response = await fetchMangaList({
          limit: limit,
          offset: currentOffset,
          includes: ["cover_art"], // Pastikan cover_art di-include
          order: { followedCount: "desc" }, // Contoh urutan
          availableTranslatedLanguage: ["en", "id"], // Cari bahasa Inggris atau Indonesia
          contentRating: ["safe", "suggestive"], // Filter rating konten
        });

        if (response && response.result === "ok") {
          // Jika ini adalah pengambilan pertama (offset 0), ganti list
          // Jika bukan, tambahkan ke list yang sudah ada (untuk infinite scroll/load more)
          setMangaList(prevList => currentOffset === 0 ? response.data : [...prevList, ...response.data]);
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

    loadManga(offset);
  }, [offset]); // Jalankan ulang efek jika offset berubah

  // Fungsi untuk memuat lebih banyak manga
  const loadMoreManga = () => {
    if (mangaList.length < totalManga && !loading) {
      setOffset(prevOffset => prevOffset + limit);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8 bg-gray-900 text-white">
      <header className="w-full max-w-6xl mx-auto mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-400">
          Jelajah Manga Populer
        </h1>
        {/* Di sini bisa ditambahkan komponen MangaSearch nantinya */}
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
          <svg className="animate-spin h-10 w-10 text-sky-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-300">Memuat manga...</p>
        </div>
      )}

      {/* Tombol Load More */}
      {!loading && mangaList.length > 0 && mangaList.length < totalManga && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMoreManga}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={loading}
          >
            Muat Lebih Banyak
          </button>
        </div>
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
