/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/manga.ts

/**
 * Representasi tipe data untuk Bahasa dalam objek API MangaDex.
 * Biasanya berupa objek dengan kode bahasa sebagai kunci dan nilai string.
 * Contoh: { en: "Manga Title", ja: "マンガのタイトル" }
 */
export type LocalizedString = {
  [lang: string]: string;
};

/**
 * Representasi Tag (Genre, Tema, Format) dari API MangaDex.
 */
export type MangaTag = {
  id: string;
  type: "tag";
  attributes: {
    name: LocalizedString; // Nama tag dalam berbagai bahasa
    description: LocalizedString; // Deskripsi tag
    group: "genre" | "theme" | "format" | string; // Grup tag
    version: number;
  };
};

/**
 * Representasi relasi yang bisa ada pada objek Manga atau Chapter.
 * Menggunakan tipe generik untuk atribut agar lebih fleksibel saat 'includes' digunakan.
 */
export type MangaRelationship<T = any> = {
  id: string;
  type: "manga" | "chapter" | "cover_art" | "author" | "artist" | "scanlation_group" | "tag" | string;
  related?: string; // Beberapa relasi memiliki 'related'
  attributes?: T; // Atribut akan ada jika relasi di-include (expanded)
};

/**
 * Atribut spesifik untuk relasi 'cover_art' saat di-include.
 */
export type CoverArtAttributes = {
  description: string;
  volume: string | null;
  fileName: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  version: number;
};

/**
 * Atribut spesifik untuk relasi 'author' atau 'artist' saat di-include.
 */
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

/**
 * Atribut spesifik untuk relasi 'scanlation_group' saat di-include.
 */
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


/**
 * Representasi objek Manga utama dari API MangaDex.
 */
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
    publicationDemographic: "shounen" | "shoujo" | "josei" | "seinen" | "none" | null;
    status: "ongoing" | "completed" | "hiatus" | "cancelled";
    year: number | null;
    contentRating: "safe" | "suggestive" | "erotica" | "pornographic";
    tags: MangaTag[];
    state: "draft" | "submitted" | "published" | "rejected";
    chapterNumbersResetOnNewVolume: boolean;
    createdAt: string;
    updatedAt: string;
    version: number;
    availableTranslatedLanguages: string[];
    latestUploadedChapter: string | null;
  };
  relationships: MangaRelationship<CoverArtAttributes | AuthorArtistAttributes | any>[]; // Bisa lebih spesifik
};

/**
 * Representasi objek Chapter dari API MangaDex.
 */
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

/**
 * Representasi respons umum dari API MangaDex saat mengambil daftar.
 */
export type MangaDexListResponse<T> = {
  result: "ok" | "error";
  response: "collection";
  data: T[];
  limit: number;
  offset: number;
  total: number;
};

/**
 * Representasi respons umum dari API MangaDex saat mengambil satu entitas.
 */
export type MangaDexEntityResponse<T> = {
  result: "ok" | "error";
  response: "entity";
  data: T;
};
