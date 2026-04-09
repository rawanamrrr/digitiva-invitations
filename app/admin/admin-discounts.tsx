"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"

export type DiscountCode = {
  id: string
  code: string
  percentage: number
  max_uses: number | null
  current_uses: number
  active: boolean
  created_at: string
}

export function AdminDiscounts({ initialCodes }: { initialCodes: DiscountCode[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    code: "",
    percentage: "",
    maxUses: ""
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/discount-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          percentage: Number(form.percentage),
          maxUses: form.maxUses ? Number(form.maxUses) : null
        })
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || "Failed to create code")
      }
      setForm({ code: "", percentage: "", maxUses: "" })
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this code?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/discount-codes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">Create New Discount Code</h3>
        <form onSubmit={handleCreate} className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground mb-1 block">Code (e.g. SUMMER20)</label>
            <Input 
              required 
              value={form.code} 
              onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} 
              placeholder="Code"
            />
          </div>
          <div className="w-24">
            <label className="text-xs text-muted-foreground mb-1 block">Percent (%)</label>
            <Input 
              required 
              type="number" 
              min="1" 
              max="100" 
              value={form.percentage} 
              onChange={e => setForm(p => ({ ...p, percentage: e.target.value }))} 
              placeholder="e.g. 20"
            />
          </div>
          <div className="w-32">
            <label className="text-xs text-muted-foreground mb-1 block">Max Uses (opt)</label>
            <Input 
              type="number" 
              min="1" 
              value={form.maxUses} 
              onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))} 
              placeholder="Leave empty for unlimited"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Code"}
          </Button>
        </form>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Percentage</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Uses</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Max Uses</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Created</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialCodes.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-muted-foreground">No discount codes found.</td>
              </tr>
            )}
            {initialCodes.map(code => (
              <tr key={code.id} className="border-t">
                <td className="p-3 font-medium">{code.code}</td>
                <td className="p-3">{code.percentage}%</td>
                <td className="p-3">{code.current_uses}</td>
                <td className="p-3">{code.max_uses ?? "Unlimited"}</td>
                <td className="p-3 text-muted-foreground">{new Date(code.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                    onClick={() => handleDelete(code.id)}
                    disabled={deleting === code.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
