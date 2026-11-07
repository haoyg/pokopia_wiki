import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  experimental: {
    cpus: 1,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
