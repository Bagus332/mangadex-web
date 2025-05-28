// src/components/manga/detail/MangaCoverInfo.tsx
"use client";

import Image from "next/image";
import type { Manga } from "@/types/manga";
import { getRelationshipName, getMainCoverUrl } from "@/lib/utils";

interface MangaCoverInfoProps {
  manga: Manga;
}

const MangaCoverInfo: React.FC<MangaCoverInfoProps> = ({ manga }) => {
  const title = manga.attributes.title.en || manga.attributes.title[Object.keys(manga.attributes.title)[0]] || "Tanpa Judul";
  const year = manga.attributes.year || "N/A";
  const status = manga.attributes.status || "N/A";
  const authorName = getRelationshipName(manga, "author");
  const artistName = getRelationshipName(manga, "artist");
  const coverUrl = getMainCoverUrl(manga, ".512.jpg"); // Menggunakan ukuran yang lebih besar untuk detail

  return (
    <div className="flex flex-col"> {/* Wrapper untuk memastikan komponen mengambil tinggi yang diperlukan */}
      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-xl mb-4">
        <Image
          src={coverUrl}
          alt={`Sampul ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw" // Sesuaikan sizes berdasarkan layout Anda
          style={{ objectFit: "cover" }}
          priority // Gambar utama di halaman detail, jadi prioritaskan
          unoptimized={coverUrl.startsWith("https://placehold.co")}
          onError={(e) => {
            // Ganti dengan placeholder jika gambar gagal dimuat
            (e.target as HTMLImageElement).src = "https://placehold.co/384x512/1F2937/E5E7EB?text=Gagal+Muat"; // Placeholder yang lebih besar
            (e.target as HTMLImageElement).srcset = ""; // Hapus srcset untuk menghindari loop error
          }}
        />
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-sky-400 mb-2">Info Detail</h3>
        <p className="text-sm mb-1"><strong className="text-gray-400 font-medium">Tahun:</strong> {year}</p>
        <p className="text-sm mb-1"><strong className="text-gray-400 font-medium">Status:</strong> <span className="capitalize">{status}</span></p>
        <p className="text-sm mb-1"><strong className="text-gray-400 font-medium">Rating Konten:</strong> <span className="capitalize">{manga.attributes.contentRating}</span></p>
        <p className="text-sm mb-1"><strong className="text-gray-400 font-medium">Author:</strong> {authorName}</p>
        <p className="text-sm"><strong className="text-gray-400 font-medium">Artist:</strong> {artistName}</p>
      </div>
    </div>
  );
};

export default MangaCoverInfo;
