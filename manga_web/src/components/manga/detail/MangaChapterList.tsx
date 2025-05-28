// src/components/manga/detail/MangaChapterList.tsx
"use client";

import type { Chapter, Manga } from "@/types/manga"; // Perlu Manga untuk getRelationshipName jika digunakan di sini
import { getRelationshipName } from "@/lib/utils"; // Kita akan buat utils.ts nanti

interface MangaChapterListProps {
  chapters: Chapter[];
  // manga: Manga; // Jika getRelationshipName membutuhkan konteks manga, atau pindahkan logikanya
}

const MangaChapterList: React.FC<MangaChapterListProps> = ({ chapters }) => {
  if (chapters.length === 0) {
    return <p className="text-gray-400">Belum ada chapter yang tersedia.</p>;
  }

  // Fungsi getRelationshipName bisa dipindah ke utils atau di-pass sebagai prop jika perlu
  // Untuk contoh ini, kita asumsikan getRelationshipName ada di utils
  // dan bisa bekerja dengan objek Chapter yang memiliki relationships.

  return (
    <div>
      <h2 className="text-xl font-semibold text-sky-500 mb-3">Chapter</h2>
      <ul className="space-y-2 max-h-96 overflow-y-auto bg-gray-800 p-3 rounded-md custom-scrollbar">
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
                {/* Pastikan 'scanlation_group' ada di includes saat fetch chapter */}
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
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748; /* gray-800 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568; /* gray-600 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096; /* gray-500 */
        }
      `}</style>
    </div>
  );
};

export default MangaChapterList;
