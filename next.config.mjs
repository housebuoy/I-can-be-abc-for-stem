/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Sanity image domain
        pathname: '/images/**',  // Match all images from this path
      },
    ],
  },
};

export default nextConfig;
