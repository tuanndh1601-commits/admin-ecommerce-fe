"use client"

import { Bell } from "lucide-react"
import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const notifications = [
  {
    id: "1",
    title: "New user signup",
    content: "A new user has joined the platform.",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    title: "Server update complete",
    content:
      "The backend servers finished deployment. The backend servers finished deployment.",
    time: "1h ago",
    read: true,
  },
  {
    id: "3",
    title: "Weekly report ready",
    content: "Your analytics report is available now.",
    time: "Yesterday",
    read: false,
  },
]

export function NotificationDropdown() {
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    []
  )

  const filteredNotifications = notifications

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 ? (
            <span className="pointer-events-none absolute -top-1 -right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white dark:bg-rose-400">
              {unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[320px] p-0">
        <div className="rounded-t-xl bg-muted/80 px-3 py-2 text-left">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Thông báo</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-y-auto px-2 py-1">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex w-full items-start gap-2 rounded-md px-3 py-2 transition hover:bg-muted/70 ${
                notification.read
                  ? "bg-background"
                  : "bg-rose-50 dark:bg-rose-900/40"
              }`}
            >
              <div className="flex flex-1 flex-col text-left">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm ${notification.read ? "font-medium text-foreground" : "font-semibold text-foreground"}`}
                  >
                    {notification.title}
                  </p>
                  <span className="text-[11px] text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {notification.content}
                </p>
              </div>

              {/* (dot removed) */}
            </div>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-sm">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
