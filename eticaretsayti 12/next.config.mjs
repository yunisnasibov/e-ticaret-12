/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      }
    ],
    domains: ['fakestoreapi.com', 'images.unsplash.com'],
  },
  // CSS optimizasyonu için ayarlar
  optimizeCss: false, // Critters ile ilgili sorunları önlemek için kapatıyoruz
  experimental: {
    // Sorun çıkaran deneysel özellikleri devre dışı bırakalım
    optimizeCss: false,
    optimizeServerReact: false
  }
}

export default nextConfig
