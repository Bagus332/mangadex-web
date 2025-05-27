import { Manga } from "@/types/manga";
import MangaCard from "./MangaCard";

const MangaGrid = ({ mangaList }: { mangaList: Manga[] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 w-full max-w-7xl">
    {mangaList.map((manga) => (
      <MangaCard key={manga.id} manga={manga} />
    ))}
  </div>
);

export default MangaGrid;
