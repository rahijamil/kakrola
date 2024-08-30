export const generateSlug = (name: string) => {
  // Convert to lowercase and replace spaces/special characters with hyphens
  let slug = name
    .toLowerCase()
    .normalize("NFD") // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^\w\s-]/g, "") // Remove non-alphanumeric characters (excluding hyphens)
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-"); // Replace multiple hyphens with a single one

  // Append unique suffix to avoid conflicts
  const uniqueSuffix = "template-" + Date.now();
  slug = `${slug}-${uniqueSuffix}`;

  return slug;
};
