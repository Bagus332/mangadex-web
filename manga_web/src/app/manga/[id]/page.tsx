    // src/app/manga/[id]/page.tsx
    "use client";

    import { useParams } from "next/navigation";
    import Link from "next/link";
    import { useMangaDetails } from "@/hooks/useManga";
    import MangaDetailLayout from "@/components/manga/detail/MangaDetailLayout";
    import MangaCoverInfo from "@/components/manga/detail/MangaCoverInfo";
    import MangaAttributes from "@/components/manga/detail/MangaAttributes";
    import MangaChapterList from "@/components/manga/detail/MangaChapterList";
    import LoadingSpinner from "@/components/ui/LoadingSpinner";
    import ErrorMessage from "@/components/ui/ErrorMessage";

    export default function MangaDetailPage() {
      const params = useParams();
      const mangaId = typeof params.id === 'string' ? params.id : null;

      const { manga, chapters, loading, error } = useMangaDetails(mangaId);

      if (loading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
            <LoadingSpinner text="Memuat detail manga..." size="lg" />
          </div>
        );
      }

      if (error || !manga) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
            <ErrorMessage message={error || "Manga tidak ditemukan atau gagal dimuat."} className="w-full max-w-md" />
             <Link href="/" className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                Kembali ke Beranda
            </Link>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-6 print:hidden">
              <Link href="/" className="text-sky-400 hover:text-sky-300 transition-colors duration-200 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Kembali ke Daftar Manga
              </Link>
            </div>

            <MangaDetailLayout
              leftColumn={<MangaCoverInfo manga={manga} />}
              rightColumn={
                <>
                  <MangaAttributes manga={manga} />
                  <MangaChapterList chapters={chapters} mangaId={manga.id} />
                </>
              }
            />
          </div>
        </div>
      );
    }
    