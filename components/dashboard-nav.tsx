"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { User, LogOut, LayoutDashboard, Plus, Shield } from "lucide-react"

export function DashboardNav({
  user,
}: {
  user?: { name?: string | null; email?: string | null; role?: string } | null
}) {
  const isAdmin = (user as { role?: string })?.role === "admin"
  return (
    <nav className="flex items-center gap-4">
      <Link
        href="/dashboard/create"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <Plus className="w-4 h-4" />
        Create
      </Link>
      <Link
        href="/dashboard/invitations"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <LayoutDashboard className="w-4 h-4" />
        Invitations
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <Shield className="w-4 h-4" />
          Admin
        </Link>
      )}
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="w-4 h-4" />
        {user?.name || user?.email}
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </nav>
  )
}
