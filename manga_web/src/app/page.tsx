"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // Menggunakan next/image untuk optimasi

// Definisi tipe data yang lebih detail untuk manga dan relasinya
type MangaTag = {
  id: string;
  type: "tag";
  attributes: {
    name: { [lang: string]: string }; // Nama tag dalam berbagai bahasa
    group: string; // Grup tag, misal: "genre", "theme", "format"
  };
};

type MangaRelationship = {
  id: string;
  type: "cover_art" | "tag" | string; // Tipe relasi, bisa cover_art, tag, atau lainnya
  attributes?: { // Atribut bersifat opsional, tergantung pada parameter 'includes' saat fetch
    fileName?: string; // Nama file untuk cover_art
    name?: { [lang: string]: string }; // Nama untuk tag (jika di-include)
    group?: string; // Grup untuk tag (jika di-include)
  };
};

type Manga = {
  id: string;
  type: "manga";
  attributes: {
    title: { [lang: string]: string }; // Judul manga dalam berbagai bahasa
    altTitles: { [lang: string]: string }[]; // Judul alternatif
    description: { [lang: string]: string }; // Deskripsi manga
    year: number | null; // Tahun rilis manga
    tags: MangaTag[]; // Daftar tag (termasuk genre, tema, dll.)
  };
  relationships: MangaRelationship[]; // Relasi manga, seperti cover art
};

// Komponen untuk menampilkan satu kartu Manga
const MangaCard = ({ manga }: { manga: Manga }) => {
  // Fungsi untuk mendapatkan URL cover art
  const getCoverUrl = (mangaItem: Manga): string => {
    const coverRel = mangaItem.relationships.find(
      (rel) => rel.type === "cover_art"
    );
    // Jika relasi cover_art atau atribut fileName tidak ditemukan, gunakan placeholder
    if (!coverRel || !coverRel.attributes || !coverRel.attributes.fileName) {
      return "https://placehold.co/256x362/1F2937/E5E7EB?text=Tanpa+Sampul"; // Placeholder dengan teks "Tanpa Sampul"
    }
    const fileName = coverRel.attributes.fileName;
    // Konstruksi URL cover art dengan ukuran 256px
    return `https://uploads.mangadex.org/covers/${mangaItem.id}/${fileName}.256.jpg`;
  };

  // Mendapatkan judul manga (prioritas bahasa Inggris, lalu bahasa pertama yang tersedia)
  const title = manga.attributes.title.en || manga.attributes.title[Object.keys(manga.attributes.title)[0]] || "Tanpa Judul";
  // Mendapatkan tahun rilis, atau "N/A" jika tidak tersedia
  const year = manga.attributes.year || "N/A";
  // Mendapatkan genre: filter tag dengan grup "genre", ambil nama bahasa Inggris, batasi 3 genre
  const genres = manga.attributes.tags
    .filter((tag) => tag.attributes.group === "genre")
    .map((tag) => tag.attributes.name.en)
    .slice(0, 3);

  const coverUrl = getCoverUrl(manga);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full">
      {/* Kontainer untuk gambar dengan rasio aspek tetap */}
      <div className="relative w-full aspect-[256/362]"> {/* Rasio aspek umum untuk sampul buku */}
        <Image
          src={coverUrl}
          alt={`Sampul untuk ${title}`}
          fill // Mengisi kontainer
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" // Ukuran responsif
          style={{ objectFit: "cover" }} // Memastikan gambar menutupi area tanpa distorsi
          priority={false} // Atur ke true untuk gambar LCP (Largest Contentful Paint)
          // Jangan optimasi gambar placeholder dari placehold.co
          unoptimized={coverUrl.startsWith("https://placehold.co")}
          onError={(e) => {
            // Ganti dengan placeholder jika gambar gagal dimuat
            (e.target as HTMLImageElement).src = "https://placehold.co/256x362/1F2937/E5E7EB?text=Gagal+Muat";
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-white truncate mb-1" title={title}>
          {title}
        </h2>
        <p className="text-sm text-gray-400 mb-2">Tahun: {year}</p>
        <div className="flex flex-wrap gap-1 mt-auto pt-2"> {/* mt-auto mendorong genre ke bawah */}
          {genres.length > 0 ? (
            genres.map((genre, index) => (
              <span
                key={index}
                className="bg-sky-700 text-sky-100 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-xs">Tanpa Genre</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Komponen utama halaman list manga
export default function MangaListPage() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fungsi untuk mengambil daftar manga dari API MangaDex
    const fetchMangaList = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mengambil 20 manga terpopuler dalam bahasa Inggris, termasuk data cover art
        const res = await fetch(
          "https://api.mangadex.org/manga?limit=20&availableTranslatedLanguage[]=en&order[followedCount]=desc&includes[]=cover_art"
        );
        if (!res.ok) {
          // Tangani error jika respons tidak OK
          const errorData = await res.json();
          throw new Error(`Kesalahan API (${res.status}): ${errorData.errors?.[0]?.detail || res.statusText}`);
        }
        const data = await res.json();
        setMangaList(data.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Gagal mengambil daftar manga.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaList();
  }, []); // useEffect hanya dijalankan sekali saat komponen dimuat

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-gray-900 text-white">
      <header className="w-full max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-sky-400">
          Penjelajah MangaDex
        </h1>
      </header>

      {/* Tampilkan pesan loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-64">
          <svg className="animate-spin h-10 w-10 text-sky-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-gray-300">Memuat manga...</p>
        </div>
      )}

      {/* Tampilkan pesan error jika ada */}
      {error && (
         <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative w-full max-w-md mx-auto text-center" role="alert">
          <strong className="font-bold">Oops! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Tampilkan daftar manga jika tidak loading dan tidak ada error */}
      {!loading && !error && mangaList.length === 0 && (
        <p className="text-xl text-gray-400">Tidak ada manga yang ditemukan.</p>
      )}

      {!loading && !error && mangaList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 w-full max-w-7xl">
          {mangaList.map((manga) => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </div>
      )}
    </main>
  );
}
