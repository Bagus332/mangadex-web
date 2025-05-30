    // src/lib/api.ts

    import type {
      Manga,
      Chapter,
      MangaDexListResponse,
      MangaDexEntityResponse,
      AtHomeServerResponse,
      MangaStatus,
      MangaContentRating,
    } from "../types/manga";

    const BASE_URL = '/api/md-proxy'; // Mengarah ke proxy route

    export interface FetchMangaListOptions {
      limit?: number;
      offset?: number;
      order?: { [key: string]: "asc" | "desc" };
      includes?: string[];
      availableTranslatedLanguage?: string[];
      title?: string;
      year?: number | string;
      status?: MangaStatus[];
      contentRating?: MangaContentRating[];
    }

    export async function fetchMangaList(
      options: FetchMangaListOptions = {}
    ): Promise<MangaDexListResponse<Manga> | null> {
      const {
        limit = 20,
        offset = 0,
        order = { relevance: "desc" },
        includes = ["cover_art"],
        availableTranslatedLanguage = ["en"],
        title,
        year,
        status = [],
        contentRating = [],
      } = options;

      const queryParts: string[] = [];
      queryParts.push(`limit=${limit}`);
      queryParts.push(`offset=${offset}`);
      Object.entries(order).forEach(([key, value]) => {
        queryParts.push(`order[${key}]=${encodeURIComponent(value)}`);
      });
      includes.forEach((inc) => {
        queryParts.push(`includes[]=${encodeURIComponent(inc)}`);
      });
      availableTranslatedLanguage.forEach((lang) => {
        queryParts.push(`availableTranslatedLanguage[]=${encodeURIComponent(lang)}`);
      });
      if (title) {
        queryParts.push(`title=${encodeURIComponent(title)}`);
      }
      if (year !== undefined) {
        queryParts.push(`year=${year}`);
      }
      status.forEach((s) => {
        queryParts.push(`status[]=${encodeURIComponent(s)}`);
      });
      contentRating.forEach((cr) => {
        queryParts.push(`contentRating[]=${encodeURIComponent(cr)}`);
      });

      const queryParams = queryParts.filter(Boolean).join("&");
      const targetPath = "manga";
      const url = `${BASE_URL}/${targetPath}${queryParams ? `?${queryParams}` : ''}`;
      console.log("[Client API] Fetching manga list from proxy:", url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          let errorBody = "Unknown API error";
          try {
            const errorData = await response.json();
            errorBody = errorData.message || errorData.detail || JSON.stringify(errorData) || response.statusText;
          } catch (e) {
            errorBody = response.statusText;
          }
          console.error(`[Client API] API Error fetching manga list via proxy: ${response.status} ${errorBody}`);
          throw new Error(`Gagal mengambil daftar manga: ${response.status} ${errorBody}`);
        }
        const data: MangaDexListResponse<Manga> = await response.json();
        return data;
      } catch (error) {
        console.error("[Client API] Error in fetchMangaList via proxy:", error);
        return null;
      }
    }

    export async function getMangaDetails(
      id: string
    ): Promise<MangaDexEntityResponse<Manga> | null> {
      if (!id) {
        console.error("[Client API] Manga ID is required for getMangaDetails");
        return null;
      }
      const includesParams = ["cover_art", "author", "artist"];
      const includesQuery = includesParams.map((inc) => `includes[]=${inc}`).join("&");
      const targetPath = `manga/${id}`;
      const url = `${BASE_URL}/${targetPath}${includesQuery ? `?${includesQuery}` : ''}`;
      console.log("[Client API] Fetching manga details from proxy:", url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          let errorBody = "Unknown API error";
          try {
            const errorData = await response.json();
            errorBody = errorData.message || errorData.detail || JSON.stringify(errorData) || response.statusText;
          } catch (e) {
            errorBody = response.statusText;
          }
          console.error(`[Client API] API Error fetching manga details for ${id} via proxy: ${response.status} ${errorBody}`);
          throw new Error(`Gagal mengambil detail manga ${id}: ${response.status} ${errorBody}`);
        }
        const data: MangaDexEntityResponse<Manga> = await response.json();
        return data;
      } catch (error) {
        console.error(`[Client API] Error in getMangaDetails for manga ${id} via proxy:`, error);
        return null;
      }
    }

    export interface FetchMangaFeedOptions {
      limit?: number;
      offset?: number;
      translatedLanguage?: string[];
      order?: { [key: string]: "asc" | "desc" };
      includes?: string[];
      contentRating?: MangaContentRating[];
    }

    export async function getMangaChapters(
      mangaId: string,
      options: FetchMangaFeedOptions = {}
    ): Promise<MangaDexListResponse<Chapter> | null> {
      if (!mangaId) {
        console.error("[Client API] Manga ID is required for getMangaChapters");
        return null;
      }
      const {
        limit = 50,
        offset = 0,
        translatedLanguage = ["en"],
        order = { volume: "desc", chapter: "desc" },
        includes = ["scanlation_group"],
        contentRating = [],
      } = options;

      const queryPartsChapter: string[] = [];
      queryPartsChapter.push(`limit=${limit}`);
      queryPartsChapter.push(`offset=${offset}`);
      Object.entries(order).forEach(([key, value]) => {
        queryPartsChapter.push(`order[${key}]=${value}`);
      });
      translatedLanguage.forEach((lang) => {
        queryPartsChapter.push(`translatedLanguage[]=${lang}`);
      });
      includes.forEach((inc) => {
        queryPartsChapter.push(`includes[]=${inc}`);
      });
      contentRating.forEach((cr) => {
        queryPartsChapter.push(`contentRating[]=${cr}`);
      });

      const queryParamsChapter = queryPartsChapter.filter(Boolean).join("&");
      const targetPath = `manga/${mangaId}/feed`;
      const url = `${BASE_URL}/${targetPath}${queryParamsChapter ? `?${queryParamsChapter}` : ''}`;
      console.log("[Client API] Fetching manga chapters from proxy:", url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          let errorBody = "Unknown API error";
          try {
            const errorData = await response.json();
            errorBody = errorData.message || errorData.detail || JSON.stringify(errorData) || response.statusText;
          } catch (e) {
            errorBody = response.statusText;
          }
          console.error(`[Client API] API Error fetching chapters for manga ${mangaId} via proxy: ${response.status} ${errorBody}`);
          throw new Error(`Gagal mengambil chapter untuk manga ${mangaId}: ${response.status} ${errorBody}`);
        }
        const data: MangaDexListResponse<Chapter> = await response.json();
        return data;
      } catch (error) {
        console.error(`[Client API] Error in getMangaChapters for manga ${mangaId} via proxy:`, error);
        return null;
      }
    }

    export async function getChapterPagesData(
      chapterId: string
    ): Promise<AtHomeServerResponse | null> {
      if (!chapterId) {
        console.error("[Client API] Chapter ID is required for getChapterPagesData");
        return null;
      }
      const targetPath = `at-home/server/${chapterId}`;
      const url = `${BASE_URL}/${targetPath}`;
      console.log("[Client API] Fetching chapter pages data from proxy:", url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          let errorBody = "Unknown API error";
          try {
            const errorData = await response.json();
            errorBody = errorData.message || errorData.detail || JSON.stringify(errorData) || response.statusText;
          } catch (e) {
            errorBody = response.statusText;
          }
          console.error(`[Client API] API Error fetching chapter pages for ${chapterId} via proxy: ${response.status} ${errorBody}`);
          throw new Error(`Gagal mengambil data halaman chapter ${chapterId}: ${response.status} ${errorBody}`);
        }
        const data: AtHomeServerResponse = await response.json();
        if (data.result !== "ok") {
            console.error(`[Client API] Chapter pages data for ${chapterId} (via proxy) returned result: ${data.result}`, data.errors);
            throw new Error(`Gagal mengambil data halaman chapter ${chapterId} via proxy: ${data.errors?.[0]?.detail || data.result}`);
        }
        return data;
      } catch (error) {
        console.error(`[Client API] Error in getChapterPagesData for chapter ${chapterId} via proxy:`, error);
        return null;
      }
    }
    