import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/sitemap.xml", // Explicitly allow sitemap
          "/manifest.json", // Explicitly allow manifest
        ],
        disallow: [
          "/app/*", // All app routes
          "/api/*", // API routes
          "/auth/error",
          "/auth/forgot-password",
          "/auth/update-password",
          "/confirmation",
          "/*.config.json", // Block config JSON files
          "/*.config.xml", // Block config XML files
        ],
      },
      {
        userAgent: "GPTBot", // Specific rules for GPT bot
        disallow: ["/"],
      },
      {
        userAgent: "ChatGPT-User", // Block ChatGPT user agent
        disallow: ["/"],
      },
    ],
    sitemap: "https://kakrola.com/sitemap.xml",
  };
}
