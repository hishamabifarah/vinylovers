/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
      {
        protocol: "https",
        hostname: "f90wrdja4t.ufs.sh",
        pathname: "/**",
      },
      {
        // This will match any subdomain of ufs.sh
        protocol: "https",
        hostname: "*.ufs.sh",
        pathname: "/**",
      },
    ],
  },
  rewrites: () => {
    return [
      { // keep original url but redirects to another page
        //
        source: "/hashtag/:tag", 
        destination: "/search?q=%23:tag",
      },
    ];
  },
}

export default nextConfig