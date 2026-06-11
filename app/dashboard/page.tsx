import { Home, LayoutDashboard } from "lucide-react"

import { PageBreadcrumb } from "@/components/page-breadcrumb"

export default function Page() {
  return (
    <div className="space-y-6 p-4">
      <PageBreadcrumb
        items={[
          { title: "Home", href: "/", icon: Home },
          { title: "Dashboard", current: true, icon: LayoutDashboard },
        ]}
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">Dashboard</p>
        </div>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
}
