export function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let slug = ""
  for (let i = 0; i < 12; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return slug
}
