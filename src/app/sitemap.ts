import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://kakrola.com",
      lastModified: new Date(),
      changeFrequency: "daily", // Changed from yearly since it's a landing page
      priority: 1,
    },
    {
      url: "https://kakrola.com/pricing",
      lastModified: new Date(),
      changeFrequency: "weekly", // Changed from yearly since pricing might update
      priority: 0.8,
    },
    {
      url: "https://kakrola.com/auth/login",
      lastModified: new Date(),
      changeFrequency: "monthly", // Auth pages change less frequently
      priority: 0.5, // Lower priority since it's a utility page
    },
    {
      url: "https://kakrola.com/auth/signup",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7, // Higher than login since it's more important for growth
    },
    // {
    //   url: "https://kakrola.com/features",
    //   lastModified: new Date(),
    //   changeFrequency: "weekly",
    //   priority: 0.9, // High priority as it shows product value
    // },
    // {
    //   url: "https://kakrola.com/contact",
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.6,
    // },
    // {
    //   url: "https://kakrola.com/terms",
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.4,
    // },
    // {
    //   url: "https://kakrola.com/privacy",
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.4,
    // },
  ];
}
