export const generateSlug = (name: string, isTemplate: boolean = false) => {
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
  const randomString = Math.random().toString(36).substring(2, 6); // Generates a short random string
  const uniqueSuffix = isTemplate
    ? `template-${Date.now()}-${randomString}`
    : `${Date.now()}-${randomString}`;
  slug = `${slug}-${uniqueSuffix}`;

  return slug;
};
