/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.qrserver.com"],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5280/api/:path*', // Change 5280 to your backend port if different
      },
    ];
  },
};

module.exports = nextConfig;
