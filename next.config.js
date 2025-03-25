/** @type {import('next').NextConfig} */
/*
Version: 1.0.2
Build Version: 1.0.7
Last Updated: 2025-03-25
Changes: Optimized webpack configuration for Cloudflare Pages
*/
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com', 'images.unsplash.com'],
  },
  // Cloudflare Pages configuration
  output: 'standalone',
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

    // Optimize for Cloudflare Pages
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 24400000, // 24MB
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
      runtimeChunk: {
        name: 'runtime',
      },
    };

    // Disable webpack cache for edge runtime
    if (isServer) {
      config.cache = false;
    }

    // Disable source maps in production
    if (!isServer) {
      config.devtool = false;
    }

    return config;
  },
}

module.exports = nextConfig 