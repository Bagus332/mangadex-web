import { useState, useEffect, useRef } from "react";
import { Manga, MangaTag } from "@/types/manga";
import { fetchMangaList, fetchGenreList } from "@/lib/api";

export function useMangaFilters() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [genreList, setGenreList] = useState<MangaTag[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch genre list
  useEffect(() => {
    fetchGenreList().then(setGenreList).catch(() => setGenreList([]));
  }, []);

  // Debounce search
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [search]);

  return {
    search,
    setSearch,
    debouncedSearch,
    genreList,
    selectedGenre,
    setSelectedGenre,
    year,
    setYear,
    status,
    setStatus,
  };
}

export function useMangaList(filters: {
  debouncedSearch: string;
  selectedGenre: string;
  year: string;
  status: string;
}) {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchMangaList(filters)
      .then(setMangaList)
      .catch((err) => setError(err.message || "Gagal mengambil daftar manga."))
      .finally(() => setLoading(false));
  }, [filters.debouncedSearch, filters.selectedGenre, filters.year, filters.status]);

  return { mangaList, loading, error };
}
