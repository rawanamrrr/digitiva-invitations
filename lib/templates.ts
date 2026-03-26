export interface Template {
  id: string
  name: string
  description: string
  demoUrl: string
  image: string
  category: string
}

export const templates: Template[] = [
  {
    id: "lamis",
    name: "Lamis",
    description: "A romantic and timeless design featuring soft floral accents and elegant serif typography.",
    demoUrl: "https://abdelrahmaan-lamis.digitivaa.com",
    image: "/abdelrahman-lamis.mp4",
    category: "Weddings",
  },
  {
    id: "ahmed",
    name: "Ahmed & Sameha",
    description: "Modern elegance with a touch of tradition. Clean lines and sophisticated layout.",
    demoUrl: "/demo/ahmed",
    image: "/Ahmed-Sameha.mp4",
    category: "Weddings",
  },
  {
    id: "vibrant-celebration",
    name: "Vibrant Joy",
    description: "Bold colors and playful elements for a celebration that's full of life.",
    demoUrl: "/demo/joy",
    image: "/vibrant-sweet-sixteen-party-invitation-with-balloo.jpg",
    category: "Birthdays",
  },
  {
    id: "minimalist-chic",
    name: "Minimalist Chic",
    description: "Understated luxury for those who appreciate the beauty of simplicity.",
    demoUrl: "/demo/minimalist",
    image: "/sleek-modern-corporate-event-invitation-dark-theme.jpg",
    category: "Corporate",
  },
  {
    id: "pastel-dreams",
    name: "Pastel Dreams",
    description: "Soft hues and whimsical illustrations for a magical celebration.",
    demoUrl: "/demo/dreams",
    image: "/cute-pastel-baby-shower-invitation-with-clouds-and.jpg",
    category: "Celebrations",
  },
  {
    id: "golden-gala",
    name: "Golden Gala",
    description: "Opulent gold accents and dark themes for a truly prestigious event.",
    demoUrl: "/demo/gala",
    image: "/luxurious-gold-anniversary-gala-invitation-elegant.jpg",
    category: "Celebrations",
  },
]
