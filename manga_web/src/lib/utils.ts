// src/lib/utils.ts
import type { Manga, Chapter, MangaRelationship, CoverArtAttributes } from "@/types/manga";

/**
 * Mendapatkan URL cover art utama dari objek manga.
 * @param mangaItem Objek manga.
 * @param size Ukuran yang diinginkan (misal: '.256.jpg', '.512.jpg', atau '' untuk original).
 * @returns URL string untuk cover art.
 */
export const getMainCoverUrl = (mangaItem: Manga | null, size: string = ".512.jpg"): string => {
  if (!mangaItem) return `https://placehold.co/300x450/1F2937/E5E7EB?text=Memuat...&font=roboto`;
  const coverArtRelationship = mangaItem.relationships.find(
    (rel): rel is MangaRelationship<CoverArtAttributes> => rel.type === "cover_art"
  );

  if (coverArtRelationship?.attributes?.fileName) {
    const fileName = coverArtRelationship.attributes.fileName;
    return `https://uploads.mangadex.org/covers/${mangaItem.id}/${fileName}${size}`;
  }
  return `https://placehold.co/300x450/1F2937/E5E7EB?text=Tanpa+Sampul&font=roboto`;
};

/**
 * Mendapatkan nama dari relasi tertentu (misal: author, artist, scanlation_group).
 * @param item Objek Manga atau Chapter.
 * @param type Tipe relasi yang dicari.
 * @returns Nama relasi atau "Tidak diketahui".
 */
export const getRelationshipName = (item: Manga | Chapter, type: string): string => {
  const rel = item.relationships.find(r => r.type === type);
  // Untuk author/artist, nama ada di rel.attributes.name
  // Untuk scanlation_group, nama ada di rel.attributes.name
  // Perlu disesuaikan jika struktur atribut berbeda untuk tipe relasi lain
  if (rel && rel.attributes && typeof rel.attributes.name === 'string') {
    return rel.attributes.name;
  }
  return "Tidak diketahui";
};

/**
 * Mendapatkan judul utama manga, dengan fallback ke bahasa lain jika 'en' tidak tersedia.
 * @param manga Objek manga.
 * @returns String judul.
 */
export const getMangaTitle = (manga: Manga): string => {
  return manga.attributes.title.en || manga.attributes.title[Object.keys(manga.attributes.title)[0]] || "Tanpa Judul";
}
