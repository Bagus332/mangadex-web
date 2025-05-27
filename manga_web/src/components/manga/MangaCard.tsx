/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { Manga } from "@/types/manga";

// Komponen untuk menampilkan satu kartu Manga
const MangaCard = ({ manga }: { manga: Manga }) => {
  // Fungsi untuk mendapatkan URL cover art
  const getCoverUrl = (mangaItem: Manga): string => {
    const coverRel = mangaItem.relationships.find(
      (rel) => rel.type === "cover_art"
    );
    if (!coverRel || !coverRel.attributes || !("fileName" in coverRel.attributes)) {
      return "https://placehold.co/256x362/1F2937/E5E7EB?text=Tanpa+Sampul";
    }
    const fileName = (coverRel.attributes as any).fileName;
    return `https://uploads.mangadex.org/covers/${mangaItem.id}/${fileName}.256.jpg`;
  };

  const title =
    manga.attributes.title.en ||
    manga.attributes.title[Object.keys(manga.attributes.title)[0]] ||
    "Tanpa Judul";
  const year = manga.attributes.year || "N/A";
  const genres = manga.attributes.tags
    .filter((tag) => tag.attributes.group === "genre")
    .map((tag) => tag.attributes.name.en)
    .slice(0, 3);

  const coverUrl = getCoverUrl(manga);

  return (
    <Link href={`/manga/${manga.id}`} className="h-full">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full cursor-pointer">
        <div className="relative w-full aspect-[256/362]">
          <Image
            src={coverUrl}
            alt={`Sampul untuk ${title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            style={{ objectFit: "cover" }}
            priority={false}
            unoptimized={coverUrl.startsWith("https://placehold.co")}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/256x362/1F2937/E5E7EB?text=Gagal+Muat";
            }}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold text-white truncate mb-1" title={title}>
            {title}
          </h2>
          <p className="text-sm text-gray-400 mb-2">Tahun: {year}</p>
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
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
    </Link>
  );
};

export default MangaCard;
