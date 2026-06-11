import { type LucideIcon } from "lucide-react"
import * as React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type PageBreadcrumbItem = {
  title: string
  href?: string
  current?: boolean
  icon?: LucideIcon
}

export function PageBreadcrumb({ items }: { items: PageBreadcrumbItem[] }) {
  return (
    <Breadcrumb className="py-2">
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={`${item.title}-${index}`}>
            <BreadcrumbItem>
              {item.href && !item.current ? (
                <BreadcrumbLink href={item.href} className="text-sm">
                  {item.icon && <item.icon className="mr-1 h-4 w-4" />}
                  {item.title}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-sm">
                  {item.icon && <item.icon className="mr-1 h-4 w-4" />}
                  {item.title}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Thiết kế với border - nhẹ nhàng, modern
export function PageBreadcrumbBorder({
  items,
}: {
  items: PageBreadcrumbItem[]
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="rounded-lg border border-border/50 bg-card/50 px-3 py-2 backdrop-blur-sm">
        {items.map((item, index) => (
          <React.Fragment key={`${item.title}-${index}`}>
            <BreadcrumbItem>
              {item.href && !item.current ? (
                <BreadcrumbLink
                  href={item.href}
                  className="border-l border-l-border/30 pl-2 text-sm first:border-0 first:pl-0"
                >
                  {item.icon && <item.icon className="mr-1 inline h-4 w-4" />}
                  {item.title}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="border-l border-l-border/30 pl-2 text-sm first:border-0 first:pl-0">
                  {item.icon && <item.icon className="mr-1 inline h-4 w-4" />}
                  {item.title}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Thiết kế với pill/badge - nổi bật, hiện đại
export function PageBreadcrumbPill({ items }: { items: PageBreadcrumbItem[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-2">
        {items.map((item, index) => (
          <React.Fragment key={`${item.title}-${index}`}>
            <BreadcrumbItem className="gap-0">
              {item.href && !item.current ? (
                <BreadcrumbLink
                  href={item.href}
                  className="rounded-full border border-secondary/80 bg-secondary/60 px-3 py-1.5 text-sm hover:border-primary/50 hover:bg-secondary"
                >
                  {item.icon && (
                    <item.icon className="mr-1 inline h-3.5 w-3.5" />
                  )}
                  {item.title}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="rounded-full border border-primary/30 bg-primary/20 px-3 py-1.5 text-sm">
                  {item.icon && (
                    <item.icon className="mr-1 inline h-3.5 w-3.5" />
                  )}
                  {item.title}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator className="px-1" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Thiết kế compact với icon - tối giản nhưng đầy đủ
export function PageBreadcrumbCompact({
  items,
}: {
  items: PageBreadcrumbItem[]
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-1">
        {items.map((item, index) => (
          <React.Fragment key={`${item.title}-${index}`}>
            <BreadcrumbItem className="inline-flex items-center gap-1.5">
              {item.href && !item.current ? (
                <BreadcrumbLink
                  href={item.href}
                  className="inline-flex items-center rounded border-b-2 border-transparent px-2 py-1 text-sm hover:border-b-primary/60"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="inline-flex items-center rounded-md border-l-2 border-l-primary bg-primary/10 px-2 py-1 text-sm">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator className="mx-0" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
