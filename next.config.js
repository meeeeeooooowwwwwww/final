/** @type {import('next').NextConfig} */
/*
Version: 1.0.5
Build Version: 1.0.7
Last Updated: 2025-03-25
Changes: Added edge runtime configuration for local testing
*/
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  images: {
    domains: ['rumble.com'],
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', 'date-fns'],
    runtime: 'edge',
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize for Cloudflare Pages
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
        runtimeChunk: 'single',
      };
    }

    // Disable webpack cache for edge runtime
    if (process.env.NEXT_RUNTIME === 'edge') {
      config.cache = false;
    }

    return config;
  },
};

module.exports = nextConfig; 