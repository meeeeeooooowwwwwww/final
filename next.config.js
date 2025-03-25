/** @type {import('next').NextConfig} */
/*
Build Version: 1.0.5
Last Updated: 2025-03-25
Changes: Merged webpack configurations and cleaned up config
*/
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com', 'images.unsplash.com'],
  },
  // Cloudflare Pages configuration
  output: 'standalone',
  // Additional configuration to resolve React hooks issues
  experimental: {
    appDir: true,
    serverActions: true,
  },
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add favicon configuration
    config.module.rules.push({
      test: /\.(png|jpg|gif|ico)$/i,
      type: 'asset/resource',
    });

    // Add fallbacks for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
}

module.exports = nextConfig 