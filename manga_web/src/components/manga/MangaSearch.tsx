import { MangaTag } from "@/types/manga";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  genreList: MangaTag[];
  selectedGenre: string;
  setSelectedGenre: (v: string) => void;
  year: string;
  setYear: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
};

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "hiatus", label: "Hiatus" },
  { value: "cancelled", label: "Cancelled" },
];

const MangaSearch = ({
  search,
  setSearch,
  genreList,
  selectedGenre,
  setSelectedGenre,
  year,
  setYear,
  status,
  setStatus,
}: Props) => (
  <section className="w-full max-w-4xl mb-8 flex flex-col sm:flex-row gap-4 items-stretch">
    <input
      type="text"
      className="flex-1 rounded-lg px-4 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
      placeholder="Cari judul manga..."
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
    <select
      className="rounded-lg px-3 py-2 bg-gray-800 text-white border border-gray-700"
      value={selectedGenre}
      onChange={e => setSelectedGenre(e.target.value)}
    >
      <option value="">Semua Genre</option>
      {genreList.map(tag => (
        <option key={tag.id} value={tag.id}>
          {tag.attributes.name.en || Object.values(tag.attributes.name)[0]}
        </option>
      ))}
    </select>
    <input
      type="number"
      min="1900"
      max={new Date().getFullYear()}
      className="w-28 rounded-lg px-3 py-2 bg-gray-800 text-white border border-gray-700"
      placeholder="Tahun"
      value={year}
      onChange={e => setYear(e.target.value)}
    />
    <select
      className="rounded-lg px-3 py-2 bg-gray-800 text-white border border-gray-700"
      value={status}
      onChange={e => setStatus(e.target.value)}
    >
      {STATUS_OPTIONS.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </section>
);

export default MangaSearch;
