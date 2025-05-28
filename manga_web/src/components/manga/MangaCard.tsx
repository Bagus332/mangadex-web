// src/components/manga/MangaCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import type { Manga, CoverArtAttributes, MangaRelationship } from "@/types/manga"; // Menggunakan alias path

// Tipe prop untuk MangaCard
interface MangaCardProps {
  manga: Manga;
}

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

export default MangaCard;
