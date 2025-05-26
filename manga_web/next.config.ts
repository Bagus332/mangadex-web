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
        hostname: "placehold.co", // Tambahkan juga untuk placeholder jika belum ada
        port: "",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
