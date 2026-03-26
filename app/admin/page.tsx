import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import Link from "next/link"
import { AdminInvitations } from "./admin-invitations"

export default async function AdminPage() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Access denied</p>
      </div>
    )
  }

  const supabase = createAdminClient()
  const { data: invitations } = await supabase
    .from("invitations")
    .select("*")
    .order("created_at", { ascending: false })
  const { data: users } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
        <Link href="/" className="text-sm text-primary hover:underline">
          Back to Site
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Users</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((u) => (
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
        <h2 className="text-lg font-semibold mb-4">Invitations</h2>
        <AdminInvitations invitations={invitations || []} />
      </section>
    </div>
  )
}
