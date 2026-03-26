export const THEME_COLORS = [
  { id: "teal", name: "Teal", primary: "#0d9488", accent: "#14b8a6" },
  { id: "rose", name: "Rose", primary: "#be123c", accent: "#fb7185" },
  { id: "gold", name: "Gold", primary: "#b45309", accent: "#f59e0b" },
  { id: "navy", name: "Navy", primary: "#1e3a5f", accent: "#3b82f6" },
  { id: "emerald", name: "Emerald", primary: "#047857", accent: "#10b981" },
  { id: "violet", name: "Violet", primary: "#6d28d9", accent: "#8b5cf6" },
  { id: "blush", name: "Blush", primary: "#9f1239", accent: "#e11d48" },
  { id: "sage", name: "Sage", primary: "#4d7c0f", accent: "#84cc16" },
  { id: "burgundy", name: "Burgundy", primary: "#7f1d1d", accent: "#b91c1c" },
  { id: "dusty-pink", name: "Dusty Pink", primary: "#9d4b4b", accent: "#e8a0a0" },
  { id: "champagne", name: "Champagne", primary: "#a67c52", accent: "#d4a574" },
  { id: "copper", name: "Copper", primary: "#b45309", accent: "#ea580c" },
  { id: "slate", name: "Slate", primary: "#334155", accent: "#64748b" },
  { id: "coral", name: "Coral", primary: "#c2410c", accent: "#f97316" },
  { id: "lavender", name: "Lavender", primary: "#6b21a8", accent: "#a78bfa" },
  { id: "mint", name: "Mint", primary: "#15803d", accent: "#4ade80" },
  { id: "peach", name: "Peach", primary: "#c2410c", accent: "#fdba74" },
  { id: "charcoal", name: "Charcoal", primary: "#1e293b", accent: "#475569" },
  { id: "terracotta", name: "Terracotta", primary: "#9a3412", accent: "#c2410c" },
  { id: "sky", name: "Sky", primary: "#0369a1", accent: "#38bdf8" },
  { id: "plum", name: "Plum", primary: "#581c87", accent: "#a855f7" },
  { id: "forest", name: "Forest", primary: "#166534", accent: "#22c55e" },
  { id: "rust", name: "Rust", primary: "#991b1b", accent: "#dc2626" },
  { id: "ocean", name: "Ocean", primary: "#0e7490", accent: "#06b6d4" },
] as const

function isHexColor(value: string): boolean {
  return /^#?[0-9A-Fa-f]{6}$/.test(value.trim())
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace(/^#/, "")
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join("")}`
}

/** Relative luminance (0–1). > 0.5 is light, use dark text. */
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255)
  const srgb = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
}

function isLight(hex: string): boolean {
  return luminance(hex) > 0.5
}

/** Mix two hex colors. amount 0 = full base, 1 = full mix. */
function mixHex(base: string, mix: string, amount: number): string {
  const [br, bg, bb] = hexToRgb(base)
  const [mr, mg, mb] = hexToRgb(mix)
  return rgbToHex(
    br + (mr - br) * amount,
    bg + (mg - bg) * amount,
    bb + (mb - bb) * amount
  )
}

/** Lighten (mix with white) */
function lightenHex(hex: string, amount = 0.25): string {
  return mixHex(hex, "#ffffff", amount)
}

/** Darken (mix with black) */
function darkenHex(hex: string, amount = 0.2): string {
  return mixHex(hex, "#000000", amount)
}

export const INVITATION_TEXT_ON_LIGHT = "#1a1a1a"
export const INVITATION_TEXT_ON_DARK = "#fafafa"

export type ThemePalette = {
  id: string
  name: string
  primary: string
  accent: string
  /** Background tint for the invitation (light shade of primary) */
  background: string
  /** Main text on background */
  foreground: string
  /** Text on primary (buttons, etc.) */
  primaryForeground: string
  /** Text on accent */
  accentForeground: string
  /** Darker shade for borders/shadows */
  primaryDark: string
  /** Very light shade for subtle sections */
  primaryLight: string
  /** Card/section background (slightly tinted) */
  card: string
  /** Muted text and subtle areas */
  muted: string
  mutedForeground: string
}

function paletteFromPrimary(primary: string): ThemePalette {
  const accent = lightenHex(primary, 0.3)
  const primaryDark = darkenHex(primary, 0.15)
  const primaryLight = lightenHex(primary, 0.85)
  const background = lightenHex(primary, 0.94)
  const card = lightenHex(primary, 0.96)
  const muted = lightenHex(primary, 0.9)
  const foreground = isLight(background) ? INVITATION_TEXT_ON_LIGHT : INVITATION_TEXT_ON_DARK
  const primaryForeground = isLight(primary) ? INVITATION_TEXT_ON_LIGHT : INVITATION_TEXT_ON_DARK
  const accentForeground = isLight(accent) ? INVITATION_TEXT_ON_LIGHT : INVITATION_TEXT_ON_DARK
  const mutedForeground = isLight(muted) ? "#4b5563" : "#d1d5db"
  return {
    id: "custom",
    name: "Custom",
    primary,
    accent,
    background,
    foreground,
    primaryForeground,
    accentForeground,
    primaryDark,
    primaryLight,
    card,
    muted,
    mutedForeground,
  }
}

export function getThemeColors(themeId: string | null | undefined): ThemePalette {
  const id = (themeId || "teal").trim()
  if (isHexColor(id)) {
    const primary = id.startsWith("#") ? id : `#${id}`
    return paletteFromPrimary(primary)
  }
  const found = THEME_COLORS.find((c) => c.id === id)
  const base = found ?? THEME_COLORS[0]
  return paletteFromPrimary(base.primary)
}
