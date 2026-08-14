import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    // Varsayılan dil (TR) artık /tr önekiyle değil doğrudan / üzerinden
    // sunuluyor (localePrefix: "as-needed"). Daha önce paylaşılmış veya
    // Google tarafından taranmış /tr/... linklerinin SEO değerini
    // korumak için kalıcı yönlendirme.
    return [
      { source: "/tr", destination: "/", permanent: true },
      { source: "/tr/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
