// src/hooks/useManga.ts
"use client";

import { useState, useEffect } from "react";
import { getMangaDetails as apiGetMangaDetails, getMangaChapters as apiGetMangaChapters } from "@/lib/api";
import type { Manga, Chapter, MangaDexEntityResponse, MangaDexListResponse } from "@/types/manga";

interface UseMangaDetailsReturn {
  manga: Manga | null;
  chapters: Chapter[];
  loading: boolean;
  error: string | null;
}

export function useMangaDetails(mangaId: string | null): UseMangaDetailsReturn {
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mangaId) {
      const loadMangaData = async () => {
        setLoading(true);
        setError(null);
        setManga(null); // Reset manga state saat ID berubah
        setChapters([]);  // Reset chapter state
        try {
          const mangaDetailsResponse: MangaDexEntityResponse<Manga> | null = await apiGetMangaDetails(mangaId);

          if (mangaDetailsResponse && mangaDetailsResponse.result === "ok") {
            setManga(mangaDetailsResponse.data);
            // Ambil chapter setelah detail manga berhasil didapatkan
            const chapterListResponse: MangaDexListResponse<Chapter> | null = await apiGetMangaChapters(mangaId, {
              limit: 50, // Ambil lebih banyak chapter, atau buat paginasi chapter nanti
              order: { volume: "desc", chapter: "desc"},
              translatedLanguage: ["en", "id"], // Prioritaskan bahasa Inggris dan Indonesia
              includes: ["scanlation_group"]
            });
            if (chapterListResponse && chapterListResponse.result === "ok") {
              setChapters(chapterListResponse.data);
            } else {
              // Bisa set error spesifik untuk chapter jika perlu
              console.warn(`Gagal mengambil chapter untuk manga ${mangaId}: ${chapterListResponse?.errors?.[0]?.detail || 'Unknown error'}`);
              setChapters([]); // Pastikan chapter kosong jika gagal
            }
          } else {
            setError(mangaDetailsResponse?.errors?.[0]?.detail || "Manga tidak ditemukan atau gagal dimuat.");
          }
        } catch (err: any) {
          setError(err.message || "Terjadi kesalahan saat memuat data manga.");
          console.error("Error in useMangaDetails:", err);
        } finally {
          setLoading(false);
        }
      };
      loadMangaData();
    } else {
      // Jika tidak ada mangaId, set loading false dan data kosong
      setLoading(false);
      setManga(null);
      setChapters([]);
      setError(null); // Atau set error bahwa ID tidak valid
    }
  }, [mangaId]); // Jalankan ulang efek jika mangaId berubah

  return { manga, chapters, loading, error };
}
