/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // "https://vm-presentations.s3.ap-south-1.amazonaws.com/public/*",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vm-presentations.s3.ap-south-1.amazonaws.com',
        pathname: '/public/*',
      },
    ],
  },
};
module.exports = nextConfig;
