import { auth } from "@/lib/auth"
import Link from "next/link"
import { Header } from "@/components/header"

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await auth()
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 sm:pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
