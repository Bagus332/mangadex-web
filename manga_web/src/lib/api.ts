import { Manga, MangaTag, MangaDexListResponse } from "@/types/manga";

export async function fetchMangaList({
  debouncedSearch,
  selectedGenre,
  year,
  status,
}: {
  debouncedSearch: string;
  selectedGenre: string;
  year: string;
  status: string;
}): Promise<Manga[]> {
  const params = new URLSearchParams();
  params.append("limit", "20");
  params.append("availableTranslatedLanguage[]", "en");
  params.append("order[followedCount]", "desc");
  params.append("includes[]", "cover_art");
  if (debouncedSearch.trim()) params.append("title", debouncedSearch.trim());
  if (selectedGenre) params.append("includedTags[]", selectedGenre);
  if (year) params.append("year", year);
  if (status) params.append("status[]", status);

  const url = `https://api.mangadex.org/manga?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Kesalahan API (${res.status}): ${errorData.errors?.[0]?.detail || res.statusText}`
    );
  }
  const data: MangaDexListResponse<Manga> = await res.json();
  return data.data;
}

export async function fetchGenreList(): Promise<MangaTag[]> {
  const res = await fetch("https://api.mangadex.org/manga/tag");
  const data = await res.json();
  return data.data.filter((tag: MangaTag) => tag.attributes.group === "genre");
}
