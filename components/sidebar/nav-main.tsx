import { ChevronRight, type LucideIcon } from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const initialOpenIndex = items.findIndex((item) => item.isActive)
  const [openIndex, setOpenIndex] = useState<number | null>(
    initialOpenIndex === -1 ? null : initialOpenIndex
  )
  const { state, toggleSidebar } = useSidebar()
  const contentRefs = useRef<Array<HTMLDivElement | null>>([])
  const [contentHeights, setContentHeights] = useState<number[]>([])

  useEffect(() => {
    if (state === "collapsed") {
      setOpenIndex(null)
    }
  }, [state])

  useLayoutEffect(() => {
    setContentHeights(
      items.map((_, index) => contentRefs.current[index]?.scrollHeight ?? 0)
    )
  }, [items])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tools</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          const isOpen = openIndex === index
          const hasSubItems = item.items?.length

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                type="button"
                tooltip={item.title}
                aria-expanded={hasSubItems ? isOpen : undefined}
                onClick={() => {
                  if (state === "collapsed") {
                    toggleSidebar()
                    if (hasSubItems) {
                      setOpenIndex(index)
                    }
                  } else if (hasSubItems) {
                    setOpenIndex(isOpen ? null : index)
                  }
                }}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {hasSubItems ? (
                  <ChevronRight
                    className={`ml-auto transition-transform duration-200 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                ) : null}
              </SidebarMenuButton>

              {hasSubItems ? (
                <div
                  className="overflow-hidden transition-[height,opacity,transform] duration-200 ease-out"
                  style={{
                    height: isOpen ? `${contentHeights[index] ?? 0}px` : 0,
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateY(0)" : "translateY(-5px)",
                    willChange: "height, opacity, transform",
                  }}
                  aria-hidden={!isOpen}
                >
                  <div
                    ref={(el) => {
                      contentRefs.current[index] = el
                    }}
                  >
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </div>
                </div>
              ) : null}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
