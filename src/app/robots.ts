import type { MetadataRoute } from "next";

// Client demo: block every crawler from every page.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
