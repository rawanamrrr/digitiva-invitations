import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { AdminDashboard } from "./admin-dashboard"
import { AdminDenied } from "./admin-denied"

export default async function AdminPage() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "admin") {
    return <AdminDenied />
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
  const { data: discountCodes } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <AdminDashboard 
      users={users || []} 
      invitations={invitations || []} 
      discountCodes={discountCodes || []} 
    />
  )
}
