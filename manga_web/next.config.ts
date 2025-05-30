import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploads.mangadex.org",
        port: "",
        pathname: "/covers/**", // Memperbolehkan semua path di bawah /covers/
      },
      {
        protocol: "https",
        hostname: "placehold.co", // Untuk gambar placeholder Anda
        port: "",
        pathname: "/**", // Memperbolehkan semua path
      }
      // Tambahkan hostname lain di sini jika diperlukan
    ],
  },
};

export default nextConfig;
