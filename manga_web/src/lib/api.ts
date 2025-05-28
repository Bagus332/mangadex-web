// src/lib/api.ts

import type {
  Manga,
  Chapter,
  MangaDexListResponse,
  MangaDexEntityResponse,
} from "../types/manga"; // Impor tipe data

// URL dasar untuk API MangaDex
const BASE_URL = "https://api.mangadex.org";

/**
 * Opsi untuk mengambil daftar manga.
 */
export interface FetchMangaListOptions {
  limit?: number;
  offset?: number;
  order?: { [key: string]: "asc" | "desc" };
  includes?: string[];
  availableTranslatedLanguage?: string[];
  contentRating?: ("safe" | "suggestive" | "erotica" | "pornographic")[]; // Eksplisitkan tipe untuk contentRating
  [key: string]: any; // Untuk parameter query lainnya
}

/**
 * Mengambil daftar manga dari API MangaDex.
 * @param options Opsi untuk kueri, seperti limit, offset, order, includes.
 * @returns Promise yang resolve ke MangaDexListResponse<Manga> atau null jika terjadi error.
 */
export async function fetchMangaList(
  options: FetchMangaListOptions = {}
): Promise<MangaDexListResponse<Manga> | null> {
  // Set nilai default jika tidak disediakan
  const {
    limit = 20,
    offset = 0,
    order = { followedCount: "desc" },
    includes = ["cover_art"],
    availableTranslatedLanguage = ["en"],
    contentRating = [], // Default ke array kosong jika tidak disediakan
    ...otherParams // Tangkap parameter lain yang mungkin ingin ditambahkan
  } = options;

  // Membuat query string dari objek 'order'
  const orderQuery = Object.entries(order)
    .map(([key, value]) => `order[${key}]=${value}`)
    .join("&");

  // Membuat query string dari array 'includes'
  const includesQuery = includes.map((inc) => `includes[]=${inc}`).join("&");

  // Membuat query string dari array 'availableTranslatedLanguage'
  const langQuery = availableTranslatedLanguage
    .map((lang) => `availableTranslatedLanguage[]=${lang}`)
    .join("&");

  // Membuat query string dari array 'contentRating'
  const contentRatingQuery = contentRating
    .map((rating) => `contentRating[]=${rating}`)
    .join("&");

  // Membuat query string dari parameter lainnya, pastikan tidak memproses ulang yang sudah ditangani
  const otherParamsQuery = Object.entries(otherParams)
    .filter(([key]) => !['limit', 'offset', 'order', 'includes', 'availableTranslatedLanguage', 'contentRating'].includes(key)) // Hindari duplikasi
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${key}[]=${encodeURIComponent(v)}`).join('&');
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join("&");

  // Gabungkan semua bagian query string
  const queryParams = [
    `limit=${limit}`,
    `offset=${offset}`,
    orderQuery,
    includesQuery,
    langQuery,
    contentRatingQuery, // Tambahkan contentRatingQuery
    otherParamsQuery,
  ]
    .filter(Boolean) // Hapus string kosong jika ada
    .join("&");

  const url = `${BASE_URL}/manga?${queryParams}`;
  console.log("Fetching manga list from:", url); // Log URL untuk debugging

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
        `API Error fetching manga list: ${response.status} ${errorBody}`
      );
      throw new Error(
        `Gagal mengambil daftar manga: ${response.status} ${errorBody}`
      );
    }
    const data: MangaDexListResponse<Manga> = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchMangaList:", error);
    return null;
  }
}

/**
 * Mengambil detail manga spesifik berdasarkan ID.
 * @param id ID manga yang akan diambil.
 * @returns Promise yang resolve ke MangaDexEntityResponse<Manga> atau null jika terjadi error.
 */
export async function getMangaDetails(
  id: string
): Promise<MangaDexEntityResponse<Manga> | null> {
  if (!id) {
    console.error("Manga ID is required for getMangaDetails");
    return null;
  }
  const includes = ["cover_art", "author", "artist"];
  const includesQuery = includes.map((inc) => `includes[]=${inc}`).join("&");
  const url = `${BASE_URL}/manga/${id}?${includesQuery}`;
  console.log("Fetching manga details from:", url);

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
        `API Error fetching manga details for ${id}: ${response.status} ${errorBody}`
      );
      throw new Error(
        `Gagal mengambil detail manga ${id}: ${response.status} ${errorBody}`
      );
    }
    const data: MangaDexEntityResponse<Manga> = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in getMangaDetails for manga ${id}:`, error);
    return null;
  }
}

/**
 * Opsi untuk mengambil feed chapter manga.
 */
export interface FetchMangaFeedOptions {
  limit?: number;
  offset?: number;
  translatedLanguage?: string[];
  order?: { [key: string]: "asc" | "desc" };
  includes?: string[];
  contentRating?: ("safe" | "suggestive" | "erotica" | "pornographic")[];
}

/**
 * Mengambil daftar chapter (feed) untuk manga tertentu.
 * @param mangaId ID manga yang chapternya akan diambil.
 * @param options Opsi untuk kueri feed chapter.
 * @returns Promise yang resolve ke MangaDexListResponse<Chapter> atau null jika terjadi error.
 */
export async function getMangaChapters(
  mangaId: string,
  options: FetchMangaFeedOptions = {}
): Promise<MangaDexListResponse<Chapter> | null> {
  if (!mangaId) {
    console.error("Manga ID is required for getMangaChapters");
    return null;
  }

  const {
    limit = 20,
    offset = 0,
    translatedLanguage = ["en"],
    order = { volume: "desc", chapter: "desc" },
    includes = ["scanlation_group"],
    contentRating = [], // Tambahkan contentRating juga di sini jika relevan untuk chapter feed
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
    contentRatingQuery, // Tambahkan ke query params
  ]
    .filter(Boolean)
    .join("&");

  const url = `${BASE_URL}/manga/${mangaId}/feed?${queryParams}`;
  console.log("Fetching manga chapters from:", url);

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
        `API Error fetching chapters for manga ${mangaId}: ${response.status} ${errorBody}`
      );
      throw new Error(
        `Gagal mengambil chapter untuk manga ${mangaId}: ${response.status} ${errorBody}`
      );
    }
    const data: MangaDexListResponse<Chapter> = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in getMangaChapters for manga ${mangaId}:`, error);
    return null;
  }
}
