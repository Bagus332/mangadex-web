import { MangaResponse } from "../types/manga";

export const GetMangadetail = async (id: string) => {
  try {
    const res = await fetch(
      `https://api.mangadex.org/manga/${id}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data as MangaResponse;
  } catch {
    return null;
  }
}