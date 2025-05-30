// src/types/manga.ts

// ... (Definisi tipe yang sudah ada: LocalizedString, MangaTag, MangaDexError, MangaRelationship, dll.) ...

export type LocalizedString = {
  [lang: string]: string;
};

export type MangaTag = {
  id: string;
  type: "tag";
  attributes: {
    name: LocalizedString;
    description: LocalizedString;
    group: "genre" | "theme" | "format" | string;
    version: number;
  };
};

export type MangaDexError = {
  id: string;
  status: number;
  title: string;
  detail: string;
  context?: any;
};

export type MangaRelationship<T = any> = {
  id: string;
  type: "manga" | "chapter" | "cover_art" | "author" | "artist" | "scanlation_group" | "tag" | string;
  related?: string;
  attributes?: T;
};

export type CoverArtAttributes = {
  description: string;
  volume: string | null;
  fileName: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type AuthorArtistAttributes = {
    name: string;
    imageUrl: string | null;
    biography: LocalizedString;
    twitter: string | null;
    pixiv: string | null;
    melonBook: string | null;
    fanBox: string | null;
    booth: string | null;
    nicoVideo: string | null;
    skeb: string | null;
    fantia: string | null;
    tumblr: string | null;
    youtube: string | null;
    weibo: string | null;
    naver: string | null;
    website: string | null;
    createdAt: string;
    updatedAt: string;
    version: number;
};

export type ScanlationGroupAttributes = {
    name: string;
    altNames: LocalizedString[];
    locked: boolean;
    website: string | null;
    ircServer: string | null;
    ircChannel: string | null;
    discord: string | null;
    contactEmail: string | null;
    description: string | null;
    twitter: string | null;
    mangaUpdates: string | null;
    focusedLanguages: string[];
    official: boolean;
    verified: boolean;
    inactive: boolean;
    createdAt: string;
    updatedAt: string;
    version: number;
}

export type MangaStatus = "ongoing" | "completed" | "hiatus" | "cancelled";
export type MangaContentRating = "safe" | "suggestive" | "erotica" | "pornographic";
export type MangaPublicationDemographic = "shounen" | "shoujo" | "josei" | "seinen" | "none";


export type Manga = {
  id: string;
  type: "manga";
  attributes: {
    title: LocalizedString;
    altTitles: LocalizedString[];
    description: LocalizedString;
    isLocked: boolean;
    links: { [platform: string]: string } | null;
    originalLanguage: string;
    lastVolume: string | null;
    lastChapter: string | null;
    publicationDemographic: MangaPublicationDemographic | null;
    status: MangaStatus;
    year: number | null;
    contentRating: MangaContentRating;
    tags: MangaTag[];
    state: "draft" | "submitted" | "published" | "rejected";
    chapterNumbersResetOnNewVolume: boolean;
    createdAt: string;
    updatedAt: string;
    version: number;
    availableTranslatedLanguages: string[];
    latestUploadedChapter: string | null;
  };
  relationships: MangaRelationship<CoverArtAttributes | AuthorArtistAttributes | any>[];
};

export type Chapter = {
  id: string;
  type: "chapter";
  attributes: {
    volume: string | null;
    chapter: string | null;
    title: string | null;
    translatedLanguage: string;
    externalUrl: string | null;
    publishAt: string;
    readableAt: string;
    createdAt: string;
    updatedAt: string;
    pages: number;
    version: number;
  };
  relationships: MangaRelationship<ScanlationGroupAttributes | any>[];
};

export type ChapterPageData = {
  hash: string;
  data: string[];
  dataSaver: string[];
};

export type AtHomeServerResponse = {
  result: "ok" | "error";
  baseUrl: string;
  chapter: ChapterPageData;
  errors?: MangaDexError[];
};

export type MangaDexListResponse<T> = {
  result: "ok" | "error";
  response: "collection";
  data: T[];
  limit: number;
  offset: number;
  total: number;
  errors?: MangaDexError[];
};

export type MangaDexEntityResponse<T> = {
  result: "ok" | "error";
  response: "entity";
  data: T;
  errors?: MangaDexError[];
};

// Tipe untuk parameter filter pencarian yang lebih kompleks
export interface MangaSearchParameters {
  title?: string;
  year?: number | string; // Bisa string dari input, lalu di-parse
  status?: MangaStatus[];
  contentRating?: MangaContentRating[];
  // Tambahkan parameter lain di sini jika diperlukan
  // includedTags?: string[]; // ID Tag
  // authors?: string[]; // ID Author
}
