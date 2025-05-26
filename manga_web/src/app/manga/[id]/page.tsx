"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Hook untuk mendapatkan parameter rute
import Image from "next/image";

// Definisi tipe data yang sama seperti di page.tsx utama, atau impor dari file bersama
type MangaTag = {
  id: string;
  type: "tag";
  attributes: {
    name: { [lang: string]: string };
    group: string;
  };
};

type MangaRelationship = {
  id: string;
  type: "cover_art" | "author" | "artist" | "tag" | string;
  attributes?: {
    fileName?: string; // Untuk cover_art
    name?: string; // Untuk author/artist (jika di-include dan memiliki atribut ini)
    // ... atribut lain tergantung tipe relasi dan includes
  };
};

type Manga = {
  id: string;
  type: "manga";
  attributes: {
    title: { [lang: string]: string };
    altTitles: { [lang: string]: string }[];
    description: { [lang: string]: string };
    originalLanguage: string;
    lastVolume: string | null;
    lastChapter: string | null;
    publicationDemographic: string | null;
    status: string; // misal: "ongoing", "completed"
    year: number | null;
    contentRating: string;
    tags: MangaTag[];
    state: string; // misal: "published"
    chapterNumbersResetOnNewVolume: boolean;
    createdAt: string;
    updatedAt: string;
    version: number;
    availableTranslatedLanguages: string[];
    latestUploadedChapter: string | null;
  };
  relationships: MangaRelationship[];
};

// Tipe untuk data chapter (disederhanakan)
type Chapter = {
  id: string;
  attributes: {
    volume: string | null;
    chapter: string | null;
    title: string | null;
    translatedLanguage: string;
    pages: number;
    publishAt: string;
    // ... atribut chapter lainnya
  };
  relationships: MangaRelationship[]; // Untuk mendapatkan scanlation group
};

// Fungsi untuk mengambil detail manga spesifik
async function getMangaDetails(id: string): Promise<Manga | null> {
  try {
    // Sertakan relasi yang dibutuhkan seperti author dan artist
    const res = await fetch(
      `https://api.mangadex.org/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`
    );
    if (!res.ok) {
      console.error(`API Error for manga ${id}: ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    return data.data as Manga;
  } catch (error) {
    console.error(`Failed to fetch manga ${id}:`, error);
    return null;
  }
}

// Fungsi untuk mengambil daftar chapter manga (contoh sederhana)
async function getMangaChapters(mangaId: string): Promise<Chapter[]> {
  try {
    const res = await fetch(
      `https://api.mangadex.org/manga/${mangaId}/feed?limit=20&order[volume]=desc&order[chapter]=desc&translatedLanguage[]=en&includes[]=scanlation_group`
    );
    if (!res.ok) {
      console.error(`API Error for chapters of manga ${mangaId}: ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return data.data as Chapter[];
  } catch (error) {
    console.error(`Failed to fetch chapters for manga ${mangaId}:`, error);
    return [];
  }
}


export default function MangaDetailPage() {
  const params = useParams(); // Mendapatkan parameter dari URL
  const mangaId = params.id as string; // ID manga dari URL

  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mangaId) {
      const loadMangaData = async () => {
        setLoading(true);
        setError(null);
        try {
          const mangaDetails = await getMangaDetails(mangaId);
          if (mangaDetails) {
            setManga(mangaDetails);
            const chapterList = await getMangaChapters(mangaId);
            setChapters(chapterList);
          } else {
            setError("Manga tidak ditemukan atau gagal dimuat.");
          }
        } catch (err: any) {
          setError(err.message || "Terjadi kesalahan saat memuat data manga.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadMangaData();
    }
  }, [mangaId]); // Jalankan ulang efek jika mangaId berubah

  // Fungsi untuk mendapatkan URL cover art utama
  const getMainCoverUrl = (mangaItem: Manga | null): string => {
    if (!mangaItem) return "https://placehold.co/300x450/1F2937/E5E7EB?text=Memuat...";
    const coverRel = mangaItem.relationships.find(
      (rel) => rel.type === "cover_art"
    );
    if (!coverRel || !coverRel.attributes || !coverRel.attributes.fileName) {
      return "https://placehold.co/300x450/1F2937/E5E7EB?text=Tanpa+Sampul";
    }
    const fileName = coverRel.attributes.fileName;
    // Gunakan ukuran yang lebih besar untuk halaman detail, misal .512.jpg atau tanpa akhiran untuk original
    return `https://uploads.mangadex.org/covers/${mangaItem.id}/${fileName}.512.jpg`;
  };

  // Mendapatkan nama dari relasi (misal: author, artist, scanlation_group)
  const getRelationshipName = (item: Manga | Chapter, type: string): string => {
    const rel = item.relationships.find(r => r.type === type);
    return rel?.attributes?.name || "Tidak diketahui";
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <svg className="animate-spin h-12 w-12 text-sky-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl">Memuat detail manga...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <div className="bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded-lg text-center">
          <p className="text-xl font-semibold">Oops! Terjadi Kesalahan</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!manga) {
    // Seharusnya sudah ditangani oleh error state, tapi sebagai fallback
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Manga tidak ditemukan.</div>;
  }

  const title = manga.attributes.title.en || manga.attributes.title[Object.keys(manga.attributes.title)[0]] || "Tanpa Judul";
  const description = manga.attributes.description.en || manga.attributes.description[Object.keys(manga.attributes.description)[0]] || "Tidak ada deskripsi.";
  const year = manga.attributes.year || "N/A";
  const status = manga.attributes.status || "N/A";
  const authorName = getRelationshipName(manga, "author");
  const artistName = getRelationshipName(manga, "artist");
  const coverUrl = getMainCoverUrl(manga);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header dengan Tombol Kembali */}
        <div className="mb-6">
          <a href="/" className="text-sky-400 hover:text-sky-300 transition-colors duration-200 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Daftar Manga
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom Kiri: Cover dan Info Singkat */}
          <div className="md:col-span-1">
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src={coverUrl}
                alt={`Sampul ${title}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
                priority // Gambar utama di halaman detail, jadi prioritaskan
                unoptimized={coverUrl.startsWith("https://placehold.co")}
                 onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/300x450/1F2937/E5E7EB?text=Gagal+Muat";
                  }}
              />
            </div>
            <div className="mt-4 bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-sky-400 mb-2">Info</h3>
              <p className="text-sm"><strong className="text-gray-400">Tahun:</strong> {year}</p>
              <p className="text-sm"><strong className="text-gray-400">Status:</strong> <span className="capitalize">{status}</span></p>
              <p className="text-sm"><strong className="text-gray-400">Rating Konten:</strong> <span className="capitalize">{manga.attributes.contentRating}</span></p>
              <p className="text-sm"><strong className="text-gray-400">Author:</strong> {authorName}</p>
              <p className="text-sm"><strong className="text-gray-400">Artist:</strong> {artistName}</p>
            </div>
          </div>

          {/* Kolom Kanan: Judul, Deskripsi, Genre, Chapter */}
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold text-sky-400 mb-2">{title}</h1>
            {manga.attributes.altTitles.filter(alt => alt.en).length > 0 && (
              <p className="text-md text-gray-400 mb-4">
                Judul Alternatif: {manga.attributes.altTitles.filter(alt => alt.en).map(alt => alt.en).join(', ')}
              </p>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-sky-500 mb-2">Genre</h2>
              <div className="flex flex-wrap gap-2">
                {manga.attributes.tags.map((tag) => (
                  <span key={tag.id} className={`text-xs font-medium px-3 py-1 rounded-full ${
                    tag.attributes.group === 'genre' ? 'bg-sky-700 text-sky-100' :
                    tag.attributes.group === 'theme' ? 'bg-emerald-700 text-emerald-100' :
                    tag.attributes.group === 'format' ? 'bg-amber-700 text-amber-100' :
                    'bg-gray-700 text-gray-300' // Fallback color
                  }`}>
                    {tag.attributes.name.en || tag.attributes.name[Object.keys(tag.attributes.name)[0]]}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-sky-500 mb-2">Deskripsi</h2>
              <div
                className="prose prose-sm prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, "<br />") || "Tidak ada deskripsi." }}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-sky-500 mb-3">Chapter</h2>
              {chapters.length > 0 ? (
                <ul className="space-y-2 max-h-96 overflow-y-auto bg-gray-800 p-3 rounded-md">
                  {chapters.map((chapter) => (
                    <li key={chapter.id} className="p-3 bg-gray-700 rounded shadow hover:bg-gray-600 transition-colors duration-150">
                      <a
                        href={`#`} // Nantinya bisa diarahkan ke halaman pembaca chapter
                        className="block text-sky-300 hover:text-sky-200"
                      >
                        <span className="font-medium">
                          {chapter.attributes.volume && `Vol. ${chapter.attributes.volume} `}
                          Ch. {chapter.attributes.chapter || "N/A"}
                          {chapter.attributes.title && `: ${chapter.attributes.title}`}
                        </span>
                        <div className="text-xs text-gray-400 mt-1">
                          <span>Bahasa: {chapter.attributes.translatedLanguage.toUpperCase()}</span>
                          <span className="mx-1">|</span>
                          <span>Grup: {getRelationshipName(chapter, "scanlation_group")}</span>
                          <span className="mx-1">|</span>
                          <span>
                            Terbit: {new Date(chapter.attributes.publishAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Belum ada chapter yang tersedia.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}