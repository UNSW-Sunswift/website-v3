import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const appRoot = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: appRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.ap-southeast-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
