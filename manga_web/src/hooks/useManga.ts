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
            setManga(null);
            setChapters([]);
            try {
              const mangaDetailsResponse: MangaDexEntityResponse<Manga> | null = await apiGetMangaDetails(mangaId);

              if (mangaDetailsResponse && mangaDetailsResponse.result === "ok") {
                setManga(mangaDetailsResponse.data);
                const chapterListResponse: MangaDexListResponse<Chapter> | null = await apiGetMangaChapters(mangaId, {
                  limit: 50,
                  order: { volume: "desc", chapter: "desc"},
                  translatedLanguage: ["en", "id"],
                  includes: ["scanlation_group"]
                });
                if (chapterListResponse && chapterListResponse.result === "ok") {
                  setChapters(chapterListResponse.data);
                } else {
                  console.warn(`Gagal mengambil chapter untuk manga ${mangaId}: ${chapterListResponse?.errors?.[0]?.detail || 'Unknown error'}`);
                  setChapters([]);
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
          setLoading(false);
          setManga(null);
          setChapters([]);
          setError(null);
        }
      }, [mangaId]);

      return { manga, chapters, loading, error };
    }
    