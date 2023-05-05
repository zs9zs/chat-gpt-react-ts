/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  output: "standalone",
  rewrites() {
    return [{
        source: '/api/:slug*',
        destination: `http://www.javachat.cn/:slug*`,
      },
    ]
  }
};

module.exports = nextConfig;
