// src/components/manga/detail/MangaDetailLayout.tsx
"use client";

import React from "react";

interface MangaDetailLayoutProps {
  leftColumn: React.ReactNode;  // Komponen untuk kolom kiri (cover, info singkat)
  rightColumn: React.ReactNode; // Komponen untuk kolom kanan (atribut, chapter)
}

const MangaDetailLayout: React.FC<MangaDetailLayoutProps> = ({ leftColumn, rightColumn }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {/* Kolom Kiri */}
      <div className="md:col-span-1">
        {leftColumn}
      </div>

      {/* Kolom Kanan */}
      <div className="md:col-span-2 flex flex-col gap-6">
        {rightColumn}
      </div>
    </div>
  );
};

export default MangaDetailLayout;
