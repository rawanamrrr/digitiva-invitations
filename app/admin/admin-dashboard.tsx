"use client"

import Link from "next/link"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"
import { AdminInvitations, type Invitation } from "./admin-invitations"

type UserRow = {
  id: string
  name: string | null
  email: string | null
  role: string | null
  created_at: string
}

export function AdminDashboard({
  users,
  invitations,
}: {
  users: UserRow[]
  invitations: Invitation[]
}) {
  const { t } = useSiteLanguage()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold">{t("admin.title")}</h1>
        <Link href="/" className="text-sm text-primary hover:underline">
          {t("admin.back")}
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">{t("admin.users")}</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">{t("admin.th.name")}</th>
                <th className="text-left p-3">{t("admin.th.email")}</th>
                <th className="text-left p-3">{t("admin.th.role")}</th>
                <th className="text-left p-3">{t("admin.th.created")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">{t("admin.invitations")}</h2>
        <AdminInvitations invitations={invitations} />
      </section>
    </div>
  )
}
