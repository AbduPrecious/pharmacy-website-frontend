/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'balanced-activity-163f4ebd43.media.strapiapp.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig