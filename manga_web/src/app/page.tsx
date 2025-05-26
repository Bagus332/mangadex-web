"use client";
import React, { useEffect, useState } from "react";

type Manga = {
  id: string;
  attributes: {
    title: { [lang: string]: string };
    description: { [lang: string]: string };
    tags: { attributes: { name: { [lang: string]: string } } }[];
  };
  relationships: { type: string; id: string }[];
};

const fetchMangaList = async (): Promise<Manga[]> => {
  const res = await fetch(
    "https://api.mangadex.org/manga?limit=10&availableTranslatedLanguage[]=en&order[followedCount]=desc"
  );
  const data = await res.json();
  return data.data;
};

const getCoverUrl = (manga: Manga) => {
  const coverRel = manga.relationships.find((rel) => rel.type === "cover_art");
  if (!coverRel) return "";
  return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.id}.256.jpg`;
};

export default function MangaListPage() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);

  useEffect(() => {
    fetchMangaList().then(setMangaList);
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>MangaDex Reader</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {mangaList.map((manga) => (
          <div
            key={manga.id}
            style={{
              width: 200,
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 12,
              background: "#fafafa",
            }}
          >
            <img
              src={getCoverUrl(manga)}
              alt={manga.attributes.title.en || "cover"}
              style={{ width: "100%", borderRadius: 4, marginBottom: 8 }}
              loading="lazy"
            />
            <h2 style={{ fontSize: 18, margin: "8px 0" }}>
              {manga.attributes.title.en || "No Title"}
            </h2>
            <p style={{ fontSize: 14, color: "#555" }}>
              {manga.attributes.description.en
                ? manga.attributes.description.en.slice(0, 100) + "..."
                : "No description."}
            </p>
            <div style={{ marginTop: 8 }}>
              {manga.attributes.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  style={{
                    background: "#eee",
                    borderRadius: 4,
                    padding: "2px 6px",
                    fontSize: 12,
                    marginRight: 4,
                  }}
                >
                  {tag.attributes.name.en}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}