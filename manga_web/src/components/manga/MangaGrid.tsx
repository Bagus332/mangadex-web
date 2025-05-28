// src/components/manga/MangaGrid.tsx
"use client";

import type { Manga } from "@/types/manga"; // Menggunakan alias path
import MangaCard from "./MangaCard"; // Impor MangaCard dari file yang sama

// Tipe prop untuk MangaGrid
interface MangaGridProps {
  mangaList: Manga[];
}

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

export default MangaGrid;
