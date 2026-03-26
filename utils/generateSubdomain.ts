export function generateSubdomain(brideName: string, groomName: string): string {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  return `${clean(brideName)}-${clean(groomName)}`
}
