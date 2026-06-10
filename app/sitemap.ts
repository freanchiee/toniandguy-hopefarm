import { MetadataRoute } from "next";

// Switch to "https://toniandguywhitefield.com" once domain is purchased
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE_URL,                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/services`,                         lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/services/keratin-treatment`,       lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/services/balayage`,                lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/services/hair-colour`,             lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/services/bridal-hair`,             lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/services/haircut`,                 lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/blog`,                             lastModified: now, changeFrequency: "weekly",  priority: 0.75 },
    { url: `${SITE_URL}/blog/best-balayage-salon-whitefield-bangalore`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog/keratin-treatment-whitefield-guide`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog/toni-and-guy-whitefield-price-list-2025`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/stylists`,                         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/gallery`,                          lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/contact`,                          lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
  ];
}
