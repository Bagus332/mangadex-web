// src/app/page.tsx
import Link from 'next/link';
import { BookOpen, Code, Mail, Github, UserCircle, BotMessageSquare } from 'lucide-react'; // Menggunakan lucide-react untuk ikon

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-sky-900 text-white flex flex-col">
      {/* Header Navigasi bisa ditambahkan di layout.tsx, atau di sini jika spesifik untuk halaman ini */}

      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
        <div className="bg-white/10 backdrop-blur-md p-8 sm:p-12 rounded-xl shadow-2xl max-w-2xl mx-auto">
          <img src="https://res.cloudinary.com/dy03ciscg/image/upload/WhatsApp_Image_2025-05-31_at_09.31.53_9c95e1f1_ypvcvb.jpg" alt="Profile Picture" className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mb-6 mx-auto object-cover shadow-lg" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Bagus Sadewa
          </h1>
          <p className="text-xl sm:text-2xl text-sky-300 mb-8">
            Web Developer & Penggemar Manga
          </p>
          <p className="text-md sm:text-lg text-gray-300 max-w-xl mx-auto mb-10">
            Selamat datang di portofolio pribadi saya. Di sini Anda dapat menemukan proyek-proyek yang telah saya kerjakan dan sedikit tentang saya.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/manga" legacyBehavior>
              <a className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105 inline-flex items-center">
                <BookOpen size={20} className="mr-2" />
                Jelajahi Proyek Manga
              </a>
            </Link>
            <a
              href="https://github.com/Bagus332?tab=repositories"
              className="border-2 border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition-all transform hover:scale-105 inline-flex items-center"
            >
              <Code size={20} className="mr-2" />
              Lihat Proyek Lain
            </a>
          </div>
        </div>
      </section>

      {/* Bagian "Tentang Saya" (Contoh) */}
      <section id="about" className="py-16 sm:py-20 bg-gray-800/50">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-sky-400">Tentang Saya</h2>
          <UserCircle size={80} className="mx-auto mb-6 text-sky-300" />
          <p className="text-lg text-gray-300 leading-relaxed mb-4">
            Saya adalah seorang pengembang web dengan antusiasme tinggi terhadap teknologi modern dan pembuatan aplikasi web yang intuitif dan menarik. Saya senang belajar hal baru dan selalu mencari tantangan untuk mengembangkan kemampuan saya.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            Selain coding, saya juga menikmati membaca manga dan mengeksplorasi berbagai cerita dan karya seni yang ada di dalamnya. Proyek MangaDex Explorer ini adalah salah satu cara saya menggabungkan kedua minat saya tersebut.
          </p>
        </div>
      </section>

      {/* Bagian Proyek (Contoh) */}
      <section id="projects" className="py-16 sm:py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-sky-400">Proyek Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Proyek MangaDex Explorer */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-sky-500/30 transition-shadow duration-300">
              <BookOpen size={48} className="mb-4 text-sky-400" />
              <h3 className="text-2xl font-semibold mb-3 text-white">MangaDex Explorer</h3>
              <p className="text-gray-400 mb-4">
                Sebuah aplikasi web untuk menjelajahi, mencari, dan membaca manga dari API MangaDex. Dibangun dengan Next.js, TypeScript, dan Tailwind CSS.
              </p>
              <Link href="/manga" legacyBehavior>
                <a className="inline-flex items-center text-sky-400 hover:text-sky-300 font-medium">
                  Lihat Proyek <span aria-hidden="true" className="ml-1">&rarr;</span>
                </a>
              </Link>
            </div>

            {/* Proyek Placeholder Lain */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-teal-500/30 transition-shadow duration-300">
              <BotMessageSquare size={48} className="mb-4 text-teal-400" />
              <h3 className="text-2xl font-semibold mb-3 text-white">Discord Bot</h3>
              <p className="text-gray-400 mb-4">
                Discord bot yang dibuat untuk mengelola komunitas dan memberikan informasi terkini tentang manga. Bot ini dapat memberikan notifikasi rilis baru dan menjawab pertanyaan umum.
                menggunakan Node.js dan Discord.js dan gemini genAI untuk menjawab pertanyaan pengguna.
              </p>
              <a href="#" className="inline-flex items-center text-teal-400 hover:text-teal-300 font-medium">
                Detail <span aria-hidden="true" className="ml-1">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian Kontak (Contoh) */}
      <section id="contact" className="py-16 sm:py-20 bg-gray-800/50">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-sky-400">Hubungi Saya</h2>
          <p className="text-lg text-gray-300 mb-8">
            Jika Anda tertarik untuk berdiskusi lebih lanjut, jangan ragu untuk menghubungi saya melalui:
          </p>
          <div className="flex justify-center space-x-6">
            <a href="mailto:bagussadewa332@gmail.com" className="text-gray-400 hover:text-sky-400 transition-colors">
              <Mail size={32} />
              <span className="sr-only">Email</span>
            </a>
            <a href="https://github.com/Bagus332" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-400 transition-colors">
              <Github size={32} />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer Sederhana */}
      <footer className="text-center p-6 sm:p-8 text-gray-500 border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} Bagus Sadewa. Dibuat dengan Next.js dan Tailwind CSS.</p>
      </footer>
    </div>
  );
}
