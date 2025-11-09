// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // deprecated
    remotePatterns: [
      // Tus imágenes de cursos
      {
        protocol: 'https',
        hostname: 'facialix.com',
      },
      {
        protocol: 'https',
        hostname: 'tse1.mm.bing.net',
      },
      {
        protocol: 'https',
        hostname: 'tse2.mm.bing.net',
      },
      {
        protocol: 'https',
        hostname: 'tse3.mm.bing.net',
      },
      {
        protocol: 'https',
        hostname: 'tse4.mm.bing.net',
      },
      // Para imágenes de usuarios (Google, etc.)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;