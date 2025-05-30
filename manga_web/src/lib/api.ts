// src/lib/api.ts

import type {
  Manga,
  Chapter,
  MangaDexListResponse,
  MangaDexEntityResponse,
  AtHomeServerResponse,
  MangaStatus,
  MangaContentRating,
  // MangaPublicationDemographic, // Jika Anda ingin menambahkannya nanti
} from "../types/manga";

const BASE_URL = "https://api.mangadex.org";

export interface FetchMangaListOptions {
  limit?: number;
  offset?: number;
  order?: { [key: string]: "asc" | "desc" }; // Tetap fleksibel untuk berbagai jenis urutan
  includes?: string[];
  availableTranslatedLanguage?: string[];
  title?: string;
  year?: number | string;
  status?: MangaStatus[];
  contentRating?: MangaContentRating[];
  // Jika ada filter spesifik lain yang ingin Anda tambahkan secara eksplisit, definisikan di sini.
  // Contoh:
  // publicationDemographic?: MangaPublicationDemographic[];
  // includedTags?: string[]; // Array ID Tag
}

export async function fetchMangaList(
  options: FetchMangaListOptions = {}
): Promise<MangaDexListResponse<Manga> | null> {
  // Destrukturisasi semua opsi yang didefinisikan secara eksplisit
  const {
    limit = 20,
    offset = 0,
    order = { relevance: "desc" }, // Default order, bisa di-override dari pemanggil
    includes = ["cover_art"],
    availableTranslatedLanguage = ["en"],
    title,
    year,
    status = [], // Default ke array kosong jika tidak disediakan
    contentRating = [], // Default ke array kosong jika tidak disediakan
    // Hapus ...otherParams karena kita ingin lebih ketat
  } = options;

  const queryParts: string[] = [];
  queryParts.push(`limit=${limit}`);
  queryParts.push(`offset=${offset}`);

  // Proses 'order'
  Object.entries(order).forEach(([key, value]) => {
    queryParts.push(`order[${key}]=${encodeURIComponent(value)}`);
  });

  // Proses 'includes' (array)
  includes.forEach((inc) => {
    queryParts.push(`includes[]=${encodeURIComponent(inc)}`);
  });

  // Proses 'availableTranslatedLanguage' (array)
  availableTranslatedLanguage.forEach((lang) => {
    queryParts.push(`availableTranslatedLanguage[]=${encodeURIComponent(lang)}`);
  });

  // Proses 'title' (string)
  if (title) {
    queryParts.push(`title=${encodeURIComponent(title)}`);
  }

  // Proses 'year' (number atau string)
  if (year !== undefined) { // Cek undefined karena tahun 0 bisa jadi valid
    queryParts.push(`year=${year}`);
  }

  // Proses 'status' (array)
  status.forEach((s) => {
    queryParts.push(`status[]=${encodeURIComponent(s)}`);
  });

  // Proses 'contentRating' (array)
  contentRating.forEach((cr) => {
    queryParts.push(`contentRating[]=${encodeURIComponent(cr)}`);
  });

  // Jika Anda menambahkan filter lain ke FetchMangaListOptions, tambahkan logikanya di sini.
  // Contoh:
  // if (options.publicationDemographic) {
  //   options.publicationDemographic.forEach(pd => queryParts.push(`publicationDemographic[]=${encodeURIComponent(pd)}`));
  // }
  // if (options.includedTags) {
  //   options.includedTags.forEach(tagId => queryParts.push(`includedTags[]=${encodeURIComponent(tagId)}`));
  // }

  const queryParams = queryParts.filter(Boolean).join("&");
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
      console.error(`[API] API Error fetching manga list: ${response.status} ${errorBody}`);
      throw new Error(`Gagal mengambil daftar manga: ${response.status} ${errorBody}`);
    }
    const data: MangaDexListResponse<Manga> = await response.json();
    return data;
  } catch (error) {
    console.error("[API] Error in fetchMangaList:", error);
    return null;
  }
}

// ... (getMangaDetails, getMangaChapters, getChapterPagesData tetap sama) ...
// Pastikan impor tipe di fungsi lain juga sesuai jika ada perubahan di manga.ts

export async function getMangaDetails(
  id: string
): Promise<MangaDexEntityResponse<Manga> | null> {
  if (!id) {
    console.error("[API] Manga ID is required for getMangaDetails");
    return null;
  }
  const includesParams = ["cover_art", "author", "artist"];
  const includesQuery = includesParams.map((inc) => `includes[]=${inc}`).join("&");
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
  contentRating?: MangaContentRating[];
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
  const url = `${BASE_URL}/manga/${mangaId}/feed?${queryParamsChapter}`;
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
