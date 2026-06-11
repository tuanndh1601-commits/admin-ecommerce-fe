import "@/app/globals.css" // Đảm bảo đúng đường dẫn css của bạn
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { ModeToggle } from "@/components/mode-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shadcn Sidebar 07 Layout",
  description: "Dựng layout theo mẫu sidebar-07 của Shadcn UI",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            {/* 1. Thanh Sidebar bên trái */}
            <TooltipProvider>
              <AppSidebar />

              {/* 2. Vùng chứa nội dung bên phải (Tự động co giãn theo Sidebar) */}
              <SidebarInset>
                <header className="flex flex-col gap-3 border-b px-4 py-3 transition-[width,height] duration-200 ease-linear md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <SidebarTrigger className="mt-1 -ml-1" />
                  </div>

                  <div className="flex items-center gap-2">
                    <NotificationDropdown />
                    <ModeToggle />
                  </div>
                </header>

                {children}
              </SidebarInset>
            </TooltipProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
