/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // or remove if you want Next optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api-hominex.ir",
        port: "",
        pathname: "/storage/properties/**",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
