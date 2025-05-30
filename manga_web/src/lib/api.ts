// src/lib/api.ts

import type {
  Manga,
  Chapter,
  MangaDexListResponse,
  MangaDexEntityResponse,
  AtHomeServerResponse, // Impor tipe baru
} from "../types/manga";

const BASE_URL = "https://api.mangadex.org";

// ... (fungsi fetchMangaList, getMangaDetails, getMangaChapters tetap sama) ...

export interface FetchMangaListOptions {
  limit?: number;
  offset?: number;
  order?: { [key: string]: "asc" | "desc" };
  includes?: string[];
  availableTranslatedLanguage?: string[];
  contentRating?: ("safe" | "suggestive" | "erotica" | "pornographic")[];
  title?: string;
  [key: string]: any;
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
    contentRating = [],
    title,
    ...otherParams
  } = options;

  const orderQuery = Object.entries(order)
    .map(([key, value]) => `order[${key}]=${value}`)
    .join("&");
  const includesQuery = includes.map((inc) => `includes[]=${inc}`).join("&");
  const langQuery = availableTranslatedLanguage
    .map((lang) => `availableTranslatedLanguage[]=${lang}`)
    .join("&");
  const contentRatingQuery = contentRating
    .map((rating) => `contentRating[]=${rating}`)
    .join("&");
  const titleQuery = title ? `title=${encodeURIComponent(title)}` : "";
  const otherParamsQuery = Object.entries(otherParams)
    .filter(([key]) => !['limit', 'offset', 'order', 'includes', 'availableTranslatedLanguage', 'contentRating', 'title'].includes(key))
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${key}[]=${encodeURIComponent(v)}`).join('&');
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join("&");

  const queryParams = [
    `limit=${limit}`,
    `offset=${offset}`,
    orderQuery,
    includesQuery,
    langQuery,
    contentRatingQuery,
    titleQuery,
    otherParamsQuery,
  ]
    .filter(Boolean)
    .join("&");

  const url = `${BASE_URL}/manga?${queryParams}`;
  console.log("[API] Fetching manga list from:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      let errorBody = "Unknown API error";
      try {
        const errorData = await response.json();
        errorBody = errorData.errors?.[0]?.detail || JSON.stringify(errorData) || response.statusText;
      } catch (e) {
        errorBody = response.statusText;
      }
      console.error(
        `[API] API Error fetching manga list: ${response.status} ${errorBody}`
      );
      throw new Error(
        `Gagal mengambil daftar manga: ${response.status} ${errorBody}`
      );
    }
    const data: MangaDexListResponse<Manga> = await response.json();
    return data;
  } catch (error) {
    console.error("[API] Error in fetchMangaList:", error);
    return null;
  }
}

export async function getMangaDetails(
  id: string
): Promise<MangaDexEntityResponse<Manga> | null> {
  if (!id) {
    console.error("[API] Manga ID is required for getMangaDetails");
    return null;
  }
  const includes = ["cover_art", "author", "artist"];
  const includesQuery = includes.map((inc) => `includes[]=${inc}`).join("&");
  const url = `${BASE_URL}/manga/${id}?${includesQuery}`;
  console.log("[API] Fetching manga details from:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      let errorBody = "Unknown API error";
      try {
        const errorData = await response.json();
        errorBody = errorData.errors?.[0]?.detail || JSON.stringify(errorData) || response.statusText;
      } catch (e) {
        errorBody = response.statusText;
      }
      console.error(
        `[API] API Error fetching manga details for ${id}: ${response.status} ${errorBody}`
      );
      throw new Error(
        `Gagal mengambil detail manga ${id}: ${response.status} ${errorBody}`
      );
    }
    const data: MangaDexEntityResponse<Manga> = await response.json();
    return data;
  } catch (error) {
    console.error(`[API] Error in getMangaDetails for manga ${id}:`, error);
    return null;
  }
}

export interface FetchMangaFeedOptions {
  limit?: number;
  offset?: number;
  translatedLanguage?: string[];
  order?: { [key: string]: "asc" | "desc" };
  includes?: string[];
  contentRating?: ("safe" | "suggestive" | "erotica" | "pornographic")[];
}

export async function getMangaChapters(
  mangaId: string,
  options: FetchMangaFeedOptions = {}
): Promise<MangaDexListResponse<Chapter> | null> {
  if (!mangaId) {
    console.error("[API] Manga ID is required for getMangaChapters");
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

  const orderQuery = Object.entries(order)
    .map(([key, value]) => `order[${key}]=${value}`)
    .join("&");
  const langQuery = translatedLanguage
    .map((lang) => `translatedLanguage[]=${lang}`)
    .join("&");
  const includesQuery = includes.map((inc) => `includes[]=${inc}`).join("&");
  const contentRatingQuery = contentRating
    .map((rating) => `contentRating[]=${rating}`)
    .join("&");

  const queryParams = [
    `limit=${limit}`,
    `offset=${offset}`,
    orderQuery,
    langQuery,
    includesQuery,
    contentRatingQuery,
  ]
    .filter(Boolean)
    .join("&");

  const url = `${BASE_URL}/manga/${mangaId}/feed?${queryParams}`;
  console.log("[API] Fetching manga chapters from:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      let errorBody = "Unknown API error";
      try {
        const errorData = await response.json();
        errorBody = errorData.errors?.[0]?.detail || JSON.stringify(errorData) || response.statusText;
      } catch (e) {
        errorBody = response.statusText;
      }
      console.error(
        `[API] API Error fetching chapters for manga ${mangaId}: ${response.status} ${errorBody}`
      );
      throw new Error(
        `Gagal mengambil chapter untuk manga ${mangaId}: ${response.status} ${errorBody}`
      );
    }
    const data: MangaDexListResponse<Chapter> = await response.json();
    return data;
  } catch (error) {
    console.error(`[API] Error in getMangaChapters for manga ${mangaId}:`, error);
    return null;
  }
}

/**
 * Mengambil data server dan halaman gambar untuk sebuah chapter.
 * @param chapterId ID chapter yang akan diambil halamannya.
 * @returns Promise yang resolve ke AtHomeServerResponse atau null jika terjadi error.
 */
export async function getChapterPagesData(
  chapterId: string
): Promise<AtHomeServerResponse | null> {
  if (!chapterId) {
    console.error("[API] Chapter ID is required for getChapterPagesData");
    return null;
  }
  const url = `${BASE_URL}/at-home/server/${chapterId}`;
  console.log("[API] Fetching chapter pages data from:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      let errorBody = "Unknown API error";
      try {
        const errorData = await response.json();
        errorBody = errorData.errors?.[0]?.detail || JSON.stringify(errorData) || response.statusText;
      } catch (e) {
        errorBody = response.statusText;
      }
      console.error(
        `[API] API Error fetching chapter pages for ${chapterId}: ${response.status} ${errorBody}`
      );
      throw new Error(
        `Gagal mengambil data halaman chapter ${chapterId}: ${response.status} ${errorBody}`
      );
    }
    const data: AtHomeServerResponse = await response.json();
    if (data.result !== "ok") {
        console.error(`[API] Chapter pages data for ${chapterId} returned result: ${data.result}`, data.errors);
        throw new Error(`Gagal mengambil data halaman chapter ${chapterId}: ${data.errors?.[0]?.detail || data.result}`);
    }
    return data;
  } catch (error) {
    console.error(`[API] Error in getChapterPagesData for chapter ${chapterId}:`, error);
    return null;
  }
}
