import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the CV PDF to be embedded on the site itself.
  async headers() {
    return [
      {
        source: "/resume/:path*",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
    ];
  },
};

export default nextConfig;
