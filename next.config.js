/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.dicebear.com', 'picsum.photos'],
    unoptimized: true,
  },
};

module.exports = nextConfig;
