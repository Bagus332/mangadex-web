// src/components/manga/detail/MangaAttributes.tsx
"use client";

import type { Manga } from "@/types/manga";
import { getMangaTitle } from "@/lib/utils"; // Menggunakan utilitas untuk judul

interface MangaAttributesProps {
  manga: Manga;
}

const MangaAttributes: React.FC<MangaAttributesProps> = ({ manga }) => {
  const title = getMangaTitle(manga);
  // Ambil deskripsi dalam bahasa Inggris, atau bahasa pertama yang tersedia, atau default
  const descriptionHtml = (
      manga.attributes.description.en ||
      manga.attributes.description[Object.keys(manga.attributes.description)[0]] ||
      "Tidak ada deskripsi."
    ).replace(/\n/g, "<br />"); // Ganti newline dengan <br /> untuk tampilan HTML

  // Filter dan gabungkan judul alternatif yang berbahasa Inggris
  const altTitlesEn = manga.attributes.altTitles
    .filter(alt => alt.en)
    .map(alt => alt.en)
    .join(', ');

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-400 mb-1 sm:mb-2">{title}</h1>
      {altTitlesEn && (
        <p className="text-sm sm:text-md text-gray-400 mb-3 sm:mb-4">
          <strong className="font-medium">Judul Alternatif (EN):</strong> {altTitlesEn}
        </p>
      )}

      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-sky-500 mb-2">Genre & Tag</h2>
        <div className="flex flex-wrap gap-2">
          {manga.attributes.tags.map((tag) => (
            <span
              key={tag.id}
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                tag.attributes.group === 'genre' ? 'bg-sky-600 hover:bg-sky-700 text-sky-100' :
                tag.attributes.group === 'theme' ? 'bg-emerald-600 hover:bg-emerald-700 text-emerald-100' :
                tag.attributes.group === 'format' ? 'bg-amber-600 hover:bg-amber-700 text-amber-100' :
                'bg-gray-600 hover:bg-gray-700 text-gray-200' // Warna fallback
              } transition-colors duration-150`}
            >
              {tag.attributes.name.en || tag.attributes.name[Object.keys(tag.attributes.name)[0]]}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-sky-500 mb-2">Deskripsi</h2>
        {/* Menggunakan kelas 'prose' dari Tailwind Typography jika diinstal, atau styling manual */}
        <div
          className="text-sm sm:text-base text-gray-300 leading-relaxed prose prose-sm prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      </div>
    </div>
  );
};

export default MangaAttributes;
