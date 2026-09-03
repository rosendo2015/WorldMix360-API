export function createSlug(value: string, suffix?: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!suffix) {
    return slug;
  }

  return `${slug}-${suffix}`;
}
